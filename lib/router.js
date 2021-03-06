function Router(app, request, response) {
    this.app = app
    this.request = request
    this.response = response
    this.headers = []
    this.route()
}

Router.prototype.addCookie = function(name, value) {
    this.headers.push(['Set-Cookie', name + '=' + value + '; Path=/'])
}

Router.prototype.deleteCookie = function(name) {
    this.headers.push(['Set-Cookie', name + '=deleted; Expires=Thu, 01-Jan-1970 00:00:01 GMT; Path=/'])
}

Router.prototype.processSessions = function() {
    // if there is a session cookie set and it was still alive
    if (this.request.cookies['sessionId']) {
        this.session = Session.update(this.request.cookies['sessionId'])
        if (this.session === undefined) {
            this.session = Session.create(this.request.cookies['sessionId'])
            this.addCookie('sessionId', this.session.id)
        }
    }
    else {
        this.session = Session.create()
        this.addCookie('sessionId', this.session.id)
    }
}

Router.prototype.route = function() {
    var self = this
    
    self.processSessions()

    if (!self.session.errors)
        self.session.errors = []
    
    if (!self.session.message)
		self.session.message = {}
		
    if (self.request.extension === '') {
        var controllerPath = __dirname + '/../controller/' + self.request.controller + 'Controller.js' // produces: "./conroller/usersController.js"
        if (self.app.fs.existsSync(controllerPath) === false) { // if the controller file is not present, push the error and redirect to default view.
            self.session.errors.push(new Error('The requested controller \'' + self.request.controller + '\' was not found. Please create the file \'' + controllerPath + '\''))
            return self.redirect('/errors/notFound')
        }
        
        if (Settings.DEBUG === true) // reload the controller file from cache without restarting the server in debug mode only
            delete require.cache[require.resolve(controllerPath)]
        var controller = require('./controller').spawn(require(controllerPath))

        if (self.request.action in controller === false || typeof controller[self.request.action] != 'function') { // if there is no action function
            self.session.errors.push(new Error('The requested action \'' + self.request.action + '\' was not found. Please create the function \'' + self.request.action + '() {}\' in \''+ controllerPath +'\''))
            return self.redirect('/errors/notFound')
        }

        controller.router = self
        
        controller.before(function(error, data) {
            if (error)
                self.session.errors.push(error)
            controller[self.request.action](self.request.data, function(error, data) {
                if (error) {
                    if (Array.isArray(error))
                        self.session.errors.push.apply(self.session.errors, error)
                    else
                        self.session.errors.push(error)
                }
                if (data) {
					if (typeof(data) === 'function')
						return data()
					else if (typeof(data) === 'string') {
						return self.render(data)
					}
                }
                if (controller.render === true) {
                    controller.after(function(errors, data) {
                        if (data)
                            return self.render(data)
                        else {
                            return self.redirect('errors/notFound')
                        }
                    })
                }
            })
        })
    }
    else { // extenstion was provided. return the requested file from webroot.
        self.app.fs.readFile(Settings.rootDir + '/webroot' + self.request.url, function(error, data) {
            if (error) 
                return self.render(JSON.stringify(error)) //TODO generate appropriate headers.
            self.render(data)
        })
    }
}

Router.prototype.tempName = function(data) {
    self.app.fs.readFile(Settings.rootDir + '/view/' + self.request.controller + '/' + self.request.action + '.htm', function(error, data) { // try to read the view at path
        if (error)
            return self.render(JSON.stringify(error))
    })
}

Router.prototype.render = function(data) {
    this.session.errors = undefined // reset session errors and messages before rendering - they have already been sent to the view
    this.session.message = undefined
    var data = data || 'no data was received.'
    
    //prevent caching if in debug mode
    if (Settings.DEBUG === true) {
        this.headers.push(['Cache-Control'], ['no-cache, no-store, must-revalidate'])
        this.headers.push(['Pragma'], ['no-cache']) 
        this.headers.push(['Expires'], [0])
    }
    
    var length = typeof(data) === 'string' ? Buffer.byteLength(data, 'utf8') : data.length //correctly calculate length considering utf8
    
    this.headers.push(['Content-Length', length])
    this.headers.push(['Content-Type', this.request.mime])
    this.response.writeHead('200', this.headers)
    this.response.end(data)
}

Router.prototype.redirect = function(url) {
    this.response.writeHead('302', { 'Location': url });
    this.response.end();
}

module.exports = Router
module.exports = {
    render : true,
    view : {},
    defaultIndex : '', //if set to anything else will force the router to route to function "view" with data as variable if no approrpriate action is found.
    layout : 'default',
    title : '',
    
    before : function(callback) {
        callback()
    },
    
    after : function(callback) {
        var self = this
        var errors = []
        if (self.render === true) {
            require('fs').readFile(Settings.rootDir + '/view/layouts/' + self.layout + '.ejs', 'utf8', function(error, data) { // try to read the view at path
                if (error) 
                    self.router.session.errors.push(error)
				
				self.view.content = Settings.rootDir + '/view/' + self.router.request.controller + '/' + self.router.request.action + '.ejs'
                self.view.filename = Settings.rootDir + '/view/'
				self.view.title = self.title
				self.view.message = self.router.session.message
				self.view.errors = self.router.session.errors
				var renderedData = ''
				//process less files if in debug; TODO: move to ejs filter
				if (Settings.DEBUG === true) {                
					var lessSrc = require('fs').readFileSync('./webroot/less/bootstrap.less', 'utf8')
					Less.render(lessSrc, function (error, css) {
						if (error)
                            self.router.session.errors.push(error)
                        else
                            require('fs').writeFileSync('./webroot/css/style.css', css)
						
						try {
							renderedData = require('ejs').render(data, self.view) 
						}
						catch (error) {
                            self.router.session.errors.push(error)
						}
					})
				}
				else {
					renderedData = require('ejs').render(data, self.view) 
				}
				
				return callback(errors, renderedData)
            })
        }
        callback()
    }
}
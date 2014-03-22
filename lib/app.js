function App() {
    var self = this
    this.http = require('http')
    this.fs = require('fs')
    this.path = require('path')
    this.url = require('url')
    this.qs = require('querystring')
    
    global.Colors = require('colors')
    global.Less = require('less')
    
    global.Utilities = require('./utilities')
    
    global.Session = Object.create(require('./session'))
    global.Settings = require('./settings')
    global.MimeType = require('./mimeTypes').type
    
    var sqlite3 = require('sqlite3').verbose()
    global.DB = new sqlite3.Database('./db/' + Settings.database)

    Router = require('./router')
            
    // Spawn new models    
    require('fs').readdir('./model', function(error, files) {
        if (error)
            throw error
        files.forEach(function(file) {
            var modelName = require('./utilities').titleCase(require('path').basename(file, '.js'))
            global[modelName] = require('./model').spawn(require('../model/' + file))
            global[modelName].modelName = modelName
            global[modelName].tableName = require('./utilities').pluralize(modelName)
            global[modelName].app = self
            global[modelName].generateMethods()
        })
    })
}

App.prototype.processCookies = function(string) {
	result = {}
	if (string && string.length > 0) {
        string.split('; ').forEach(function (cookie) {
            var tmp = cookie.split('=')
            result[tmp[0]] = tmp[1]
        }) 
	}
	return result
}

App.prototype.processRequest = function(request, callback) {
	var self = this
	var result = {}
	result.postArgs = ''
	request.on('data', function (chunk) {
        result.postArgs += chunk
    })	
    request.on('end', function () {
		var tempQuery = self.url.parse(request.url, true)
		result.postArgs = self.qs.parse(result.postArgs)
		result.headers = request.headers
		result.cookies = self.processCookies(result.headers.cookie)
		result.isXML = 'x-requested-with' in result.headers
		result.url = request.url
		result.path = tempQuery.pathname
		result.getArgs = tempQuery.query
		result.extension = self.path.extname(result.path)
		result.mime = MimeType[result.extension]
		var tempData = result.path.split(self.path.sep)
		result.controller = tempData[1] ? tempData[1] : Settings.defaultController
		result.action = tempData[2] ? tempData[2] : Settings.defaultAction
		result.data = tempData[3] ? tempData.slice(3) : []
		result.method = request.method
		result.temp = request
		return callback(result)
    })
}

App.prototype.start = function (port) {
    process.stdout.write ('\u001B[2J\u001B[0;0f') // clear the screen
	var self = this
    if (port === undefined)
        port = Settings.port
    
    this.server = this.http.createServer(function (request, response) {
        
        //early capture favicon requests
        if (request.url === '/favicon.ico') {
            require('fs').readFile(Settings.rootDir + '/webroot' + request.url, function(error, data) {
                if (error) 
                    return response.end(JSON.stringify(error)) //TODO generate appropriate headers.
                response.writeHead(200, {'Content-Type': 'image/x-icon'})
                response.end(data)
                return
            })
            return
        }
        
		self.processRequest(request, function(processedRequest) {
			this.router = new Router(self, processedRequest, response)
		})
    
    })
    
    this.server.listen(port)
}

module.exports = App
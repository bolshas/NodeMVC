module.exports = {
    render : true,
    view : {},
    layout : 'default',
    title : '',
    
    before : function() {
    },
    
    after : function() {
        var self = this
        if (self.render === true) {
            require('fs').readFile(Settings.rootDir + '/view/layouts/' + self.layout + '.ejs', 'utf8', function(error, data) { // try to read the view at path
                if (error)
                    return self.router.render(JSON.stringify(error))
				
				self.view.content = Settings.rootDir + '/view/' + self.router.request.controller + '/' + self.router.request.action + '.ejs'
                self.view.filename = Settings.rootDir + '/view/'
				self.view.title = self.title
				
				var renderedData = ''
				//process less files if in debug
				if (Settings.DEBUG === true) {                
					var lessSrc = require('fs').readFileSync('./webroot/less/bootstrap.less', 'utf8')
					Less.render(lessSrc, function (error, css) {
						if (error)
							return console.log(error)
						require('fs').writeFileSync('./webroot/css/style.css', css)
						
						try {
							renderedData = require('ejs').render(data, self.view) 
						}
						catch (e) {
							renderedData = '<pre>' + e + '</pre>'
						}
					})
				}
				else {
					renderedData = require('ejs').render(data, self.view) 
				}
				self.router.render(renderedData)
            })
        }
    }
}
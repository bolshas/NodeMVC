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
        require('fs').readFile(Settings.rootDir + '/view/layouts/' + self.layout + '.ejs', 'utf8', function(error, data) { // try to read the view at path
            if (error) 
                self.router.session.errors.push(error)
			
			self.view.content = Settings.rootDir + '/view/' + self.router.request.controller + '/' + self.router.request.action + '.ejs'
            self.view.filename = Settings.rootDir + '/view/'
			self.view.title = self.title
			self.view.message = self.router.session.message
			self.view.errors = self.router.session.errors
			
			//process less files if in debug; TODO: move to ejs filter
			if (Settings.DEBUG === true) {                
				var lessSrc = require('fs').readFileSync('./webroot/less/bootstrap.less', 'utf8')
				var parser = new Less.Parser({
                    paths: [__dirname + '/../webroot/less'],
                    filename: 'bootstrap.less'
				})
				
				parser.parse(lessSrc, function(error, tree) {
                    if (error)
                        self.router.session.errors.push(error)
                    if (tree)
                        require('fs').writeFileSync('./webroot/css/style.css', tree.toCSS())
                    try {
                        renderedData = require('ejs').render(data, self.view) 
                    }
                    catch (error) {
                        self.router.session.errors.push(error)
                    }
                    return callback(undefined, require('ejs').render(data, self.view))
				})
			}
			else
                return callback(undefined, require('ejs').render(data, self.view))
        })
        
    }
}
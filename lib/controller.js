module.exports = {
    render : true,
    viewData : {},
    defaultIndex : '', //if set to anything else will force the router to route to function "view" with data as variable if no approrpriate action is found.
    layout : 'default',
    title : '',
    
    before : function(callback) {
        callback()
    },
    
    after : function(callback) {
        var self = this
        
        // JADE options
        self.viewData.filename = __dirname + '/../view/dummy'
        self.viewData.pretty = true
        
        // other data
		self.viewData.title = self.title
		self.viewData.message = self.router.session.message
		self.viewData.errors = self.router.session.errors

        require('fs').readFile(Settings.rootDir + '/view/' + self.router.request.controller + '/' + self.router.request.action + '.jade', 'utf8', function(error, data) {
            if (error)
                self.router.session.errors.push(error)
            // process less files if in debug; TODO: move to ejs filter
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
                    
                    if (data) {
                        require('jade').render(data, self.viewData, function (error, renderedData) {
                            if (error) {
                                self.router.session.errors.push(error)
                                renderedData = error.stack
                            }
                            return callback(error, renderedData)        
                        })
                    } else {
                        return callback(data)    
                    }
                })
            }
            else
                return callback(undefined, require('jade').render(data, self.viewData))
        })
    }
}
module.exports = {
    index: function(data, callback) {
		var self = this
		User.findAll(function(error, users) {
            self.viewData.users = users
            return callback(error)
		})
    },
    
    add: function(data, callback) {
		var self = this
		if (self.router.request.method === 'POST') {
            var user = self.router.request.postArgs
            if (user.name !== '' && user.email !== '') {
                 User.add(user, function(error) {
                    if (error)
                        self.router.session.message = { type: 'error', text: 'the user could not be added' }
                    else
                        self.router.session.message = { type: 'success', text: 'the user was added successfully' }
                    return callback(error, function(){ self.router.redirect('/users') })
                })
            }
		}
		else 
            return callback(undefined, function(){self.router.redirect('/users')})
    },
    
    delete: function(data, callback) {
        var self = this
        self.render = false
        // if (self.router.request.isXML && self.router.request.method === 'DELETE' && 'length' in data) {
			if ('length' in data) {
			var user = { rowid: data[0] }
			self.router.request.mime = MimeType['.json'] // set response to json
			User.delete(user, function(error) { 
				if (error)
					self.router.session.message = { type: 'error', text: 'the user was not deleted' }
				else 
					self.router.session.message = { type: 'success', text: 'the user was deleted successfully' }
				return callback(error, function() { self.router.redirect('/users') })
			})
        }
    },
    
    view: function(data, callback) {
		var self = this
		self.view.test = data
		return callback()
    },
    
    test: function(data, callback) {
		var self = this
		var result = ''
		if (self.router.request.isXML)
            result = 'XML'
		return callback(undefined, function(){ self.router.render(result) })
    }
}
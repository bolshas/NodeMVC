module.exports = {
    index: function(data, callback) {
		var self = this
		User.findAll(function(error, users) {
            self.viewData.users = users
            self.viewData.attributes = User.attributes
            return callback(error)
		})
    },
    
    create: function(data, callback) {
        var self = this
        User.create(undefined, function(){
            return callback(undefined, function(){self.router.redirect('/users')})
        })
    },
    
    add: function(data, callback) {
		var self = this
		var error
		if (self.router.request.method === 'POST') {
            var user = self.router.request.postArgs
            console.log(user)
            if (user.name !== '' && user.email !== '') { // TODO: move validation to model
                 User.add(user, function(error) {
                    if (error)
                        self.router.session.message = { type: 'error', text: 'the user could not be added' }
                    else
                        self.router.session.message = { type: 'success', text: 'the user was added successfully' }
                    return callback(error, function(){self.router.redirect('/users')})
                })
            }
            else {
                error = new Error('Please fill out the form')
                return callback(error, function(){self.router.redirect('/users')})
            }
		}
        else {
            error = new Error('Please send a POST request')
            return callback(error, function(){self.router.redirect('/users')})
        }
    },
    
    delete: function(data, callback) {
        var self = this
        self.render = false
		if ('length' in data) {
			var user = { id: data[0] }
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
    
    addColumn: function(data, callback) {
        var self = this
        var error
        self.render = false
        if (self.router.request.method === 'POST') {
            var column = self.router.request.postArgs
            console.log(column)
            User.addColumn(column, function(error){
                return callback(error, function(){ self.router.redirect('/users') })
            })
        }
        else
            return callback(error, function() { self.router.redirect('/users') })
    },
    
    modifyColumn: function(data, callback) {
        var self = this
        var error
        self.render = false
        if (self.router.request.method === 'POST') {
            var column  = self.router.request.postArgs
            console.log(column)
            User.modifyColumn(column, function(error){
                return callback(error, function(){ self.router.redirect('/users') })
            })
        }
        else
            return callback(error, function() { self.router.redirect('/users') })
    },
    
    deleteColumn: function(data, callback) {
        var self = this
        var error
        self.render = false
        User.deleteColumn(data[0], function(error) {
            return callback(error, function(){ self.router.redirect('/users') })
        })
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
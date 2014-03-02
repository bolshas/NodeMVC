module.exports = {
    index: function(data, callback) {
		var self = this
		User.findAll(function(error, users) {
            self.view.users = users
            return callback(error)
		})
    },
    
    add: function(data, callback) {
		var self = this
		self.render = false
        User.add({name: 'Andrius', email : 'bolshas@gmail.com'}, function(error) {
            if (error)
                self.router.session.message = { type: 'error', text: 'the user could not be added' }
            else
                self.router.session.message = { type: 'success', text: 'the user was added successfully' }
            return callback(error, self.router.redirect('/users'))
        })
    },
    
    delete: function(data, callback) {
        var self = this
        self.render = false
        User.delete({name: 'Andrius'}, function(error) { 
            if (error)
                self.router.session.message = { type: 'error', text: 'the user was not deleted' }
            else 
                self.router.session.message = { type: 'success', text: 'the user was deleted successfully' }
            return callback(error, self.router.redirect('/users'))
        })
    },
    
    view: function(data, callback) {
		var self = this
		self.view.test = data
		return callback()
    }
}
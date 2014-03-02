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
            return callback(error, self.router.redirect('/users'))
        })
    },
    
    delete: function(data, callback) {
        var self = this
        self.render = false
        User.delete({name: 'Andrius'}, function(error) { 
            return callback(error, self.router.redirect('/users'))
        })
    },
    
    view: function(data) {
		var self = this
		self.view.test = data
    }
}
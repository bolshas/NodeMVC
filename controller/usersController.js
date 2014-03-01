var ejs = require('ejs')

module.exports = {
    index: function() {
		var self = this
		User.findByName('Andrius', function(error, user) {
            if(error)
                self.router.render(error)
            self.view.user = user
		})
    },
    
    add: function() {
		var self = this
		self.render = false
        User.add({name: 'Andrius', email : 'bolshas@gmail.com'}, function(error){
            if(error)
                self.router.render(error)
            self.router.render('' + JSON.stringify(self.router.session))
        })
    }
}
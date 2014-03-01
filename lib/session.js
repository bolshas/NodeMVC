module.exports = {
    connections : [],
    
    update : function(id) {
		var found
		this.flush() // first flush inactive sessions
        this.connections.forEach(function(connection) {
            if (connection.id === id) {
                connection.lastActive = +new Date()
                found = connection // return the connection object if session id was found and updated
                return
            }
        })
        return found // return undefined otherwise
    },
    
    create : function() {
        var connection = {}
        this.flush()
        connection.id = require('crypto').randomBytes(20).toString('hex')
        connection.lastActive = +new Date()
        this.connections.push(connection)
		return connection
    },
    
    flush : function() {
        var alive = []
        this.connections.forEach(function(connection) {
            if (+new Date() - connection.lastActive <= 60000) { //60'000 miliseconds
                alive.push(connection)
            }
        })
        
        this.connections = alive
    }
}
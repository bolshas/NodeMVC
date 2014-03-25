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
    
    create : function(id) {
        var connection = {}
        this.flush()
        if (!id)
            connection.id = require('crypto').randomBytes(20).toString('hex')
        else //reuse old id if it was still on user's computer
            connection.id = id
        connection.lastActive = +new Date()
        this.connections.push(connection)
		return connection
    },
    
    flush : function() {
        var alive = []
        this.connections.forEach(function(connection) {
            if (+new Date() - connection.lastActive <= Settings.sessionTimeout * 1000) { //60'000 miliseconds
                alive.push(connection)
            }
        })
        
        this.connections = alive
    }
}
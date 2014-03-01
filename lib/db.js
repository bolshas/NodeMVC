var sqlite3 = require('sqlite3')

var db = new sqlite3.Database(':memory:', function(error) {
	if (error)
		return callback(error)
})

db.run("CREATE TABLE IF NOT EXISTS lorem (txt TEXT, int INTEGER, real REAL)", function(error) {
    if (error)
        throw (error) 
})

// Constructor
function Model (name, callback) {
	this.name = name
	return callback()
}

Model.prototype.add = function (data, callback) {
	var stmt = db.prepare("INSERT INTO lorem VALUES ('labas')", function(error) {
		if (error)
			return callback(error)
	})
	stmt.run()
	
	// console.log(this.name)
	callback()
}

Model.prototype.getData = function (callback) {
	db.each(
		"SELECT rowid, * FROM lorem", 
		function(error, row) {
			if (error) 
				return callback(error)
			console.log(row)
		}, 
		function(error, numRows) {
			if (error)
				return callback(error)
		}
    )
    callback()
}

Model.prototype.showColumns = function (callback) {
	db.each(
		"PRAGMA table_info(lorem)", 
		function(error, row) {
			if (error) 
				return callback(error)
			console.log(row)
		}, 
		function(error, numRows) {
			if (error)
				return callback(error)
		}
    )
    callback()
}

// Export the object
module.exports = Model

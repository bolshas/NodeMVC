var Model = module.exports = {}

Model.findByAttribute = function(attribute, search, callback) {
    var self = this
    var stmt = self.app.db.prepare('SELECT rowid,* FROM ' + self.tableName + ' WHERE ' + attribute.name + '=\'' + search +'\'')
    stmt.get(function(error, row) {
        if (error)
            return callback (error)
        callback(undefined, row)
    })
}

Model.add = function(object, callback) {
    var self = this
    
    var names = []
    var values = []
    
    for (var key in object) {
        names.push(key)
        values.push("'" + object[key] + "'")
    }
    names = names.join(', ')
    values = values.join(', ')
    
    var stmt = self.app.db.prepare('INSERT INTO ' + self.tableName + ' (' + names + ') VALUES (' + values + ')')
    stmt.run()
    callback()
}

Model.generateMethods = function() {
    var self = this
    self.attributes = {}
    self.app.db.serialize(
        function() {
            self.app.db.run('CREATE TABLE IF NOT EXISTS ' + self.tableName + ' (name TEXT, email TEXT)', function (error) {if(error) throw (error)})
            var stmt = self.app.db.prepare('PRAGMA table_info (' + self.tableName + ')')
            stmt.each(function(error, row) {
                if (error)
                    console.log(error)
                self.attributes[row.name] = row
                
            },
        function(error, numrows) {
            self.attributes['rowid'] = { name: 'id' }
            Object.keys(self.attributes).forEach(function(attrName) {
                var attribute = self.attributes[attrName]
                self['findBy' + self.app.utilities.titleCase(attribute.name)] = function (search, callback) {
                    return self.findByAttribute(attribute, search, callback)
                }    
            })
        })
    })
}
var Model = module.exports = {}

Model.showTables = function(callback) {
    var self = this
    var sql = "SELECT * FROM sqlite_master WHERE type='table'";
    var stmt = self.app.db.prepare(sql, function (error) { 
        if (error) 
            return callback (error)
            
        stmt.all(function(error, rows) {
            if (error)
                return callback (error)
            callback(undefined, rows)
        })
    })
}

Model.validateEmail = function(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i)
    return pattern.test(emailAddress)
}

Model.findByAttribute = function(attribute, search, callback) {
    var self = this
    var sql = 'SELECT rowid,* FROM ' + self.tableName + ' WHERE ' + attribute.name + '=\'' + search +'\''
    var stmt = self.app.db.prepare(sql, function (error) { 
        if (error) 
            return callback (error)
            
        stmt.get(function(error, row) {
            if (error)
                return callback (error)
            callback(undefined, row)
        })
    })
}

Model.findAll = function(callback) {
    var self = this
    var sql = 'SELECT rowid,* FROM ' + self.tableName
    var stmt = self.app.db.prepare(sql, function (error) { 
        if (error) 
            return callback (error) 
        
        stmt.all(function(error, rows) {
            if (error)
                return callback (error)
            callback(undefined, rows)
        })
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
    var stmt = self.app.db.prepare('INSERT INTO ' + self.tableName + ' (' + names + ') VALUES (' + values + ')', function (error) { 
        if (error) 
            return callback (error)
        stmt.run(function (error) {
            if (error)
                return callback (error)
            stmt.finalize()
            callback()
        })
    })
}

Model.delete = function(object, callback) {
    var self = this
    
    var sql = 'DELETE FROM ' + self.tableName
    if (object) {
        var conditions = []
        for (var key in object) {
            conditions.push(key + '=' + "'" + object[key] + "'")
        }
        conditions = ' WHERE ' + conditions.join(' AND ')
        sql += conditions
    }
    
    var stmt = self.app.db.prepare(sql, function (error) { 
        if (error) 
            return callback (error) 
        stmt.run(function (error) { 
            if (error && callback) 
                return callback (error) 
        })
        callback()
    })
}

Model.generateMethods = function() {
    var self = this
    self.attributes = {}
    self.app.db.serialize(
        function() {
            var stmt = self.app.db.prepare('PRAGMA table_info (' + self.tableName + ')', function (error) {  // TODO: create error checking when nothing is received.
                if (error) 
                    console.log(error) 
            })
            stmt.each(function(error, row) {
                if (error)
                    console.log(error)
                self.attributes[row.name] = row
                
            },
        function(error, numrows) {
            self.attributes['rowid'] = { name: 'id' }
            Object.keys(self.attributes).forEach(function(attrName) {
                var attribute = self.attributes[attrName]
                self['findBy' + Utilities.titleCase(attribute.name)] = function (search, callback) {
                    return self.findByAttribute(attribute, search, callback)
                }    
            })
        })
    })
}
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
    var sql = 'SELECT * FROM ' + self.tableName + ' WHERE ' + attribute.name + '=\'' + search +'\''
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
    var sql = 'SELECT * FROM ' + self.tableName
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
        if (object[key]) {
            names.push(key)
            values.push("'" + object[key] + "'")
        }
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
            if (this.changes === 0) 
                error = new Error('The record was not deleted - not found.')
            if (error && callback) 
                return callback (error) 
        })
        callback()
    })
}

Model.generateColumnsClause = function(columns) {
    var pk = false
    var result = []
    
    columns.forEach(function(column) {
        if (column['name'] !== '') {
            var str = []
            if (column['name']) str.push(column['name'])
            if (column['type']) str.push(column['type'])
            if (column['pk'] && parseInt(column['pk']) === 1 && pk === false) {
                str.push('PRIMARY KEY AUTOINCREMENT')
                pk = true
            }
            if (column['notnull'] && parseInt(column['notnull']) === 1) str.push('NOT NULL')
            if (column['dflt_value'] && column['dflt_value'] !== '') str.push('DEFAULT ' + column['dflt_value'])
            result.push(str.join(' '))
        }
    })
    
    result.join(', ')
    return ' (' + result + ')'
}

Model.processColumns = function(newColumns, type) {
    var self = this
    var statements = []
    
    var oldColumnNames = self.attributes.map(function(column){ return column.name }).join(', ')
    var newColumnNames = newColumns.map(function(column){ return column.name }).join(', ')
    newColumns = self.generateColumnsClause(newColumns)
    
    statements.push('ALTER TABLE ' + self.tableName + ' RENAME TO ' + 'temp' + self.tableName)
    statements.push('CREATE TABLE ' + self.tableName + newColumns)
    
    
    // TODO: pagavoti, gal reikia perdeti i old/new 
    if (type === 'add')
        statements.push('INSERT INTO ' + self.tableName + ' (' + oldColumnNames + ') SELECT ' + oldColumnNames +  ' FROM temp' + self.tableName)
    else if (type === 'delete')
        statements.push('INSERT INTO ' + self.tableName + ' (' + newColumnNames + ') SELECT ' + newColumnNames +  ' FROM temp' + self.tableName)
    else if (type === 'rename')
        statements.push('INSERT INTO ' + self.tableName + ' (' + newColumnNames + ') SELECT ' + oldColumnNames +  ' FROM temp' + self.tableName)
        
    statements.push('DROP TABLE temp' + self.tableName)
    
    self.app.db.serialize(function() {
        statements.forEach(function(statement) {
            self.app.db.run(statement, function(error) { 
                if (error) 
                    return(error)
            })
        })
    })
}

Model.addColumn = function(column, callback) {
    var self = this
    var newColumns = self.attributes.slice()
    
    newColumns.push(column)
    
    self.processColumns(newColumns, 'add')
    self.generateMethods()
    callback()
}

Model.deleteColumn = function(column, callback) {
    var self = this
    var newColumns = self.attributes.slice()

    newColumns.forEach(function (attribute) { 
        if (attribute['cid'] == column)
            newColumns.splice(newColumns.indexOf(attribute), 1)
    }) 
        
    self.processColumns(newColumns, 'delete')
    self.generateMethods()
    callback()
}

Model.create = function(table, callback) {
    this.app.db.run('CREATE TABLE users (id integer primary key autoincrement, name text, email text)')
    this.generateMethods()
    callback()
}

Model.generateMethods = function() {
    var self = this
    self.attributes = []
    self.app.db.serialize(
        function() {
            var stmt = self.app.db.prepare('PRAGMA table_info (' + self.tableName + ')', function (error) {  // TODO: create error checking when nothing is received.
                if (error) 
                    console.log(error) 
            })
            stmt.each(function(error, row) {
                if (error)
                    console.log(error)
                self.attributes.push(row)
                
            },
        function(error, numrows) {
            self.attributes.forEach(function(attribute) {
                self['findBy' + Utilities.titleCase(attribute.name)] = function (search, callback) {
                    return self.findByAttribute(attribute, search, callback)
                }    
            })
        })
    })
}
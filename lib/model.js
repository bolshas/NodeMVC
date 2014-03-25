var Model = module.exports = {}

Model.showTables = function(callback) {
    var self = this
    var sql = "SELECT * FROM sqlite_master WHERE type='table'";
    var stmt = DB.prepare(sql, function (error) { 
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
    var stmt = DB.prepare(sql, function (error) { 
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
    var stmt = DB.prepare(sql, function (error) { 
        if (error) 
            return callback (error) 
        
        stmt.all(function(error, rows) {
            if (error)
                return callback (error)
            callback(undefined, rows)
        })
    })
}

Model.processRules = function(property, value, callback) {
    var self = this
    var errors = []
    if (property.rules) {
        property.rules.forEach(function(rule) {
            if (!rule.message)
                rule.message = 'Error message for ' + self.modelName + '.' + property.name + '.' + rule.ruleName + ' not set.'
            switch (rule.ruleName) {
                case 'length':
                    if (rule.min > value.length)
                        errors.push(new Error(rule.message.replace('<value>', value)))
                    break;
                case 'isEmail':
                    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i)
                    if (!pattern.test(value))
                        errors.push(new Error(rule.message.replace('<value>', value))) //todo add more replacements
                    break;
                default:
                    if (!rule.test(value))
                        errors.push(new Error(rule.message.replace('<value>', value)))
            }
        }) 
        
    }
    return callback(errors)
}

Model.add = function(object, callback) {
    var self = this
    
    var names = []
    var values = []
    var errors = []
    
    self.properties.forEach(function(property) {
        if (property.name !== 'id') {
            names.push(property.name)
            values.push("'" + object[property.name] + "'")
            self.processRules(property, object[property.name], function(err) {
                if (err)
                    errors.push.apply(errors, err)
            })
        }
    })
    
    if (errors.length > 0)
        return callback(errors)
    
    names = names.join(', ')
    values = values.join(', ')
    var stmt = DB.prepare('INSERT INTO ' + self.tableName + ' (' + names + ') VALUES (' + values + ')', function (error) {
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

Model.modify = function(object, callback) {
    var self = this
    var columns = []
    var errors = []
    
    self.properties.forEach(function(property) {
        if (property.name !== 'id') {
            var value = object[property.name] ? "'" + object[property.name] + "'" : "null"
            columns.push(property.name + '=' + value)
            self.processRules(property, object[property.name], function(err) {
                if (err)
                    errors.push.apply(errors, err)
            })
        }
    })
    
    if (errors.length > 0)
        return callback(errors)

    columns = columns.join(', ')
    var stmt = DB.prepare('UPDATE ' + self.tableName + ' SET ' + columns + ' WHERE id=' + object['id'], function (error) {
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
    
    var stmt = DB.prepare(sql, function (error) { 
        if (error) 
            return callback (error) 
        stmt.run(function (error) {
            if (error) 
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

Model.generateIndicesClause = function(columns) {
    var self = this
    var result = []
    columns.forEach(function(column) {
        if (column['indexed'] && !column['pk']) {
            var unique = column['unique'] ? 'UNIQUE ' : ''
            var indexName = self.tableName + '_' + column['name'] 
            result.push('CREATE ' + unique + 'INDEX ' + indexName + ' ON ' + self.tableName + '(' + column['name'] + ')')
        }
    })
    return result
}

Model.processColumns = function(newColumns, type, callback) {
    var self = this
    var statements = []
    var newColumnsCreate = self.generateColumnsClause(newColumns)   //creates: ('id' integer autoincrement not null, 'name' text, ...)
    var newIndicesClauses = self.generateIndicesClause(newColumns)
    var error
    var oldColumnNames
    var newColumnNames

    switch (type) {
        case 'add':
            oldColumnNames = self.attributes.map(function(column) { return column.name }).join(', ')
            newColumnNames = oldColumnNames
            break
        case 'delete':
            newColumnNames = newColumns.map(function(column) { return column.name }).join(', ')
            oldColumnNames = newColumnNames
            break
        case 'modify':
            newColumnNames = newColumns.map(function(column) { return column.name }).join(', ')
            oldColumnNames = self.attributes.map(function(column) { return column.name }).join(', ')
            break
    }
    statements.push('BEGIN')    
    statements.push('ALTER TABLE ' + self.tableName + ' RENAME TO ' + 'temp' + self.tableName)
    statements.push('CREATE TABLE ' + self.tableName + newColumnsCreate)
    statements.push('INSERT INTO ' + self.tableName + ' (' + newColumnNames + ') SELECT ' + oldColumnNames +  ' FROM temp' + self.tableName)
    statements.push('DROP TABLE temp' + self.tableName)
    statements.push.apply(statements, newIndicesClauses)
    statements.push('COMMIT')
    require('async').whilst(
        function () {
            return statements.length > 0
        },
        function (callback) {
            var statement = statements.shift()
            DB.run(statement, function(e) {
                if (e) {
                    error = e
                    statements.unshift('ROLLBACK')
                    return callback()
                }
                callback (error)
            })
        },
        function (error) {
            callback (error)
        }
    )
}

Model.addColumn = function(column, callback) {
    var self = this
    var newColumns = self.attributes.slice()
    
    newColumns.push(column)
    
    self.processColumns(newColumns, 'add', function(error) {
        self.generateMethods()
        callback(error)
    })
}

Model.modifyColumn = function(column, callback) {
    var self = this
    var newColumns = self.attributes.slice()
    
    for (var i = 0; i < newColumns.length; i++) {
        if (newColumns[i].cid == column.cid) {
            newColumns[i] = column
            break
        }
    }
    
    self.processColumns(newColumns, 'modify', function(error) {
        self.generateMethods()
        callback(error)
    })
}

Model.deleteColumn = function(column, callback) {
    var self = this
    var newColumns = self.attributes.slice()

    newColumns.forEach(function (attribute) { 
        if (attribute['cid'] == column)
            newColumns.splice(newColumns.indexOf(attribute), 1)
    }) 
        
    self.processColumns(newColumns, 'delete', function(error) {
        self.generateMethods()
        callback(error)
    })
}

Model.create = function(callback) {
    var self = this
    DB.run('CREATE TABLE users (id integer primary key autoincrement, name text, email text)', function(error) {
        self.generateMethods()
        callback(error)    
    })
}

Model.tableExists = function(callback) {
    var self = this
    var sql = 'SELECT COUNT(name) FROM sqlite_master WHERE name=\'' + self.tableName + '\''
    DB.get(sql, function (error, row) {
        callback(error, row['COUNT(name)'] > 0)
    })
}

Model.getIndices = function(callback) {
    var self = this
    var indices = []
    var stmt = DB.prepare('PRAGMA index_list(' + self.tableName + ')', function (error) {  // TODO: create error checking when nothing is received.
        if (error) 
            return callback(error) 
    })
    stmt.each(
        function(error, row) {
            if (error)
                return callback(error)
            indices.push(row)
        },
        function(error, numrows) {
            callback(error, indices)
        }
    )
}

Model.generateMethods = function() {
    var self = this
    self.tableExists(function(error, exists){
        if (exists) {
            self.getIndices(function(error, indices) {
                self.attributes = []
                var stmt = DB.prepare('PRAGMA table_info (' + self.tableName + ')', function (error) {  // TODO: create error checking when nothing is received.
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
                        indices.forEach(function(index) {
                            if (index.name.split('_')[1] === attribute.name) {
                                attribute.indexed = true //change value if necessary
                                if(index.unique)
                                    attribute.unique = true
                            }
                        })
                        
                        self['findBy' + Utilities.titleCase(attribute.name)] = function (search, callback) {
                            return self.findByAttribute(attribute, search, callback)
                        }    
                    })
                })
            })
            
        } else { //the table doesn't exist
            // check if id field is present, if not, put it at the start
            var idFound = false
            self.properties.forEach(function(property) {
                if (property.name === 'id')
                    return !idFound
            })
            if (!idFound)
                self.properties.unshift({ name: 'id', type: 'integer', pk: 1 })
                
            DB.run('CREATE TABLE ' + self.tableName + self.generateColumnsClause(self.properties), function(error) {
                self.generateMethods() //call self again with table created
            })
        }
    })
    
}
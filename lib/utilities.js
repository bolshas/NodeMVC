var settings = require('./settings')
var fs = require('fs')
var path = require('path')

var log = exports.log = function(message) {
    if (settings.DEBUG === true)
        console.log(message)
}

var titleCase = exports.titleCase = function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var pluralize = exports.pluralize = function pluralize(string) {
    return string.toLowerCase() + 's';
}

// extend object so that it can merge two objects
Object.defineProperty(Object.prototype, 'spawn', {
    value: function (props) {
        var defs = {}, key;
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                defs[key] = {value: props[key], enumerable: true};
            }
        }
        return Object.create(this, defs);
    }
});
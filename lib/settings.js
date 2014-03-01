function define(name, value) { Object.defineProperty(exports, name, { value: value, enumerable: true });} //define constants tool

define('DEBUG', true) // Log all messages to console. Show errors on webpage.

exports.rootDir = '.'
exports.port    = 3000
exports.indices = ['index.php', 'index.html', 'index.htm']
exports.defaultController = 'pages'
exports.defaultAction = 'index'
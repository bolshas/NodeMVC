function define(name, value) { Object.defineProperty(exports, name, { value: value, enumerable: true });} //define constants tool

define('DEBUG', true) // Log all messages to console. Show errors on webpage.

exports.rootDir = '.'
exports.port    = 3000
exports.sessionTimeout = 60 //seconds
exports.database = 'test.sqlite'
exports.indices = ['index.php', 'index.html', 'index.htm']
exports.renderEngine = 'jade' // can be jade or ejs
exports.defaultController = 'pages'
exports.defaultAction = 'index'
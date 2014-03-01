var App = require('./lib/app')
var app = new App()
app.start()

//to start in background: node server >> log/errors.log 2>&1 &
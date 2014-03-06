var App = require('./lib/app')
var app = new App()
app.start()

var stdin = process.stdin

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')
stdin.on('data', function ( key) {
    if (key === '\u0003')
        process.exit()
    if (key === '\u0063')
        process.stdout.write('\u001B[2J\u001B[0;0f')
})
//to start in background: node server >> log/errors.log 2>&1 &
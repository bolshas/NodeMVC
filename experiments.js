function async(arg, callback) {
	var delay = Math.floor(Math.random() * 5 + 1) * 100
	console.log('doing something with ' + arg + ' every ' + delay / 1000 + ' seconds')
	setTimeout(
		function() { 
			callback(arg * 2)	
		},
		delay
	)
}

function final(results) {
	console.log('Done', results)
}

exports.series = function series(callbacks, last) {
	var results = []
	function next() {
		var callback = callbacks.shift()
		if (callback) {
			callback(function() {
				results.push(Array.prototype.slice.call(arguments))
				next()
			})
		} else if (last)
			last(results)
	}
	next()
}

// this.series([
// 	function(next) { async(1, next) },
// 	function(next) { async(2, next) },
// 	], final)
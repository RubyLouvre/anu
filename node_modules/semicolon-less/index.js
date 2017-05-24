'use strict'

var semi = require('semi')

function removeSemicolons(source) {
	return semi.remove(source, {leading: true})
}


var Readable = require('readable-stream').Readable
var isReadable = require('isstream').isReadable

module.exports = semicolonless
function semicolonless(source/*, options*/) {

	if (typeof source === 'string') {
		return removeSemicolons(source)
	}

	if (Buffer.isBuffer(source)) {
		return new Buffer(removeSemicolons(source.toString()))
	}

	if (isReadable(source)) {
		var result = new Readable({
			read: function () {},
		})
		result._read = function () {}	// should be removed after readable-stream
			// support simplified constructor api
		var sourceStr = ''
		source.setEncoding('utf8')
		source.on('data', function (chunk) {
			sourceStr += chunk
		})
		source.on('end', function () {
			result.push(semi.remove(sourceStr, {leading: true}))
			result.push(null)
		})
		return result
	}

}

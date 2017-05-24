'use strict'

var Transform = require('readable-stream').Transform
var less = require('./index')

module.exports = function (options) {
	var t = new Transform({
		objectMode: true,
		//transform: ...
	})

	//should reformat after readable-stream support simplified constructor api
	t._transform = function (file, enc, next) {
		if (file.isBuffer()) {
			file.contents = less(file.contents, options)
		} else if (file.isStream()) {
			file.contents.on('error', this.emit.bind(this, 'error'))
			file.contents = less(file.contents, options)
		}
		this.push(file)
		return next()
	}

	return t
}

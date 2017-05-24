'use strict'

var assert = require('assert')
var util = require('gulp-util')
var less = require('../gulpplugin')
var Readable = require('readable-stream').Readable

describe('gulpplugin', function () {

	it('should convert buffer to semicolon-less style', function (done) {

		var testCode = "(function () {\n\t'use strict';\n\tconsole.log('Hello world!');\n})();"

		var fakeFile = new util.File({
			contents: new Buffer(testCode),
		})

		var t = less()
		t.write(fakeFile)

		t.once('data', function (file) {
			assert(file.isBuffer())
			assert.equal(file.contents.toString(), ';' + testCode.replace(/;/g, ''))
			done()
		})

	})

	it('should convert stream to semicolon-less style', function (done) {

		var testCode = "(function () {\n\t'use strict';\n\tconsole.log('Hello world!');\n})();"

		var readable = new Readable
		readable._read = function () {}

		var fakeFile = new util.File({
			contents: readable,
		})

		var t = less()
		t.write(fakeFile)

		t.once('data', function (file) {
			assert(file.isStream())
			var result = ''
			file.contents.on('data', function (data) {
				result += data
			})
			file.contents.on('end', function () {
				assert.equal(result, ';' + testCode.replace(/;/g, ''))
				done()
			})
			var lines = testCode.split('\n')
			setTimeout(function sendLine() {
				if (lines.length > 1) {
					readable.push(lines.shift() + '\n')
					setTimeout(sendLine)
				}
				else {
					readable.push(lines.shift())
					readable.push(null)
				}
			})
		})

	})

})

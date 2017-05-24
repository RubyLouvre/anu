'use strict'

var assert = require('assert')
var less = require('../')


var TEST_WARN = false

var spec = {
	unchange: function (s) { return s },
	remove: function (s) { return s.replace(/;/, '') },
	shift: function (s) { return s.replace(/;\n/, '\n;') },
	prepend: function (s) {
		var i = s.indexOf('\n')
		return i >= 0
			? s.slice(0, i + 1) + ';' + s.slice(i + 1)
			: ';' + s
	},
}

module.exports = function (it) {
	Object.keys(spec).forEach(function (name) {
		it['should_' + name] = _it('should ' + name, spec[name])
		it['should_warn_and_' + name] = _it('should warn and ' + name, spec[name], TEST_WARN)
	})
}


function _it(msg0, transform, warn) {
	var skip0 = isSkip(msg0)
	return function (msg, cases) {
		var skip1 = skip0
		if (cases === undefined) {
			cases = msg
			msg = msg0
		} else {
			msg = msg0 + ' ' + msg
			skip1 = skip1 || isSkip(msg)
		}
		Object.keys(cases).forEach(function (k) {
			var skip = skip1 || isSkip(k)
			var test = skip ? it.skip : it
			var v = cases[k], source, expect
			if (typeof v === 'object') {
				source = v.source
				expect = v.expect
			} else {
				source = v
				expect = transform(v)
			}

			var warnings = []
			function record(e) { warnings.push(e) }

			var message = (msg + ' ' + k)
				.replace(/~;/g, 'trailing ;')
				.replace(/;~/g, 'leading ;')
				.replace(/;/g, 'semicolon')
				.replace(/}/g, 'right brace')
				+ ':\n\t'
				+ JSON.stringify(source)
				+ ' => '
				+ JSON.stringify(expect)

			test(message, function () {
				var actual = less(source, {onwarn: record})
				assert.equal(actual, expect)
				if (warn) assert.ok(warnings.length > 0)
				//new Function(source)
				//new Function(expect)
			})
		})
	}
}

function isSkip(s) {
	return /^\s*\/\//.test(s)
}

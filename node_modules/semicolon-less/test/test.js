/* eslint key-spacing: 0 */
'use strict'

require('./ext')(it)


describe(';-less (common cases)', function () {
	it.should_remove({
		'~; before new line'    : 'x;\nx',
		'~; before EOF'         : 'x;',
		'reduplicated ;'        : 'x;; x',
		'redundant ; before }'  : 'if (test) { x; }',
	})
	it.should_unchange({
		'inline ; as seperator'  : 'a; b',
		'for statement'          : 'for (;\n;\n) {}',
		'string literal'         : '"a;\\\n"',
		'single-line comment'    : '//a;\n',
		'multi-line comment'     : '/*a;\n*/',
	})
})

describe(';-less (special cases)', function () {
	it.should_shift('~; to ;~ for line starts with', {
		'unary - operator'   : 'a;\n-x',
		'unary + operator'   : 'a;\n+x',
		'regexp literal'     : 'a;\n/x/',
		'array initializer'  : 'a;\n[x]',
		'grouping operator'  : 'a;\n(x)',
	})
	it.should_prepend(';~ to line starts with', {
		'unary - operator'   : '-x',
		'unary + operator'   : '+x',
		'regexp literal'     : '/x/',
		'array initializer'  : '[x]',
		'grouping operator'  : '(x)',
	})
})


describe(';-less (edge cases: directive prologue)', function () {
	it.should_remove('~; of', {
		'use strict directive' : 'function f() { "use strict";\nx }',
	})
	it.should_shift('~; to ;~ after', {
		'use strict directive' : 'function f() { "use strict";\n-x }',
	})
})

describe(';-less (edge cases: block and empty statement)', function () {
	it.should_remove({
		'empty statement': ';',
	})
	it.should_remove('redundant ; after', {
		'block'   : '{};',
		'if'      : 'if (test) {};',
		'else'    : 'if (test) {} else {};',
		'while'   : 'while (test) {};',
		'for'     : { source: 'for (;;) {};', expect: 'for (;;) {}' },
		'for-in'  : 'for (key in obj) {};',
		'for-of'  : 'for (value of obj) {};',
	})
	it.should_prepend(';~ after', {
		'block'   : '{}\n-x',
		'if'      : 'if (test) {}\n-x',
		'else'    : 'if (test) {} else {}\n-x',
		'while'   : 'while (test) {}\n-x',
		'for'     : 'for (;;) {}\n-x',
		'for-in'  : 'for (key in obj) {}\n-x',
		'for-of'  : 'for (value of obj) {}\n-x',
	})
	it.should_warn_and_unchange('empty statement in', {
		'if'      : 'if (test) ;',
		'else'    : 'if (test) {} else ;',
		'while'   : 'while (test) ;',
		'for'     : 'for (;;) ;',
		'for-in'  : 'for (key in obj) ;',
		'for-of'  : 'for (value of obj) ;',
	})
	it.should_remove('~; after identifier', {
		'if'      : 'x.\nif(test);',
		'else'    : 'x.\nelse;',
		'while'   : 'x.\nwhile(test);',
		'for-in'  : 'x.\nfor(key in obj);',
	})
})

describe(';-less (edge cases: only statement)', function () {
	it.should_warn_and_unchange('only statement in', {
		'if'      : 'if (test)\n-x',
		'else'    : 'if (test) {}\nelse\n-x',
		'while'   : 'while (test)\n-x',
		'for'     : 'for (;;)\n-x',
		'for-in'  : 'for (key in obj)\n-x',
		'for-of'  : 'for (value of obj)\n-x',
	})
})

describe(';-less (edge cases: do...while)', function () {
	it.should_remove({
		'~; after do...while'        : 'do {} while (i--);\nx',
	})
	it.should_prepend({
		';~ after do...while'        : 'do {} while (i--)\n-x',
	})
	it.should_shift({
		'~; to ;~ after do...while'  : 'do {} while (i--);\n-x',
	})
})

describe(';-less (edge cases: declarations)', function () {
	it.should_prepend(';~ after', {
		'var declaration'        : 'var a, b\n-x',
		'function declaration'   : 'function f() {}\n-x',
		'let declaration'        : 'let a, b\n-x',
		'generator declaration'  : 'function *g() {}\n-x',
		'class declaration'      : 'class c {}\n-x',
	})
})

describe(';-less (edge cases: multi-line comment)', function () {
	it.should_unchange({
		'; before inline comment': 'a; /* ... */ b',
	})
	it.should_warn_and_remove({
		'; before comment span multiple lines': 'x; /* ...\n */ x',
	})
	it.should_warn_and_prepend({
		'//; after comment span multiple lines': {
			source: 'x /* ...\n */ -x',
			expect: 'x /* ...\n */ ;-x',
		},
	})
})

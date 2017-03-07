//单例HTML标签,多例自定义标签
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : global.evalJSX = factory();
})(this, function() {
    var rComponent = /^(this|[A-Z])/
    var cacheFns = {}
    var cacheStr = {}

    function evalJSX(str, obj, config) {
        var jsx = new innerClass(str, config)

        var output = jsx.init()
        if (!obj)
            obj = {}
        if (typeof anu === 'function')
            obj.anu = anu
        var args = 'var args0 = arguments[0];'
        for (var i in obj) {
            if (i !== 'this')
                args += 'var ' + i + ' = args0["' + i + '"];'
        }
        args += 'return ' + output
        try {
            var fn
            if (cacheFns[args]) {
                fn = cacheFns[args]
            } else {
                fn = cacheFns[args] = Function(args)
            }
            var a = fn.call(obj.this, obj)
            return a
        } catch (e) {
            console.log(e, args)
        }

    }

    function innerClass(str, config) {
        config = config || {}
        config.ns = config.ns || 'anu'
        config.type = config.type || 'eval'
        this.input = str
        this.ns = config.ns
        this.type = config.type
    }
    innerClass.prototype = {
        init: function() {

            if (typeof JSXParser === 'function') {
                var useCache = this.input.length < 720
                if (useCache && cacheStr[this.input]) {
                    return cacheStr[this.input]
                }
                var array = (new JSXParser(this.input)).parse()
                var evalString = this.genChildren(array)
                if (useCache) {
                    return cacheStr[this.input] = evalString
                }
                return evalString
            } else {
                throw 'need JSXParser https://github.com/RubyLouvre/jsx-parser'
            }

        },
        genTag: function(el) {
            var children = this.genChildren(el.children, el)
            var ns = this.ns
            var type = rComponent.test(el.type) ? el.type : JSON.stringify(el.type)
            return ns + '.createElement(' + type +
                ',' + this.genProps(el.props, el) +
                ',' + children + ')'
        },
        genProps: function(props, el) {

            if (!props && !el.spreadAttribute) {
                return 'null'
            }
            var ret = '{'
            for (var i in props) {
                ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n'
            }
            ret = ret.replace(/\,\n$/, '') + '}'
            if (el.spreadAttribute) {
                return 'Object.assign({},' + el.spreadAttribute + ',' + ret + ')'
            }
            return ret
        },
        genPropValue: function(val) {
            if (typeof val === 'string') {
                return JSON.stringify(val)
            }
            if (val) {
                if (Array.isArray(val.nodeValue)) {
                    return this.genChildren(val.nodeValue)
                }
                if (val) {
                    return val.nodeValue
                }
            }
        },
        genChildren: function(children, obj, join) {
            if (obj) {
                if (obj.isVoidTag || !obj.children.length) {
                    return 'null'
                }
            }
            var ret = []
            for (var i = 0, el; el = children[i++];) {
                if (el.type === '#jsx') {
                    static = false
                    if (Array.isArray(el.nodeValue)) {
                        ret[ret.length] = this.genChildren(el.nodeValue, null, ' ')
                    } else {
                        ret[ret.length] = el.nodeValue
                    }
                } else if (el.type === '#text') {
                    ret[ret.length] = JSON.stringify(el.nodeValue)
                } else if (el) {
                    ret[ret.length] = this.genTag(el)
                }
            }
            return ret.join(join || ',')
        }
    }

    return evalJSX;
});
//单例HTML标签,多例自定义标签

var rComponent = /^(this|[A-Z])/

function genCode(str, config) {
    return (new innerClass(str, config)).init()
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
            var array = (new JSXParser(this.input)).parse()
            var evalCode = this.genChildren(array)
            return evalCode
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
        if (!props) {
            return 'null'
        }

        var ret = '{'
        for (var i in props) {
            ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n'
        }

        return ret.replace(/\,\n$/, '') + '}'

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
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : global.JSXParser = factory();
})(this, function() {
    var strIndex = 0

    function getStrID() {
        return '??' + (strIndex++) + ' '
    }

    var log = (function() {
        if (typeof console === 'object') {
            return function(str) {
                console.log(str)
            }
        } else {
            return function() {}
        }
    })()

    function clearString(str, map) {
        map = map || {}
        var curStr = '',
            newStr = '',
            quote, curID
        for (var i = 0, n = str.length; i < n; i++) {
            var c = str.charAt(i)
            if (!quote) {
                if (c === '"' || c === "'") {
                    quote = c
                    curStr = c
                    curID = getStrID()

                } else {
                    newStr += c
                }
            } else {
                curStr += c
                if (quote === c) {
                    quote = false
                    map[curID] = curStr
                    newStr += curID
                }

            }
        }
        return newStr
    }

    function clearBrace(str, map) {

        var curStr = '',
            newStr = '',
            curID, deep = 0
        for (var i = 0, n = str.length; i < n; i++) {
            var c = str.charAt(i)
            if (!deep) {
                if (c === '{') {
                    deep = 1
                    curStr = c
                    curID = getStrID()

                } else {
                    newStr += c
                }
            } else {
                curStr += c
                if (c === '{') {
                    deep++
                } else if (c === '}') {
                    deep--
                    if (deep === 0) {
                        map[curID] = curStr
                        newStr += curID
                    }
                }
            }
        }
        return newStr

    }

    function split(str, reg) {
        var ret = []
        do {
            var match = str.match(reg)
            if (match) {
                var left = str.slice(0, match.index)
                left && ret.push(left)
                ret.push(match[0])
                str = str.slice(match.index + match[0].length)

            } else {
                if (str) {
                    ret.push(str)
                }
                break

            }
        } while (1);
        return ret
    }

    function JSXParser(str, map) {
        this.input = str
        this.map = map || {}
        this.ret = []
        var stack = this.stack = []
        stack.last = function() {
            return stack[stack.length - 1]
        }
        this.index = 0
    }

    var pp = JSXParser.prototype
    pp.parse = function() {
        var str = this.input
        var breakIndex = str.length
        str = clearString(str, this.map)
        str = clearBrace(str, this.map)
        this.input = str //str is a pure XML
        this.index = 0

        do {
            this.parseComment()
            this.parseOpenTag()
            this.parseCloseTag()
            this.parseText()
            if (!this.node) {
                break
            }
            if (--breakIndex === 0)
                break
            this.node = 0
        } while (1);
        return this.ret
    }

    pp.parseComment = function() {
            if (this.node)
                return
                //"<!--ddd-->-->".match(/(?:[^>]\s|^)<!--(?!<!)[^\[>][\s\S]*?-->/)
                //http://stackoverflow.com/questions/395874/strip-comments-from-xml?rq=1
            if (this.left().indexOf('<!--') === 0) {
                var i = this.left().indexOf('-->', 4)
                if (i !== -1) {
                    this.node = {
                        type: '#comment',
                        nodeValue: this.left().slice(4, i)
                    }
                    this.buildTree()
                    this.index += i + 3
                }
            }
        }
        /**
         * 
         HTMLRegExp: /<\/?[a-z][^>]*?>/gi,
         HTMLcommentRegExp: /<!--[\s\S]*?-->/g,
         spaceRegExp: /&nbsp;|&#160;/gi,
         HTMLEntityRegExp: /&\S+?;/g,
         */


    pp.parseOpenTag = function() {
        if (this.node)
            return
        var match = this.left().match(/^<\w[^\>\/]*(\/)?>/)
        if (match) {
            var last = match[1] === '/' ? -2 : -1
            var name = match[0].slice(1, last)
            var arr = name.match(/\S+/g)
            var tagName = arr.shift()
            this.index += match[0].length

            var node = this.node = {
                type: tagName,
                props: {},
                children: []
            }
            this.parseProps(arr.join(' ').replace(/\s\=\s/g, '='))
            this.buildTree()
            if (last === -2) {
                node.isVoidTag = true
            } else {
                this.stack.push(node)
                var lower = tagName.toLowerCase()
                if (/script|xmp|style/.test(lower)) {
                    var i = this.left().toLowerCase().indexOf('</' + lower + '>')
                    node.children.push({
                        type: '#text',
                        nodeValue: this.left().slice(0, i)
                    })
                    this.index += (i + 3 + lower.length)
                    this.stack.pop()
                }
            }
        }
    }

    pp.parseCloseTag = function() {
        if (this.node)
            return
        var match = this.left().match(/^<\/([a-z][^>\s]*)>/i)
        if (match) {
            var tagName = match[1]
            var last = this.stack.last() || this.ret[this.ret.length - 1]
            if (!last) {
                throw '<\/' + tagName + '>  has no corresponding open tag'
            }
            if (last.type !== tagName) {

                throw 'expect close tagName is ' + last.type + ' but actuality is ' + tagName
            }
            this.stack.pop()
            this.index += match[0].length
            this.node = last
        }
    }

    pp.buildTree = function() {
        var node = this.node
        var p = this.stack.last()
        if (p) {
            p.children.push(node)
        } else {
            this.ret.push(node)
        }
    }

    //JSX parsing, processing string first, then find the first label
    pp.createText = function(left, i) {
        var content = left.slice(0, i)
        this.index += i
        if (/\?\?\d/.test(content)) {
            this.parseJSXText(content)
        } else {
            this.node = {
                type: '#text',
                nodeValue: content
            }
            if (/\S/.test(content)) {
                this.buildTree()
            }
        }

    }


    //quick match <div xxx  /> case

    pp.getSingleTag = function getSingleTag(str, tagName) {
        var match = str.match(new RegExp('<' + tagName + '[^>\\/]*\\/\\>'))
        if (match) {
            return [this.subParse(match[0]), this.recovery(str.slice(match[0].length))]
        }
        var regOpenTag = new RegExp('<' + tagName + '[^>\\/]*>')
        var regCloseTag = new RegExp('<\\/' + tagName + '>')
        var breakIndex = 0,
            ret = '',
            ok, match, index

        do {
            var match = str.match(regOpenTag)

            if (match) {
                breakIndex++
                index = match.index + match[0].length
                ret += str.slice(0, index)
                str = str.slice(index)
                ok = true
            }
            if (!ok) {
                match = str.match(regCloseTag)
                if (match) {
                    breakIndex--
                    index = match.index + match[0].length
                    ret += str.slice(0, index)
                    str = str.slice(index)
                    if (breakIndex === 0) {
                        break
                    }
                    ok = true
                }
            }
            if (!ok) {
                break
            }
            ok = false

        } while (1);
        return [this.subParse(ret), this.recovery(str)]

    }

    pp.subParse = function(str) {
        return ((new JSXParser(str, this.map)).parse() || [])[0]
    }

    pp.parseJSLogic = function(str) {
        str = clearString(str, this.map)
        var logic = []
        do {
            //According to the "return < div / >", "(< / div >", "[< div / >",, "< div >" segmentation
            var match = str.match(/((?:return\s|\(|\[\|,|^)\s*)\<[a-z]/i)
            if (match) {
                var splitIndex = match.index + match[1].length
                var leftContent = str.slice(0, splitIndex)
                var rightContent = str.slice(splitIndex)
                if (leftContent) {
                    logic.push({
                        type: '#jsx',
                        nodeValue: leftContent
                    })
                }

                var strNeedRecoverfy = clearBrace(rightContent, this.map)
                var tagName = strNeedRecoverfy.match(/\<([^\-\/\>\s]+)/)[1] //aaa.
                var subArray = this.getSingleTag(strNeedRecoverfy, tagName)
                str = subArray[1]
                logic.push(subArray[0])
            } else {
                break
            }
        } while (1);
        if (str) {
            logic.push({
                type: '#jsx',
                nodeValue: str
            })
        }
        return logic
    }

    pp.recovery = function(str) {
        var map = this.map
        return str.replace(/\?\?\d+\s/g, function(a) {
            return map[a]
        })
    }

    pp.parseJSXText = function(text) {
        var tokens = split(text, /\?\?\d+\s/),
            ret = [],
            node
        for (var i = 0, n = tokens.length; i < n; i++) {
            var c = tokens[i]
            var val = this.map[c]
            if (val) {
                if (/^['"]/.test(val)) {
                    node.nodeValue += val
                } else {
                    node = null
                    var inner = val.slice(1, -1)
                        // processing contains complex logic of JSX {[1, 2, 3]. The map (function (el) {return < div > < / div >} {el})}
                    if (/\<[a-z]/i.test(inner)) { //{里面包含标签}
                        ret.push({
                            type: '#jsx',
                            nodeValue: this.parseJSLogic(inner)
                        })
                    } else {
                        // 处理简单的逻辑 { el }
                        ret.push({
                            type: '#jsx',
                            nodeValue: this.recovery(inner)
                        })
                    }
                }
            } else {
                node = {
                    type: '#text',
                    nodeValue: c
                }
                ret.push(node)
            }
        }

        var p = this.stack.last()
        var arr = p && p.children || this.ret
        arr.push.apply(arr, ret)
        this.node = ret[ret.length - 1]
    }

    pp.parseText = function() {
        if (this.node)
            return
        var left = this.left()
        var i = left.indexOf('<')
        if (i === -1) { //如果是位于最后的文本节点
            if (left) {
                this.createText(left, i)
            }
        } else {
            // var pool = []
            var matchTag = left.match(/<\/?[a-z][^>]*>/)
            if (matchTag) {
                var index = matchTag.index
            }
            var matchComment = left.match(/<!--(?!<!)[^\[>][\s\S]*?-->/)
            if (matchComment) {
                throw ('jsx DO NOT support <!--xxx--> comment tag!')
                    //这应该抛出警告
            }

            if (index > 0) {
                this.createText(left, index)
            }

        }
    }


    var rattrs = /([^=\s]+)(?:=(\S+))?/
    pp.parseProps = function(attrs) {
        var props = this.node.props
        while (attrs) {
            var arr = rattrs.exec(attrs)

            if (arr) {
                var name = arr[1]
                var value = arr[2] || ''
                attrs = attrs.replace(arr[0], '')
                value = this.parseJSXAttr(value)
                props[name] = value
            } else {
                break
            }
        }
        return props
    }


    pp.left = function() {
        return this.input.slice(this.index)
    }

    pp.parseJSXAttr = function(str) {
        if ((str + ' ').match(/^\?\?\d+\s/)) {
            var val = this.map[str + ' ']
            var first = val.charAt(0)
            var inner = val.slice(1, -1)
            if (first === '"' || first === "'") {
                return inner
            } else {
                if (val.indexOf('<!--') !== -1) {
                    log('jsx DO NOT support <!--xxx--> comment tag!')
                }
                if (/<[a-z][^>]*?>/i.test(val)) {
                    return {
                        type: '#jsx',
                        nodeValue: this.parseJSLogic(inner)
                    }
                }
                return {
                    type: '#jsx',
                    nodeValue: inner
                }
            }
        }
        return str
    }

    return JSXParser;
});
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : global.JSXParser = factory();
})(this, function() {
    function oneObject(str) {
        var obj = {}
        str.split(",").forEach(_ => obj[_] = true)
        return obj
    }
    var voidTag = oneObject("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr")
    var specalTag = oneObject('xmp,style,script,noscript,textarea,template,#comment')

    var hiddenTag = oneObject('style,script,noscript,template')


    var JSXParser = function(a, f) {
        if (!(this instanceof JSXParser)) {
            return parse(a, f)
        }
        this.input = a
        this.getOne = f
    }
    JSXParser.prototype = {
        parse: function() {
            return parse(this.input, this.getOne)
        }
    }

    /**
     * 
     * 
     * @param {any} string 
     * @param {any} getOne 只返回一个节点
     * @returns 
     */
    function parse(string, getOne) {
        getOne = (getOne === void 666 || getOne === true)
        var ret = lexer(string, getOne)
        if (getOne) {
            return  ret[0] + '' ===  ret[0] ? ret[1] : ret[0]
        }
        return ret
    }

    function lexer(string, getOne) {
        var tokens = []
        var breakIndex = 120
        var stack = []
        var origString = string
        var origLength = string.length

        stack.last = function() {
            return stack[stack.length - 1]
        }
        var ret = []

        function addNode(node) {
            var p = stack.last()
            if (p && p.children) {
                p.children.push(node)
            } else {
                ret.push(node)
            }
        }

        var lastNode
        do {
            if (--breakIndex === 0) {
                break
            }
            var arr = getCloseTag(string)

            if (arr) { //处理关闭标签
                string = string.replace(arr[0], '')
                const node = stack.pop()
                    //处理下面两种特殊情况：
                    //1. option会自动移除元素节点，将它们的nodeValue组成新的文本节点
                    //2. table会将没有被thead, tbody, tfoot包起来的tr或文本节点，收集到一个新的tbody元素中
                if (node.type === 'option') {
                    node.children = [{
                        type: '#text',
                        nodeValue: getText(node)
                    }]
                } else if (node.type === 'table') {
                    insertTbody(node.children)
                }
                lastNode = null
                if (getOne && ret.length === 1 && !stack.length) {
                    return [origString.slice(0, origLength - string.length), ret[0]]
                }
                continue
            }

            var arr = getOpenTag(string)
            if (arr) {
                string = string.replace(arr[0], '')
                var node = arr[1]
                addNode(node)
                var selfClose = !!(node.isVoidTag || specalTag[node.type])
                if (!selfClose) { //放到这里可以添加孩子
                    stack.push(node)
                }
                if (getOne && selfClose && !stack.length) {
                    return [origString.slice(0, origLength - string.length), node]
                }
                lastNode = node
                continue
            }

            var text = ''
            do {
                //处理<div><<<<<<div>的情况
                const index = string.indexOf('<')
                if (index === 0) {
                    text += string.slice(0, 1)
                    string = string.slice(1)

                } else {
                    break
                }
            } while (string.length);
            //处理<div>{aaa}</div>,<div>xxx{aaa}xxx</div>,<div>xxx</div>{aaa}sss的情况
            const index = string.indexOf('<') //判定它后面是否存在标签
            const bindex = string.indexOf('{') //判定它后面是否存在jsx
            const aindex = string.indexOf('}')

            let hasJSX = (bindex < aindex) && (index === -1 || bindex < index)
            if (hasJSX) {
                if (bindex !== 0) { // 收集jsx之前的文本节点
                    text += string.slice(0, bindex)
                    string = string.slice(bindex)
                }
                addText(lastNode, text, addNode)
                string = string.slice(1) //去掉前面{
                var arr = parseCode(string)
                addNode(makeJSX(arr[1]))
                lastNode = false
                string = string.slice(arr[0].length + 1) //去掉后面的}
            } else {
                if (index === -1) {
                    text = string
                    string = ''
                } else {
                    text += string.slice(0, index)
                    string = string.slice(index)
                }
                addText(lastNode, text, addNode)
            }

        } while (string.length);
        return ret
    }


    function addText(lastNode, text, addNode) {
        if (/\S/.test(text)) {
            if (lastNode && lastNode.type === '#text') {
                lastNode.text += text
            } else {
                lastNode = {
                    type: '#text',
                    nodeValue: text
                }
                addNode(lastNode)
            }
        }
    }
    var rsp = /\s/
        //它用于解析{}中的内容，如果遇到不匹配的}则返回, 根据标签切割里面的内容 
    function parseCode(string) { // <div id={ function(){<div/>} }>
        var word = '', //用于匹配前面的单词
            braceIndex = 1,
            codeIndex = 0,
            nodes = [],
            quote,
            escape,
            state = 'code'
        for (var i = 0, n = string.length; i < n; i++) {
            var c = string.charAt(i),
                next = string.charAt(i + 1)
            switch (state) {
                case 'code':
                    if (c === '"' || c === "'") {
                        state = 'string'
                        quote = c
                        escape = false
                    } else if (c === '{') {
                        braceIndex++
                    } else if (c === '}') {
                        braceIndex--
                        if (braceIndex === 0) {
                            collectJSX(string, codeIndex, i, nodes)
                            return [string.slice(0, i), nodes]
                        }
                    } else if (c === '<') {
                        var word = '',
                            empty = true,
                            index = i - 1
                        do {
                            c = string.charAt(index)
                            if (empty && rsp.test(c)) {
                                continue
                            }
                            if (rsp.test(c)) {
                                break
                            }
                            empty = false
                            word = c + word
                            if (word.length > 7) { //性能优化
                                break
                            }
                        } while (--index >= 0);
                        var chunkString = string.slice(i)
                        if (word === '' || /(=>|return|\{|\(|\[|\,)$/.test(word) && /\<\w/.test(chunkString)) {
                            collectJSX(string, codeIndex, i, nodes)
                            var chunk = lexer(chunkString, true)
                            nodes.push(chunk[1])
                            i += (chunk[0].length - 1) //因为已经包含了<, 需要减1
                            codeIndex = i + 1
                        }

                    }
                    break
                case 'string':
                    if (c == '\\' && (next === '"' || next === "'")) {
                        escape = !escape
                    } else if (c === quote && !escape) {
                        state = 'code'
                    }
                    break
            }
        }
    }

    function collectJSX(string, codeIndex, i, nodes) {
        var nodeValue = string.slice(codeIndex, i)
        if (/\S/.test(nodeValue)) { //将{前面的东西放进去
            nodes.push({
                type: '#jsx',
                nodeValue: nodeValue
            })
        }
    }

    var rtbody = /^(tbody|thead|tfoot)$/

    function insertTbody(nodes) {
        var tbody = false
        for (var i = 0, n = nodes.length; i < n; i++) {
            var node = nodes[i]
            if (rtbody.test(node.nodeName)) {
                tbody = false
                continue
            }

            if (node.nodeName === 'tr') {
                if (tbody) {
                    nodes.splice(i, 1)
                    tbody.children.push(node)
                    n--
                    i--
                } else {
                    tbody = {
                        nodeName: 'tbody',
                        props: {},
                        children: [node]
                    }
                    nodes.splice(i, 1, tbody)
                }
            } else {
                if (tbody) {
                    nodes.splice(i, 1)
                    tbody.children.push(node)
                    n--
                    i--
                }
            }
        }
    }


    function getCloseTag(string) {
        if (string.indexOf("</") === 0) {
            var match = string.match(/\<\/(\w+)>/)
            if (match) {
                var tag = match[1]
                string = string.slice(3 + tag.length)
                return [match[0], {
                    type: tag
                }]
            }
        }
        return null
    }

    function getOpenTag(string) {
        if (string.indexOf("<") === 0) {
            var i = string.indexOf('<!--') //处理注释节点
            if (i === 0) {
                var l = string.indexOf('-->')
                if (l === -1) {
                    thow('注释节点没有闭合 ' + string.slice(0, 100))
                }
                var node = {
                    type: '#comment',
                    nodeValue: string.slice(4, l)
                }

                return [string.slice(0, l + 3), node]
            }
            var match = string.match(/\<(\w[^\s\/\>]*)/) //处理元素节点
            if (match) {
                var leftContent = match[0],
                    tag = match[1]
                var node = {
                    type: tag,
                    props: {},
                    children: []
                }

                string = string.replace(leftContent, '') //去掉标签名(rightContent)
                var arr = getAttrs(string) //处理属性
                if (arr) {
                    node.props = arr[1]
                    string = string.replace(arr[0], '')
                    leftContent += arr[0]
                }

                if (string[0] === '>') { //处理开标签的边界符
                    leftContent += '>'
                    string = string.slice(1)
                    if (voidTag[node.type]) {
                        node.isVoidTag = true
                    }
                } else if (string.slice(0, 2) === '/>') { //处理开标签的边界符
                    leftContent += '/>'
                    string = string.slice(2)
                    node.isVoidTag = true
                }

                if (!node.isVoidTag && specalTag[tag]) { //如果是script, style, xmp等元素
                    var closeTag = '</' + tag + '>'
                    var j = string.indexOf(closeTag)
                    var nodeValue = string.slice(0, j)
                    leftContent += nodeValue + closeTag
                    node.children.push({
                        type: '#text',
                        nodeValue: nodeValue
                    })
                }

                return [leftContent, node]
            }
        }
    }

    function getText(node) {
        var ret = ''
        node.children.forEach(function(el) {
            if (el.type === '#text') {
                ret += el.nodeValue
            } else if (el.children && !hiddenTag[el.type]) {
                ret += getText(el)
            }
        })
        return ret
    }

    function getAttrs(string) {
        var state = 'AttrNameOrJSX',
            attrName = '',
            attrValue = '',
            quote,
            escape,
            props = {}

        for (var i = 0, n = string.length; i < n; i++) {
            var c = string[i]
            switch (state) {
                case 'AttrNameOrJSX':
                    if (c === '/' || c === '>') {
                        return [string.slice(0, i), props]
                    }
                    if (rsp.test(c)) {
                        if (attrName) {
                            state = 'AttrEqual'
                        }
                    } else if (c === '=') {
                        if (!attrName) {
                            throw '必须指定属性名'
                        }
                        state = 'AttrQuoteOrJSX'
                    } else if (c === '{') {
                        state = 'SpreadJSX'
                    } else {
                        attrName += c
                    }
                    break
                case 'AttrEqual':
                    if (c === '=') {
                        state = 'AttrQuoteOrJSX'
                    }
                    break
                case 'AttrQuoteOrJSX':
                    if (c === '"' || c === "'") {
                        quote = c
                        escape = false
                        state = 'AttrValue'
                    } else if (c === '{') {
                        state = 'JSX'
                    }
                    break
                case 'AttrValue':
                    if (c === '\\')
                        escape = !escape
                    if (c !== quote) {
                        attrValue += c
                    } else if (c === quote && !escape) {
                        props[attrName] = attrValue
                        attrName = attrValue = ''
                        state = 'AttrNameOrJSX'
                    }
                    break
                case 'SpreadJSX':
                    i += 3
                case 'JSX':
                    var arr = parseCode(string.slice(i))
                    i += arr[0].length

                    props[state === 'SpreadJSX' ? 'spreadAttribute' : attrName] = makeJSX(arr[1])
                    attrName = attrValue = ''
                    state = 'AttrNameOrJSX'
                    break
            }
        }
        throw '必须关闭标签'
    }

    function makeJSX(JSXNode) {
        return JSXNode.length === 1 && JSXNode[0].type === '#jsx' ? JSXNode[0] : {
            type: '#jsx',
            nodeValue: JSXNode
        }
    }

    return JSXParser;
});
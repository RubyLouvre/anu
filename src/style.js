export function patchStyle(dom, oldStyle, newStyle) {
    if (oldStyle === newStyle) {
        return
    }
    for (var name in newStyle) {
        var val = newStyle[name]
        if (oldStyle[name] !== val) {
            delete oldStyle[name]
            name = getStyleName(name, dom)
            var type = typeof val
            if (type === void 666 || type === null) {
                val = ''
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + 'px'
            }
            dom.style[name] = val
        }
    }
    for (var name in oldStyle) {
        if (!(name in newStyle)) {
            dom.style[name] = ''
        }
    }
}


var rnumber = /^-?\d+(\.\d+)?$/
var rcamelize = /[-_][^-_]/g
export function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
        return target
    }
    //转换为驼峰风格
    return target.replace(rcamelize, function(match) {
        return match.charAt(1).toUpperCase()
    })
}

var rword = /[^, ]+/g

export function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || []
    }
    var result = {},
        value = val !== void 0 ? val : 1
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value
    }
    return result
}

var cssMap = oneObject('float', 'cssFloat')
var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom')

var testStyle = document.documentElement.style
var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-']

/**
 * 转换成当前浏览器可用的样式名
 * 
 * @param {any} name 
 * @returns 
 */
function cssName(name) {
    if (cssMap[name]) {
        return cssMap[name]
    }
    for (var i = 0, n = prefixes.length; i < n; i++) {
        var camelCase = camelize(prefixes[i] + name)
        if (camelCase in testStyle) {
            return (cssMap[name] = camelCase)
        }
    }
    return null
}
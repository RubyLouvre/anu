import { oneObject, camelize } from './util'
var rnumber = /^-?\d+(\.\d+)?$/
    /**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} oldStyle 
     * @param {any} newStyle 
     */
export function patchStyle(dom, oldStyle, newStyle) {
    if (oldStyle === newStyle) {
        return
    }
    for (var name in newStyle) {
        var val = newStyle[name]
        if (oldStyle[name] !== val) {
            delete oldStyle[name] //减少旧对象的键值对，以便减少第二次for in循环的负担
            name = getStyleName(name, dom)
            var type = typeof val
            if (type === void 666 || type === null) {
                val = '' //清除样式
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + 'px' //添加单位
            }
            dom.style[name] = val //应用样式
        }
    }
    for (var name in oldStyle) {
        if (!(name in newStyle)) {
            dom.style[name] = '' //清除样式
        }
    }
}




var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom')

var cssMap = oneObject('float', 'cssFloat')

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
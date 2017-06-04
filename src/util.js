/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
export function extend(obj, props) {
    if (props) {
        for (let i in props) {
            if (props.hasOwnProperty(i)) 
                obj[i] = props[i]
        }
    }
    return obj
}
/**
 * 一个空函数
 *
 * @export
 */
export function noop() {}
/**
 * 类继承
 *
 * @export
 * @param {any} SubClass
 * @param {any} SupClass
 */
export function inherit(SubClass, SupClass) {
    function Bridge() {}
    Bridge.prototype = SupClass.prototype

    let fn = SubClass.prototype = new Bridge()

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, SupClass.prototype)
    fn.constructor = SubClass
}
/**
 * 收集一个元素的所有孩子
 *
 * @export
 * @param {any} dom
 * @returns
 */
export function getNodes(dom) {
    var ret = [],
        c = dom.childNodes || []
    // eslint-disable-next-line
    for (var i = 0, el; el = c[i++];) {
        ret.push(el)
    }
    return ret
}
var lowerCache = {}

export function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase())
}



/**
 *
 *
 * @param {any} type
 * @returns
 */
export function isFn(type) {
    return typeof type === 'function'
}


var rword = /[^, ]+/g

export function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || []
    }
    var result = {},
     //eslint-disable-next-line
        value = val !== void 666
            ? val
            : 1
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value
    }
    return result
}

export function getChildContext(instance, context) {
    if (instance.getChildContext) {
        return extend(extend({}, context), instance.getChildContext())
    }
    return context
}
var rcamelize = /[-_][^-_]/g
export var __push = Array.prototype.push

export var HTML_KEY = 'dangerouslySetInnerHTML'
export function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
        return target
    }
    //转换为驼峰风格
    return target.replace(rcamelize, function (match) {
        return match
            .charAt(1)
            .toUpperCase()
    })
}

export var options = {
    updateBatchNumber: 1,
    immune: {} // Object.freeze(midway) ;midway.aaa = 'throw err';midway.immune.aaa = 'safe'
}


export function checkNull(vnode, type) {
    if (vnode === null || vnode === false) {
        return {type: '#comment', text: 'empty'}
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${type.name}#render:You may have returned undefined, an array or some other invalid object`)
    }
    return vnode
}
export function getComponentProps(type, props) {
    var defaultProps = type.defaultProps
    props = extend({}, props) //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
    for (var i in defaultProps) {
        //eslint-disable-next-line
        if (props[i] === void 666) {
            props[i] = defaultProps[i]
        }
    }
    return props
}
/**
 * 获取虚拟DOM对应的顶层组件实例的类型
 *
 * @param {any} vnode
 * @param {any} instance
 * @param {any} pool
 */

export function getComponentName(type) {
    return typeof type === 'function'
        ? (type.displayName || type.name)
        : type
}
export var recyclables = {
    '#text': [],
    '#comment': [],
    'span': [],
    'div': [],
    'td': [],
    'p': []
}

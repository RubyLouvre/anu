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
 *  收集一个元素的所有孩子
 *
 * @export
 * @param {any} dom
 * @returns
 */
export function getNodes(dom) {
    var ret = [],
        c = dom.childNodes || []
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
 * 收集该虚拟DOM的所有组件实例，方便依次执行它们的生命周期钩子
 *
 * @param {any} instance
 * @returns
 */
export function getInstances(instance) {
    var instances = [instance]
    while (instance = instance.parentInstance) {
        instances.push(instance)
    }
    return instances
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

/**
 *
 *
 * @export
 * @param {any} type
 * @returns
 */
export function isStateless(type) {
    var fn = type.prototype
    return isFn(type) && (!fn || !fn.render)
}

var rword = /[^, ]+/g

export function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || []
    }
    var result = {},
        value = val !== void 0
            ? val
            : 1
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value
    }
    return result
}

export function getContext(instance, context) {
    if (instance.getChildContext) {
        return extend(extend({}, context), instance.getChildContext())
    }
    return context
}
var rcamelize = /[-_][^-_]/g
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

export function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length > 0 && !isNullOrUndef(nextChildren[0].key) && lastChildren.length > 0 && !isNullOrUndef(lastChildren[0].key);
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
export var recyclableNodes = []

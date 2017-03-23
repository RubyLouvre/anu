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
            obj[i] = props[i]
        }
    }
    return obj
}
/**
 * 创建一个对象的浅克隆副本
 * 
 * @param {any} obj 
 * @returns 
 */
export function clone(obj) {
    return extend({}, obj)
}
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
 * 判定否为与事件相关
 * 
 * @param {any} name 
 * @param {any} val 
 * @returns 
 */
export function isEvent(name, val) {
    return /^on\w/.test(name)
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
 * 寻找适合的实例并返回
 * 
 * @param {any} instance 
 * @param {any} Type 
 * @returns 
 */
export function matchInstance(instance, Type) {
    do {
        if (instance.statelessRender === Type)
            return instance
        if (instance instanceof Type) {
            return instance
        }
    } while (instance = instance.parentInstance)
}
/**
 * 
 * 
 * @param {any} type 
 * @returns 
 */
export function isComponent(type) {
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
    return isComponent(type) && (!fn || !fn.render)
}
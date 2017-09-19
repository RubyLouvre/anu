export var __push = Array.prototype.push;

export var innerHTML = "dangerouslySetInnerHTML";
export var EMPTY_CHILDREN = [];

export var limitWarn = {
    createClass: 1,
    renderSubtree: 1
};
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
            if (props.hasOwnProperty(i)) obj[i] = props[i];
        }
    }
    return obj;
};

let __type = Object.prototype.toString;

/**
 * 一个空函数
 *
 * @export
 */
export function noop() { };

/**
 * 类继承
 *
 * @export
 * @param {any} SubClass
 * @param {any} SupClass
 */
export function inherit(SubClass, SupClass) {
    function Bridge() { };
    Bridge.prototype = SupClass.prototype;

    let fn = (SubClass.prototype = new Bridge());

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, SupClass.prototype);
    fn.constructor = SubClass;
    return fn;
};

/**
 * 收集一个元素的所有孩子
 *
 * @export
 * @param {any} dom
 * @returns
 */
export function getNodes(dom) {
    let ret = [],
        c = dom.childNodes || [];
    // eslint-disable-next-line
    for (let i = 0, el; (el = c[i++]);) {
        ret.push(el);
    }
    return ret;
};

var lowerCache = {};
/**
 * 小写化的优化
 *
 * @export
 * @param {any} s
 * @returns
 */
export function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
};

export function clearArray(a) {
    return a.splice(0, a.length)
};

/**
 *
 *
 * @param {any} obj
 * @returns
 */
export function isFn(obj) {
    return typeNumber(obj) === 5;
};

var rword = /[^, ]+/g;

export function oneObject(array, val) {
    if (typeNumber(array) === 4) {
        array = array.match(rword) || [];
    }
    let result = {},
        //eslint-disable-next-line
        value = val !== void 666 ? val : 1;
    for (let i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
};

export function getChildContext(instance, context) {
    if (instance.getChildContext) {
        return Object.assign({}, context, instance.getChildContext());
    }
    return context;
};

var rcamelize = /[-_][^-_]/g;
export function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || (target.indexOf("-") < 0 && target.indexOf("_") < 0)) {
        return target;
    }
    //转换为驼峰风格
    return target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
};

export var options = {
    beforeUnmount: noop,
    afterMount: noop,
    afterUpdate: noop
};

export function checkNull(vnode, type) {
    // if (Array.isArray(vnode) && vnode.length === 1) {
    //  vnode = vnode[0];
    // }
    if (vnode === null || vnode === false) {
        return { type: "#comment", text: "empty", vtype: 0 };
    } else if (!vnode || !vnode.vtype) {
        throw new Error(
            `@${type.name}#render:You may have returned undefined, an array or some other invalid object`
        );
    }
    return vnode;
};

var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6 array: 7, object:8
export function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === void 666) {
        return 0;
    }
    var a = numberMap[__type.call(data)];
    return a || 8;
};

export var recyclables = {
    "#text": [],
    "#comment": []
};

export let __push = Array.prototype.push;
export let hasSymbol = typeof Symbol === "function" && Symbol["for"]; 
export let innerHTML = "dangerouslySetInnerHTML";
export let hasOwnProperty = Object.prototype.hasOwnProperty;
export const REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;

export function Fragment(props) {
    return props.children;
}

export let emptyArray = [];
export let emptyObject = {};
export function deprecatedWarn(methodName) {
    if (!deprecatedWarn[methodName]) {
        //eslint-disable-next-line
        console.warn(methodName + " is deprecated");
        deprecatedWarn[methodName] = 1;
    }
}


/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
export function extend(obj, props) {
    for (let i in props) {
        if (hasOwnProperty.call(props,i)) {
            obj[i] = props[i];
        }
    }
    return obj;
}
export function returnFalse() {
    return false;
}
export function returnTrue() {
    return true;
}
export let __type = Object.prototype.toString;

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
    let orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    let fn = (SubClass.prototype = new Bridge());

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}

let lowerCache = {};
export function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

export function clearArray(a) {
    return a.splice(0, a.length);
}

export function isFn(obj) {
    return __type.call(obj) === "[object Function]";
}

let rword = /[^, ]+/g;

export function oneObject(array, val) {
    if (array + "" === array) {
        //利用字符串的特征进行优化，字符串加上一个空字符串等于自身
        array = array.match(rword) || [];
    }
    let result = {},
        //eslint-disable-next-line
        value = val !== void 666 ? val : 1;
    for (let i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}

let rcamelize = /[-_][^-_]/g;
export function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || (target.indexOf("-") < 0 && target.indexOf("_") < 0)) {
        return target;
    }
    //转换为驼峰风格
    let str = target.replace(rcamelize, function(match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}

export function firstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export let options = oneObject(["beforeProps", "afterCreate", "beforeInsert", "beforeDelete", "beforeUpdate", "afterUpdate", "beforePatch", "afterPatch", "beforeUnmount", "afterMount"], noop);

let numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
export function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === void 666) {
        return 0;
    }
    let a = numberMap[__type.call(data)];
    return a || 8;
}

export let toArray =
    Array.from ||
    function(a) {
        let ret = [];
        for (let i = 0, n = a.length; i < n; i++) {
            ret[i] = a[i];
        }
        return ret;
    };

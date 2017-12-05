export var __push = Array.prototype.push;
export var REACT_ELEMENT_TYPE = (typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element")) || 0xeac7;
export var innerHTML = "dangerouslySetInnerHTML";
export var emptyArray = [];
export var emptyObject = {};
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
        if (props.hasOwnProperty(i)) {
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
    Bridge.prototype = SupClass.prototype;

    let fn = (SubClass.prototype = new Bridge());

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, SupClass.prototype);
    fn.constructor = SubClass;
    return fn;
}

var lowerCache = {};
export function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

export function clearArray(a) {
    return a.splice(0, a.length);
}

export function isFn(obj) {
    return __type.call(obj) === "[object Function]";
}

var rword = /[^, ]+/g;

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

var rcamelize = /[-_][^-_]/g;
export function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || (target.indexOf("-") < 0 && target.indexOf("_") < 0)) {
        return target;
    }
    //转换为驼峰风格
    var str = target.replace(rcamelize, function(match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}

export function firstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export var options = oneObject(["beforeProps", "afterCreate", "beforeInsert", "beforeDelete", "beforeUpdate", "afterUpdate", "beforePatch", "afterPatch", "beforeUnmount", "afterMount"], noop);

var numberMap = {
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
    var a = numberMap[__type.call(data)];
    return a || 8;
}

export var toArray =
    Array.from ||
    function(a) {
        var ret = [];
        for (var i = 0, n = a.length; i < n; i++) {
            ret[i] = a[i];
        }
        return ret;
    };
export function createUnique() {
    return typeof Set === "function" ? new Set() : new InnerSet();
}
function InnerSet() {
    this.elems = [];
}
InnerSet.prototype = {
    add: function(el) {
        this.elems.push(el);
    },
    has: function(el) {
        return this.elems.indexOf(el) !== -1;
    }
};

export function collectAndResolveImpl(start, nodes, resolve, debug) {
    for (var child = start; child; child = child.sibling) {
        var inner = child.stateNode;
        if (child._disposed) {
            continue;
        }
        if (child.vtype < 2) {
            nodes.push(inner);
        } else {
            var updater = inner.updater;

            if (child.child) {
                collectAndResolveImpl(child.child, nodes, resolve, debug);
            }
            if(resolve){
                updater.addJob("resolve");
                resolve.push(updater);//先执行内围的，再执行外围的
            }
        }
    }
}

export function collectAndResolve(children, resolve, debug) {
    var ret = [];
    for (var i in children) {
        collectAndResolveImpl(children[i], ret, resolve, debug);
        break;
    }
    return ret;
}

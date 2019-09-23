"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayPush = Array.prototype.push;
exports.innerHTML = 'dangerouslySetInnerHTML';
exports.hasOwnProperty = Object.prototype.hasOwnProperty;
exports.gSBU = 'getSnapshotBeforeUpdate';
exports.gDSFP = 'getDerivedStateFromProps';
exports.hasSymbol = typeof Symbol === 'function' && Symbol['for'];
exports.effects = [];
exports.topFibers = [];
exports.topNodes = [];
exports.emptyArray = [];
exports.emptyObject = {};
exports.REACT_ELEMENT_TYPE = exports.hasSymbol
    ? Symbol['for']('react.element')
    : 0xeac7;
function noop() { }
exports.noop = noop;
function Fragment(props) {
    return props.children;
}
exports.Fragment = Fragment;
function returnFalse() {
    return false;
}
exports.returnFalse = returnFalse;
function returnTrue() {
    return true;
}
exports.returnTrue = returnTrue;
 > ;
void {
    keepLast(info) { }, : .containerStack,
    keepLast(info) { }, : .contextStack
};
function keepLast(list) {
    var n = list.length;
    list.splice(0, n - 1);
}
function get(key) {
    return key._reactInternalFiber;
}
exports.get = get;
exports.__type = Object.prototype.toString;
var fakeWindow = {};
function getWindow() {
    try {
        if (window) {
            return window;
        }
    }
    catch (e) { }
    try {
        if (global) {
            return global;
        }
    }
    catch (e) { }
    return fakeWindow;
}
exports.getWindow = getWindow;
function isMounted(instance) {
    var fiber = get(instance);
    return !!(fiber && fiber.hasMounted);
}
exports.isMounted = isMounted;
function toWarnDev(msg, deprecated) {
    msg = deprecated ? msg + ' is deprecated' : msg;
    let process = getWindow().process;
    if (process && process.env.NODE_ENV === 'development') {
        throw msg;
    }
}
exports.toWarnDev = toWarnDev;
function extend(obj, props) {
    for (let i in props) {
        if (exports.hasOwnProperty.call(props, i)) {
            obj[i] = props[i];
        }
    }
    return obj;
}
exports.extend = extend;
function inherit(SubClass, SupClass) {
    function Bridge() { }
    let orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    let fn = (SubClass.prototype = new Bridge());
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}
exports.inherit = inherit;
try {
    var supportEval = Function('a', 'return a + 1')(2) == 3;
}
catch (e) { }
let rname = /function\s+(\w+)/;
function miniCreateClass(ctor, superClass, methods, statics) {
    let className = ctor.name || (ctor.toString().match(rname) || ['', 'Anonymous'])[1];
    let Ctor = supportEval ? Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor) :
        function ReactInstance() {
            superClass.apply(this, arguments);
            ctor.apply(this, arguments);
        };
    Ctor.displayName = className;
    let proto = inherit(Ctor, superClass);
    extend(proto, methods);
    extend(Ctor, superClass);
    if (statics) {
        extend(Ctor, statics);
    }
    return Ctor;
}
exports.miniCreateClass = miniCreateClass;
let lowerCache = {};
function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}
exports.toLowerCase = toLowerCase;
function isFn(obj) {
    return exports.__type.call(obj) === '[object Function]';
}
exports.isFn = isFn;
let rword = /[^, ]+/g;
function oneObject(array, val) {
    if (array + '' === array) {
        array = array.match(rword) || [];
    }
    let result = {}, value = val !== void 666 ? val : 1;
    for (let i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}
exports.oneObject = oneObject;
let rcamelize = /[-_][^-_]/g;
function camelize(target) {
    if (!target || (target.indexOf('-') < 0 && target.indexOf('_') < 0)) {
        return target;
    }
    let str = target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}
exports.camelize = camelize;
function firstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.firstLetterLower = firstLetterLower;
let numberMap = {
    '[object Boolean]': 2,
    '[object Number]': 3,
    '[object String]': 4,
    '[object Function]': 5,
    '[object Symbol]': 6,
    '[object Array]': 7
};
function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === void 666) {
        return 0;
    }
    let a = numberMap[exports.__type.call(data)];
    return a || 8;
}
exports.typeNumber = typeNumber;
exports.toArray = Array.from ||
    function (a) {
        let ret = [];
        for (let i = 0, n = a.length; i < n; i++) {
            ret[i] = a[i];
        }
        return ret;
    };

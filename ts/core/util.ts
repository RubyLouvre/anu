export const arrayPush = Array.prototype.push;
export const innerHTML:string = 'dangerouslySetInnerHTML';
export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const gSBU:string = 'getSnapshotBeforeUpdate';
export const gDSFP:string = 'getDerivedStateFromProps';
export const hasSymbol = typeof Symbol === 'function' && Symbol['for'];
export const effects = [];
export const topFibers = [];
export const topNodes = [];
export const emptyArray = [];
export const emptyObject = {};


export const REACT_ELEMENT_TYPE = hasSymbol
    ? Symbol['for']('react.element')
    : 0xeac7;

interface Ref{
    [propName: string]: any
}
interface booleanFn{
    (arg0: any):boolean
}

type Primitive = number | string | boolean
type Nil = null | void


export function noop() {}

export function Fragment(props: Ref) {
    return props.children;
}


export var returnFalse: booleanFn = function(){
    return false;
}

export var returnTrue: booleanFn = function(){
    return true;
}


export function resetStack(info: Ref):void {
    keepLast(info.containerStack);
    keepLast(info.contextStack);
}

function keepLast(list: Array<any>): void {
    var n = list.length;
    list.splice(0, n - 1);
}

export function get(key: Ref): Ref {
    return key._reactInternalFiber;
}

export let __type = Object.prototype.toString;


var fakeWindow = {};
export function getWindow():Ref {
    try {
        if (window){
            return window;
        }
    /* istanbul ignore next  */
    } catch (e) {/*kill*/}
    try {
        if (global){
            return global;
        }
    /* istanbul ignore next  */
    } catch (e) {/*kill*/}
    return fakeWindow;
}

export var isMounted: booleanFn = function(instance) {
    var fiber = get(instance);
    return !!(fiber && fiber.hasMounted);
}

export function toWarnDev(msg: string, deprecated: boolean | void ): void | never {
    msg = deprecated ? msg + ' is deprecated' : msg;
    let process = getWindow().process;
    if (process && process.env.NODE_ENV === 'development') {
        throw msg;
    }
}

export function extend(obj:Ref, props:Ref):Ref {
    for (let i in props) {
        if (hasOwnProperty.call(props, i)) {
            obj[i] = props[i];
        }
    }
    return obj;
}

export function inherit(SubClass: Function, SupClass:Function): Function {
    function Bridge() {}
    let orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    let fn = (SubClass.prototype = new Bridge());
    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}
try {
    //微信小程序不支持Function
    var supportEval = Function('a', 'return a + 1')(2) == 3;
    /* istanbul ignore next  */
} catch (e) {}
let rname = /function\s+(\w+)/;
export function miniCreateClass(ctor:Function, superClass:Function, methods:Object, statics:Object|void):Function {
    let className = ctor.name || (ctor.toString().match(rname) ||['','Anonymous'])[1];
    let Ctor = supportEval ? Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor) : 
        function ReactInstance() {
            superClass.apply(this, arguments);
            ctor.apply(this, arguments);
        };
    Ctor.displayName = className;
    let proto = inherit(Ctor, superClass);
    extend(proto, methods);
    extend(Ctor, superClass);//继承父类的静态成员
    if (statics) {//添加自己的静态成员
        extend(Ctor, statics);
    }
    return Ctor;
}

let lowerCache = {};
export function toLowerCase(s: string): string {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

export function isFn(obj:any): boolean {
    return __type.call(obj) === '[object Function]';
}

let rword = /[^, ]+/g;

export function oneObject(array:string|Array<string>, val:Primitive|Nil):Ref {
    if (array + '' === array) {
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
export function camelize(target:string):string {
    //提前判断，提高getStyle等的效率
    if (!target || (target.indexOf('-') < 0 && target.indexOf('_') < 0)) {
        return target;
    }
    //转换为驼峰风格
    let str = target.replace(rcamelize, function(match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}

export function firstLetterLower(str:string):string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

let numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    '[object Boolean]': 2,
    '[object Number]': 3,
    '[object String]': 4,
    '[object Function]': 5,
    '[object Symbol]': 6,
    '[object Array]': 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8

export function typeNumber(data: any): number {
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
    function(a: any[]) {
        let ret = [];
        for (let i = 0, n = a.length; i < n; i++) {
            ret[i] = a[i];
        }
        return ret;
    };

import { hasOwnProperty } from 'react-core/util';
import { createElement } from 'react-core/createElement';
import { noop } from 'react-core/util';

function _uuid() {
    return (Math.random() + '').slice(-4);
}
export var shareObject = {
    app: {}
};
function _getApp() {
    return shareObject.app;
}
if (typeof getApp == 'function') {
    _getApp = getApp;//esline-disabled-line;
}
export { _getApp };
export var delayMounts = [];
export var usingComponents = [];
export var registeredComponents = {};
export var currentPage = {
    isReady: false
};
export function _getCurrentPages() {
    console.warn("getCurrentPages存在严重的平台差异性，不建议再使用"); //eslint-disable-line
    if (typeof getCurrentPages === 'function') {
        return getCurrentPages(); //eslint-disable-line
    }
}
export function getUUID() {
    return _uuid() + _uuid();
}
//用于保存所有用miniCreateClass创建的类，然后在事件系统中用到
export var classCached = {};

export function newData() {
    return {
        components: {}
    };
}
export function updateMiniApp(instance) {
    if (!instance || !instance.wx) {
        return;
    }
    var data = safeClone({
        props: instance.props,
        state: instance.state || null,
        context: instance.context
    });
    if (instance.wx.setData) {
        instance.wx.setData(data);
    } else {
        updateQuickApp(instance.wx, data);
    }
}

function updateQuickApp(quick, data) {
    for(var i in data){
        quick[i] = data[i];
    }
}

function isReferenceType(val) {
    return (
        val &&
        (typeof val === 'object' ||
            Object.prototype.toString.call(val) === '[object Array]')
    );
}

export function runFunction(fn, ...args) {
    if (typeof fn == 'function') {
        fn.call(null, ...args);
    }
}

// 计算参数中有多少个函数
function functionCount(...fns) {
    return fns
        .map(fn => typeof fn === 'function')
        .reduce((count, fn) => count + fn, 0);
}

export function apiRunner(arg = {}, apiCallback, apiPromise) {
    const { success, fail, complete } = arg;
    // 如果提供了回调函数则使用回调函数形式调用 API
    // 否则返回一个 Promise
    const handler = functionCount(success, fail, complete)
        ? apiCallback
        : apiPromise;
    arg.success = arg.success || noop;
    arg.fail = arg.fail || noop;
    arg.complete = arg.complete || noop;
    return handler(arg);
}

export function useComponent(props) {
    var is = props.is;
    var clazz = registeredComponents[is];
    delete props.is;
    var args = [].slice.call(arguments, 2);
    args.unshift(clazz, props);
    return createElement.apply(null, args);
}

function safeClone(originVal) {
    let temp = originVal instanceof Array ? [] : {};
    for (let item in originVal) {
        if (hasOwnProperty.call(originVal, item)) {
            let value = originVal[item];
            if (isReferenceType(value)) {
                if (value.$$typeof) {
                    continue;
                }
                temp[item] = safeClone(value);
            } else {
                temp[item] = value;
            }
        }
    }
    return temp;
}

export function toRenderProps() {
    return null;
}

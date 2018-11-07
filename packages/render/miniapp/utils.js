import { hasOwnProperty } from 'react-core/util';
import { createElement } from 'react-core/createElement';

function _uuid() {
    return (Math.random() + '').slice(-4);
}

export var delayMounts = [];
export var usingComponents = [];
export var registeredComponents = {};
export var currentPage = {
    isReady: false
};
export function _getCurrentPages(){
    console.warn('getCurrentPages存在严重的平台差异性，不建议再使用');//eslint-disable-line
    if (typeof getCurrentPages === 'function'){
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
    if (instance.wx.setData) {
        instance.wx.setData(
            safeClone({
                props: instance.props,
                state: instance.state || null,
                context: instance.context
            })
        );
    } else {
        updateQuickApp(instance.wx, instance);
    }
}

function updateQuickApp(quick, instance) {
    quick.props = instance.props;
    quick.state = instance.state || null;
    quick.context = instance.context;
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

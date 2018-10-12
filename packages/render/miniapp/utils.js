import { get, hasOwnProperty } from 'react-core/util';

function _uuid() {
    return (Math.random() + '').slice(-4);
}
export var delayMounts = [];
export function getUUID() {
    return _uuid() + _uuid();
}
//用于保存所有用miniCreateClass创建的类，然后在事件系统中用到
export var classCached = {};

export function newData() {
    return {
        components: {},
    };
}

function isReferenceType(val) {
    return val && (typeof val === 'object' || Object.prototype.toString.call(val) === '[object Array]');
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
export function updateView(instance) {
    instance.wx.setData(safeClone({
        props: instance.props,
        state: instance.state || null,
        context: instance.context,
    }));
}

export function setState(state, cb) {
    hackSetState(this);
    this.updater.enqueueSetState(this, state, cb);
}
export function forceUpdate(cb) {
    hackSetState(this);
    this.updater.enqueueSetState(this, true, cb);
}

export function hackSetState(instance) {
    var fiber = get(instance);
    var queue = fiber.updateQueue;
    if (!queue.pendingStates.length) {
        var cbs = queue.pendingCbs;
        cbs.push(function() {
            updateView(instance);
        });
    }
}

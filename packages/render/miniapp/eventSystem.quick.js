import { toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';

function getDataSetFromAttr(obj) {
    let ret = {};
    for (let name in obj) {
        if (name.slice(0, 4) == 'data') {
            var key = toLowerCase(name[4]) + name.slice(5);
            ret[key] = obj[name];
        }
    }
    return ret;
}

var beaconType = /click|tap|change|blur|input/i;
export function dispatchEvent(e) {
    const instance = this.reactInstance;
    if (!instance || !instance.$$eventCached) {
        return;
    }
    const eventType = toLowerCase(e._type || e.type);
    const target = e.currentTarget || e.target;
    // 小米1040 || 小米1040之前 || 华为在1050前
    var dataset = target.dataset || getDataSetFromAttr(target.attr || target._attr);
    const app = this.$app.$def;
    let eventUid = dataset[eventType + 'Uid'];
    const fiber = instance.$$eventCached[eventUid + 'Fiber'] || {
        props: {},
        type: 'unknown'
    };
    if (eventType == 'change') {
        if (fiber.props.value + '' === e.value) {
            return;
        }
    }
    var safeTarget = {
        dataset: dataset,
        nodeName: target._nodeName || target.nodeName || target.type,
        value: e.value
    };
    if (app && app.onCollectLogs && beaconType.test(eventType)) {
        app.onCollectLogs(dataset, eventType, fiber.stateNode);
    }

    Renderer.batchedUpdates(function () {
        try {
            var fn = instance.$$eventCached[eventUid];
            fn && fn.call(instance, createEvent(e, safeTarget, eventType));
        } catch (err) {
            console.log(err.stack); // eslint-disable-line
        }
    }, e);
}

export const webview = {};
// 创建事件对象
function createEvent(e, target, type) {
    var event = {};
    for (var i in e) {
        if (i.indexOf('_') !== 0) {
            event[i] = e[i];
        }
    }

    var touches = event.touches = e._touches || e._changeTouches;
    event.changeTouches = e._changeTouches;
    var touch = touches && touches[0];
    if (touch) {
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
    }
    event.nativeEvent = e;
    event.stopPropagation = e.stopPropagation.bind(e);
    if (e.preventDefault) {
        event.preventDefault = e.preventDefault.bind(e);
    } else {
        event.preventDefault = Date;
    }
    event.target = target;
    event.type = type;
    event.timeStamp = Date.now();
    return event;
}
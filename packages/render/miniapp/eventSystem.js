import { returnFalse, toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { _getApp } from './utils';
export let webview = {};

var rbeaconType = /click|tap|change|blur|input/i;
export function dispatchEvent(e) {
    const eventType = toLowerCase(e.type);
    if (eventType == 'message') { //处理支付宝web-view组件的dataset为空的BUG
        if (webview.instance && webview.cb) {
            webview.cb.call(webview.instance, e);
        }
        return;
    }
    let instance = this.reactInstance;
    if (instance.wrappedInstance) {
        instance = instance.wrappedInstance;
    }
    if (!instance || !instance.$$eventCached) {
        console.log(eventType, '没有实例');
        return;
    }
    const app = _getApp();
    const target = e.currentTarget;
    const dataset = target.dataset || {};
    const eventUid = dataset[eventType + 'Uid'];
    const fiber = instance.$$eventCached[eventUid + 'Fiber'] || {
        props: {},
        type: 'unknown'
    };
    const value = Object(e.detail).value;
    if (eventType == 'change') {
        if (fiber.props.value + '' == value) {
            return;
        }
    }
    let safeTarget = {
        dataset: dataset,
        nodeName: target.tagName || fiber.type,
        value: value
    };

    if (app && app.onCollectLogs && rbeaconType.test(eventType)) {
        app.onCollectLogs(dataset, eventType, fiber.stateNode);
    }


    Renderer.batchedUpdates(function () {
        try {
            var fn = instance.$$eventCached[eventUid];
            fn && fn.call(instance, createEvent(e, safeTarget));
        } catch (err) {
            console.log(err.stack); // eslint-disable-line
        }
    }, e);

}


//创建事件对象
function createEvent(e, target) {
    let event = Object.assign({}, e);
    if (e.detail) {
        Object.assign(event, e.detail);
    }
    //需要重写的属性或方法
    event.stopPropagation = function () {
        // eslint-disable-next-line
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.nativeEvent = e;
    event.preventDefault = returnFalse;
    event.target = target;
    event.timeStamp = Date.now();
    let touch = e.touches && e.touches[0];
    if (touch) {
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
    }
    return event;
}
import { returnFalse, toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { _getApp } from './utils';
export let webview = {};

var rbeaconType = /click|tap|change|blur|input/i;
export function dispatchEvent(e) {
    const eventType = toLowerCase(e.type);
    if (eventType == 'message') {//处理支付宝web-view组件的dataset为空的BUG
        if (webview.instance && webview.cb) {
            webview.cb.call(webview.instance, e);
        }
        return;
    }
    const instance = this.reactInstance;
    if (!instance || !instance.$$eventCached) {
        return;
    }
   
    const app = _getApp();
    const target = e.currentTarget;
    const dataset = target.dataset || {};
    let eventUid = dataset[eventType + 'Uid'];
    if (dataset['classUid']){
        const key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
    }
    const fiber = instance.$$eventCached[eventUid + 'Fiber'];
    if (eventType == 'change' && fiber) {
        if (fiber.props.value + '' == e.detail.value) {
            return;
        }
    }
    if ( app && app.onCollectLogs && rbeaconType.test(eventType) ) {
        app.onCollectLogs(dataset, eventType, fiber && fiber.stateNode);
    }
  
    if (instance) {
        Renderer.batchedUpdates(function () {
            try {
                var fn = instance.$$eventCached[eventUid];
                fn && fn.call(instance, createEvent(e, target));
            } catch (err) {
                console.log(err.stack);  // eslint-disable-line
            }
        }, e);
    }
}


//创建事件对象
function createEvent(e, target) {
    var event = Object.assign({}, e);
    if (e.detail) {
        Object.assign(event, e.detail);
        target.value = e.detail.value; //input.value
    }
    //需要重写的属性或方法
    event.stopPropagation = function () {
        // eslint-disable-next-line
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.preventDefault = returnFalse;
    event.target = target;
    event.timeStamp = new Date() - 0;
    if (!('x' in event)) { //支付宝没有x, y
        event.x = event.pageX;
        event.y = event.pageY;
    }
    return event;
}


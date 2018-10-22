import { returnFalse, toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';

export var eventSystem = { //hijack

    dispatchEvent: function (e) {
        if (e.type == 'message') {//处理支付宝web-view组件的dataset为空的BUG
            if (webview.instance && webview.cb) {
                webview.cb.call(webview.instance, e);
            }
            return;
        }
        const instance = this.reactInstance;
        if (!instance || !instance.$$eventCached) {
            return;
        }
        const target = e.currentTarget;
        const dataset = target.dataset || {};
        let eventUid = dataset[toLowerCase(e.type) + 'Uid'];
        const fiber = instance.$$eventCached[eventUid + 'Fiber'];
        if (e.type == 'change' && fiber) {
            if (fiber.props.value + '' == e.detail.value) {
                return;
            }
        }
        const key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
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
    },
};

export const webview = {};
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
    if (!("x" in event)) { //支付宝没有x, y
        event.x = event.pageX;
        event.y = event.pageY;
    }
    return event;
}


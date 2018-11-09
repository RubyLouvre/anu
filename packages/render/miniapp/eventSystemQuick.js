import { toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { _getApp } from './utils';

function getDataSet(obj) {
    let ret = {};
    for (let name in obj) {
        let key = name.replace(/data(\w)(\.*)/, function(a, b, c) {
            return toLowerCase(b) + c;
        });
        ret[key] = obj[name];
    }
    return ret;
}

export var eventSystem = {
    //hijack
    dispatchEvent: function(e) {
        const eventType = e._type;
        const target = e.target;
        const dataset = getDataSet(target._attr);
        if ((eventType == 'click' || eventType== 'tap' ) && dataset.beaconId){
            let fn = Object(_getApp()).onCollectLogs;
            fn && fn(dataset);
        }
        const instance = this.reactInstance;
        if (!instance || !instance.$$eventCached) {
            return;
        }
        let eventUid = dataset[toLowerCase(eventType) + 'Uid'];
        const key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
        if (instance) {
            Renderer.batchedUpdates(function() {
                try {
                    var fn = instance.$$eventCached[eventUid];
                    fn && fn.call(instance, createEvent(e, target));
                } catch (err) {
                    console.log(err.stack); // eslint-disable-line
                }
            }, e);
        }
    }
};

export const webview = {};
//创建事件对象
function createEvent(e, target) {
    var event = Object.assign({}, e);
    if (e.detail) {
        Object.assign(event, e.detail);
        target.value = e.detail.value; //input.value
    }
    event.stopPropagation = e.stopPropagation.bind(e);
    event.preventDefault = e.preventDefault.bind(e);
    event.target = target;
    event.type = e._type;
    event.timeStamp = new Date() - 0;
    return event;
}

import { toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';

function getDataSet(obj) {
    let ret = {};
    for (let name in obj) {
        let key = name.replace(/data(\w)(\.*)/, function (a, b, c) {
            return toLowerCase(b) + c;
        });
        ret[key] = obj[name];
    }
    return ret;
}
var beaconType = /click|tap|change|blur|input/i;
export function dispatchEvent(e) {
    const instance = this.reactInstance;
    if (!instance || !instance.$$eventCached) {
        return;
    }
    const eventType = toLowerCase(e._type);
    const target = e.target;
    const dataset = getDataSet(target._attr);
    const app = this.$app.def;
    let eventUid = dataset[eventType + 'Uid'];
    if (dataset['classUid']){
        const key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
    }
    const fiber = instance.$$eventCached[eventUid + 'Fiber'];
    if ( app && app.onCollectLogs && beaconType.test(eventType) ) {
        app.onCollectLogs(dataset, eventType, fiber && fiber.stateNode);
    }
    if (instance) {
        Renderer.batchedUpdates(function () {
            try {
                var fn = instance.$$eventCached[eventUid];
                fn && fn.call(instance, createEvent(e, target));
            } catch (err) {
                console.log(err.stack); // eslint-disable-line
            }
        }, e);
    }
}

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

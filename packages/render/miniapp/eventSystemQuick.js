import { toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';

function getDataSet(obj) {
    let ret = {};
    for (let name in obj) {
        if(name.slice(0, 4) == 'data'){
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
    const eventType = toLowerCase(e._type);
    const target = e.target;
    const dataset = getDataSet(target._attr);
    const app = this.$app.def;
    let eventUid = dataset[eventType + 'Uid'];
    if (dataset['classUid']){
        console.log("请尽快升级nanachi");//eslint-disable-line;
        const key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
    }
    const fiber = instance.$$eventCached[eventUid + 'Fiber'];
    if (eventType == 'change' && fiber) {
        if (fiber.props.value + '' == e.value) {
            return;
        }
    }
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
    var event = {};
    var fackTarget = {
        nodeName: target._nodeName,
        value: e.value
    };
    for (var i in e) {
        if (i.indexOf("_") !== 0) {
            event[i] = e[i];
        }
    }
    event.stopPropagation = e.stopPropagation.bind(e);
    event.preventDefault = e.preventDefault.bind(e);
    event.target = fackTarget;
    event.type = e._type;
    event.timeStamp = new Date() - 0;
    return event;
}

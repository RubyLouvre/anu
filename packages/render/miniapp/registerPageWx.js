import { isFn} from 'react-core/util';
import { eventSystem } from './eventSystem';
import { onLoad, onUnload, onReady } from './registerPageMethod';

export function registerPage(PageClass, path, testObject) {
    PageClass.reactInstances = [];
    let config = {
        data: {},
        dispatchEvent: eventSystem.dispatchEvent,
        onLoad(query) {
            onLoad.call(this, PageClass, path, query);
        },
        onReady: onReady,
        onUnload: onUnload
    };
    Array(
        'onPageScroll',
        'onShareAppMessage',
        'onReachBottom',
        'onPullDownRefresh'
    ).forEach(function(hook) {
        config[hook] = function() {
            let instance = this.reactInstance;
            let fn = instance[hook];
            if (isFn(fn)) {
                return fn.apply(instance, arguments);
            }
        };
    });
    Array('onShow', 'onHide').forEach(function(hook) {
        config[hook] = function() {
            let instance = this.reactInstance;
            let fn = instance[hook];
            if (isFn(fn)) {
                return fn.apply(instance, arguments);
            }
            let discarded =
                hook == 'onShow' ? 'componentDidShow' : 'componentDidHide';
            let fn2 = instance[discarded];
            if (isFn(fn2)) {
                console.warn(`${discarded} 已经被废弃，请使用${hook}`); //eslint-disable-line
                return fn2.apply(instance, arguments);
            }
        };
    });

    if (testObject) {
        config.setData = function(obj) {
            config.data = obj;
        };
        config.onLoad();
        return config;
    }
    return config;
}

import { isFn} from 'react-core/util';
import { dispatchEvent } from './eventSystem';
import { onLoad, onUnload, onReady } from './registerPageMethod';
import { callGlobalHook } from './utils';
var globalHooks = {
    onShareAppMessage: 'onGlobalShare',
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide',
};
var showHideHooks = {
    onShow: 'componentDidShow',
    onHide: 'componentDidHide'
};
export function registerPage(PageClass, path, testObject) {
    PageClass.reactInstances = [];
    let config = {
        data: {},
        dispatchEvent,
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
        'onPullDownRefresh',
        'onShow',
        'onHide'
    ).forEach(function(hook) {
        config[hook] = function() {
            let instance = this.reactInstance;
            let fn = instance[hook], fired = false;
            if (isFn(fn)) {
                fired = true;
                var ret =  fn.apply(instance, arguments);
                if (hook === 'onShareAppMessage'){
                    return ret;
                }
            }
            var globalHook = globalHooks[hook];
            if (globalHook){
                ret = callGlobalHook(globalHook);
                if (hook === 'onShareAppMessage'){
                    return ret;
                }
            }

            let discarded = showHideHooks[hook];
            if (!fired && instance[discarded]){
                console.warn(`${discarded} 已经被废弃，请使用${hook}`); //eslint-disable-line
                instance[discarded]();
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

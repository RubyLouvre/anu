import { isFn} from 'react-core/util';
import { dispatchEvent } from './eventSystem';
import { onLoad, onUnload, onReady } from './registerPage.all';
import { callGlobalHook,_getApp } from './utils';
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
        config[hook] = function(e) {
            let instance = this.reactInstance;
            let fn = instance[hook], fired = false;
            //在百度小程序，从A页面跳转到B页面，模拟器下是先触发A的onHide再触发B的onShow
            //真机下，却是先触发B的onShow再触发A的onHide,其他小程序可能也有这问题，因此我们只在onShow
            //里修改全局对象的属性
            if (hook === 'onShow'){
                _getApp().$$page = this;
                _getApp().$$pagePath = instance.props.path;
            }
            if (isFn(fn)) {
                fired = true;
                var ret =  fn.call(instance, e);
                if (hook === 'onShareAppMessage'){
                    return ret;
                }
            }
            var globalHook = globalHooks[hook];
            if (globalHook){
                ret = callGlobalHook(globalHook, e);
                if (hook === 'onShareAppMessage'){
                    return ret;
                }
            }

            let discarded = showHideHooks[hook];
            if (!fired && instance[discarded]){
                console.warn(`${discarded} 已经被废弃，请使用${hook}`); //eslint-disable-line
                instance[discarded](e);
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

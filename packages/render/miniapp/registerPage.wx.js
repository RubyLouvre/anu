import { isFn} from 'react-core/util';
import { dispatchEvent } from './eventSystem';
import { onLoad, onUnload, onReady } from './registerPage.all';
import { callGlobalHook,_getApp } from './utils';
var globalHooks = {
    onShare: 'onGlobalShare',
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide'
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
        'onResize',
        'onShow',
        'onHide'
    ).forEach(function(hook) {
        config[hook] = function(e) {
            let instance = this.reactInstance,
             fn = instance[hook], 
             fired = false,
             param = e 
            if (hook === 'onShareAppMessage'){
                hook = 'onShare';
                fn = fn || instance[hook];
            } else if (hook === 'onShow'){
                if(this.options){ //支付宝小程序不存在
                   instance.props.query =  this.options ;
                }
                param = instance.props.query
                //在百度小程序，从A页面跳转到B页面，模拟器下是先触发A的onHide再触发B的onShow
                //真机下，却是先触发B的onShow再触发A的onHide,其他小程序可能也有这问题，因此我们只在onShow
                //里修改全局对象的属性
                _getApp().$$page = this;
                _getApp().$$pagePath = instance.props.path;
            }
            if (isFn(fn)) {//页面级别
                fired = true;
                var ret =  fn.call(instance, param);
                if (hook === 'onShare'){
                    return ret;
                }
            }
            var globalHook = globalHooks[hook];
            if (globalHook){//应用级别
                ret = callGlobalHook(globalHook, param);
                if (hook === 'onShare'){
                    return ret;
                }
            }

            let discarded = showHideHooks[hook];
            if (!fired && instance[discarded]){
                console.warn(`${discarded} 已经被废弃，请使用${hook}`); //eslint-disable-line
                instance[discarded](param);
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

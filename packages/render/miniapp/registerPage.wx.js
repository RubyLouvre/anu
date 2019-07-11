import { dispatchEvent } from './eventSystem';
import { onLoad, onUnload, onReady } from './registerPage.all';
import { registerPageHook } from './registerPageHook';

import { _getApp } from './utils';

var appHooks = {
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide'
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
        'onShareAppMessage',
        'onPageScroll',
        'onReachBottom',
        'onPullDownRefresh',
        'onTabItemTap',
        'onResize',
        'onShow',
        'onHide'
    ).forEach(function(hook) {
        config[hook] = function(e) {
            let instance = this.reactInstance,
             pageHook = hook,
             app =  _getApp(),
             param = e 
            if (pageHook === 'onShareAppMessage'){
                if( !instance.onShare){
                    instance.onShare = instance[pageHook];
                }
                var shareObject = instance.onShare && instance.onShare(param);
                if(!shareObject){
                    shareObject = app.onGlobalShare && app.onGlobalShare(param);
                }
                return shareObject;
            } else if (pageHook === 'onShow'){
                if(this.options){ //支付宝小程序不存在this.options
                   instance.props.query = this.options ;
                }
                param = instance.props.query
                //在百度小程序，从A页面跳转到B页面，模拟器下是先触发A的onHide再触发B的onShow
                //真机下，却是先触发B的onShow再触发A的onHide,其他小程序可能也有这问题，因此我们只在onShow
                //里修改全局对象的属性
                app.$$page = this;
                app.$$pagePath = instance.props.path;
            }  
            //调用onShare/onHide/onGlobalShow/onGlobalHide/onPageScroll
            return registerPageHook(appHooks, pageHook, app, instance, param)
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

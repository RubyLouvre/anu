
import {  isFn } from 'react-core/util';
import { dispatchEvent } from './eventSystemQuick';
import { onLoad, onUnload, onReady } from './registerPageMethod';
import { shareObject, callGlobalHook } from './utils';
var globalHooks = {
    onShareAppMessage: 'onGlobalShare',
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide',
};
export function registerPage(PageClass, path) {
    PageClass.reactInstances = [];
    let config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        dispatchEvent,
        onInit(query) {
            var $app =  shareObject.app = this.$app.$def || this.$app._def;
            var instance = onLoad.call(this,PageClass, path, query);
            // shareObject的数据不是长久的，在页面跳转时，就会丢失
            var pageConfig = instance.config || PageClass.config;
            $app.pageConfig = pageConfig && Object.keys(pageConfig).length ? pageConfig : null;
            $app.pagePath = path;
            $app.page = instance;
        },
        onReady: onReady,
        onDestroy: onUnload
    };
    Array('onShow', 'onHide', 'onMenuPress').forEach(function(hook) {
        config[hook] = function() {
            let instance = this.reactInstance;
           
            let fn = instance[hook];
            if (isFn(fn)) {
                fn.apply(instance, arguments);
            }
            let globalHook = globalHooks[hook];
            if( globalHook ){
                callGlobalHook(globalHook);
            }
        };
    });
    return config;
}

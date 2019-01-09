import { isFn } from 'react-core/util';
import { dispatchEvent } from './eventSystem.quick';
import { onLoad, onUnload, onReady } from './registerPage.all';
import { callGlobalHook,_getApp } from './utils';
import { showMenu } from './showMenu.quick';
var globalHooks = {
    onShareAppMessage: 'onGlobalShare',
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide'
};
function getUrlAndQuery(page){
    var path = page.path;
    var query = {};
    page.uri.replace(/\?(.*)/, function (a, b) {
        b.split('&').forEach(function (param) {
            param = param.split('=');
            query[param[0]] = param[1];
        });
        return '';
    });
    
    return [path, query];
}
export function registerPage(PageClass) {
    PageClass.reactInstances = [];
    let config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        dispatchEvent,
        onInit() {
            var $app = this.$app; //.$def || this.$app._def);
            var array = getUrlAndQuery(this.$page);
            var instance = onLoad.call(this, PageClass, array[0], array[1]);
            var pageConfig = instance.config || PageClass.config;
            $app.$$pageConfig =
                pageConfig && Object.keys(pageConfig).length
                    ? pageConfig
                    : null;
            // $app.$$pagePath = array[0];
        },
        onReady: onReady,
        onDestroy: onUnload
    };
    Array('onShow', 'onHide', 'onMenuPress').forEach(function(hook) {
        config[hook] = function(e) {
            let instance = this.reactInstance;
            let fn = instance[hook];
            if (hook === 'onShow'){
                _getApp().$$page = instance.wx;
                _getApp().$$pagePath = instance.props.path;
            }
            if (hook === 'onMenuPress') {
                showMenu(instance, this.$app);
            } else if (isFn(fn)) {
                fn.call(instance, e);
            }

            let globalHook = globalHooks[hook];
            if (globalHook) {
                callGlobalHook(globalHook, e);
            }
        };
    });
    return config;
}

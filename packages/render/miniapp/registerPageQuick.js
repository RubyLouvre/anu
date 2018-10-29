import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { noop } from 'react-core/util';
import { eventSystem } from './eventSystemQuick';
import { delayMounts, updateMiniApp } from './utils';

export var shareObject = {};
export function getApp() {
    return shareObject.app;
}

export function registerPage(PageClass, path) {
    PageClass.reactInstances = [];
    var instance;
    var config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        dispatchEvent: eventSystem.dispatchEvent,
        onInit(query) {
            shareObject.app = this.$app.$def || this.$app._def;
            instance = render(
                createElement(PageClass, {
                    path: path,
                    query: query,
                    isPageComponent: true,
                }),
                {
                    type: 'page',
                    props: {},
                    children: [],
                    root: true,
                    appendChild: noop,
                }
            );
            transmitData(PageClass, path, instance, this);
        },
        onShow() {
            var fn = this.reactInstance.componentDidShow;
            fn && fn.call(instance);
        },
        onHide() {
            var fn = this.reactInstance.componentDidHide;
            fn && fn.call(instance);
        },
        onReady() {
            var el;
            while ((el = delayMounts.pop())) {
                el.fn.call(el.instance);
                el.instance.componentDidMount = el.fn;
            }
        },
        onMenuPress(a) {
            instance.onMenuPress && instance.onMenuPress(a);
        }
    };

    return config;
}
// shareObject的数据不是长久的，在页面跳转时，就会丢失
function transmitData(pageClass, pagePath, reactInstance, quickInstance) {
    //互相持有引用
    reactInstance.wx = quickInstance;
    quickInstance.reactInstance = reactInstance;
    //更新视图
    updateMiniApp(reactInstance);
    //关联页面的wrapper的各种事件
    var pageConfig = reactInstance.config || pageClass.config;
    shareObject.pageConfig = Object.keys(pageConfig).length ? pageConfig: null;
    shareObject.pagePath = pagePath;
    shareObject.page = reactInstance;
}

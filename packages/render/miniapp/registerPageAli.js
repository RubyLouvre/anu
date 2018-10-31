
import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { isFn, noop } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { delayMounts, updateMiniApp } from './utils';

const HookMap = {
    onShow: 'componentDidShow',
    onHide: 'componentDidHide',
    onUnload: 'componentWillUnmount',
};

export function applyAppStore() {
    // eslint-disable-next-line
    console.log('此方法已废弃');
}
export var currentPageComponents = {};
export function updateChildComponents() {
    for (var name in currentPageComponents) {
        var type = currentPageComponents[name];
        if (type && type.wxInstances) {//对支付宝原生组件的实例进行排序
            var wxInstances = type.wxInstances.sort(function (a, b) {
                return a.$id - b.$id;
            });
            var reactInstances = type.reactInstances;
            while (reactInstances.length && wxInstances.length) {//各自持有引用
                var reactInstance = reactInstances.shift();
                var wxInstance = wxInstances.shift();
                reactInstance.wx = wxInstance;
                wxInstance.reactInstance = reactInstance;
                updateMiniApp(reactInstance);//刷新视图
            }
            delete currentPageComponents[name];
        }
    }
    //标记第一屏子组件已更新完毕，如果组件包含子组件的情况，再递归调用updateChildComponents
    var el = void 0;
    while (el = delayMounts.pop()) {
        el.fn.call(el.instance);
        el.instance.componentDidMount = el.fn;
    }
}
export function registerPage(PageClass, path, testObject) {
    PageClass.reactInstances = [];
    var pageViewInstance,
        config = {
            data: {},
            dispatchEvent: eventSystem.dispatchEvent,
            onLoad: function onLoad(query) {
                pageViewInstance = render(
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

                this.reactInstance = pageViewInstance;
                pageViewInstance.wx = this;
                updateMiniApp(pageViewInstance);
            },
            onReady: function onReady() {
                updateChildComponents();
            },
        };
    Array(
        'onPageScroll',
        'onShareAppMessage',
        'onReachBottom',
        'onPullDownRefresh',
        'onShow',
        'onHide',
        'onUnload'
    ).forEach(function(hook) {
        config[hook] = function() {
            var name = HookMap[hook] || hook;
            var fn = pageViewInstance[name];
            if (isFn(fn)) {
                return fn.apply(pageViewInstance, arguments);
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


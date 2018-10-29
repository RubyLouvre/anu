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
                var el;
                while ((el = delayMounts.pop())) {
                    el.fn.call(el.instance);
                    el.instance.componentDidMount = el.fn;
                }
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

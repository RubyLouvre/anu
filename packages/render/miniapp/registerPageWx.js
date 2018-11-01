import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { isFn, noop, topNodes, topFibers } from 'react-core/util';
import { eventSystem } from './eventSystem';
import {
    delayMounts,
    updateMiniApp,
    usingComponents,
    currentPage
} from './utils';
import { Renderer } from 'react-core/createRenderer';

export function registerPage(PageClass, path, testObject) {
    PageClass.reactInstances = [];
    var pageViewInstance,
        config = {
            data: {},
            dispatchEvent: eventSystem.dispatchEvent,
            onLoad(query) {
                //临时移除
                currentPage.isReady = false;
                var container = {
                    type: 'page',
                    props: {},
                    children: [],
                    root: true,
                    appendChild: noop
                };
                pageViewInstance = render(
                    createElement(PageClass, {
                        path: path,
                        query: query,
                        isPageComponent: true
                    }),
                    container
                );
                this.reactInstance = pageViewInstance;
                this.reactContainer = container;
                pageViewInstance.wx = this;
                updateMiniApp(pageViewInstance);
            },
            onReady() {
                currentPage.isReady = true;
                var el = void 0;
                while ((el = delayMounts.pop())) {
                    el.fn.call(el.instance);
                    el.instance.componentDidMount = el.fn;
                }
            },
            onShow: function() {
                let instance = this.reactInstance;
                let fn = instance.onShow;
                if (fn) {
                    return fn.apply(instance, arguments);
                }
                let fn2 = instance.componentDidShow;
                if (fn2) {
                    console.warn("componentDidShow 已经被废弃，请使用onShow"); //eslint-disable-line
                    return fn2.apply(instance, arguments);
                }
            },
            onHide: function() {
                let instance = this.reactInstance;
                let fn = instance.onHide;
                if (fn) {
                    return fn.apply(instance, arguments);
                }
                let fn2 = instance.componentDidHide;
                if (fn2) {
                    console.warn("componentDidHide 已经被废弃，请使用onHide"); //eslint-disable-line
                    return fn2.apply(instance, arguments);
                }
            },
            onUnload() {
                for (let i in usingComponents) {
                    let a = usingComponents[i];
                    if (a.reactInstances) {
                        // eslint-disable-next-line
                        console.log(
                            i,
                            '还有',
                            a.reactInstances.length,
                            '实例没有使用过'
                        );
                        a.reactInstances.length = 0;
                        a.wxInstances.length = 0;
                    }
                    delete usingComponents[i];
                }
                let root = this.reactContainer;
                let container = root._reactInternalFiber;
                let instance = this.reactInstance;
                let hook = instance.componentWillUnmount;
                if (isFn(hook)) {
                    hook.call(instance);
                }
                if (container) {
                    Renderer.updateComponent(
                        container.hostRoot,
                        {
                            child: null
                        },
                        function() {
                            root._reactInternalFiber = null;
                            let j = topNodes.indexOf(root);
                            if (j !== -1) {
                                topFibers.splice(j, 1);
                                topNodes.splice(j, 1);
                            }
                        },
                        true
                    );
                }
            }
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

    if (testObject) {
        config.setData = function(obj) {
            config.data = obj;
        };
        config.onLoad();
        return config;
    }
    return config;
}

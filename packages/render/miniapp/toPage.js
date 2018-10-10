import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { Component } from 'react-core/Component';
import { isFn, noop, get, miniCreateClass } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { getUUID, newData, delayMounts } from './utils';

export function onPageUpdate(fiber) {
    var instance = fiber.stateNode;
    var type = fiber.type;
    if (!instance.instanceUid) {
        var uuid = 'i' + getUUID();
        instance.instanceUid = uuid;
        type[uuid] = instance;
    }
    instance.wxData = newData();
    instance.props.instanceUid = instance.instanceUid;
}
function safeClone(originVal) {
    let temp = originVal instanceof Array ? [] : {};
    for (let item in originVal) {
        if (originVal.hasOwnProperty(item)) {
            let value = originVal[item];
            if (isReferenceType(value)) {
                if (value.$$typeof) {
                    continue;
                }
                temp[item] = safeClone(value);
            } else {
                temp[item] = value;
            }
        }
    }
    return temp;
}
const HookMap = {
    onShow: 'componentDidShow',
    onHide: 'componentDidHide',
    onUnload: 'componentWillUnmount'
};
function isReferenceType(val) {
    return (
        val &&
        (typeof val === 'object' ||
            Object.prototype.toString.call(val) === '[object Array]')
    );
}
var appStore;
var Provider = miniCreateClass(
    function Provider(props) {
        this.store = props.store;
    },
    Component,
    {
        getChildContext: function getChildContext() {
            return { store: this.store };
        },
        render: function render$$1() {
            return this.props.children;
        }
    }
);
export function applyAppStore(store) {
    appStore = store;
}
export function toPage(PageClass, path, testObject) {
    //添加一个全局代理的事件句柄
    var $wxPage = {
            setData: noop
        },
        pageInstance, //页面实例
        pageViewInstance, //页面视图实例
        config = {
            data: newData(),
            dispatchEvent: eventSystem.dispatchEvent,
            onLoad: function(query) {
                $wxPage = this;
                var topComponent = createElement(PageClass, {
                    path: path,
                    query: query
                });
                if (appStore) {
                    //让页面组件依装成普通组件，这样框架才会让它进onComponentUpdate方法，并添加上instanceUid
                    topComponent.props.wxComponentFlag = true;
                    topComponent = createElement(
                        Provider,
                        {
                            path: path,
                            store: appStore
                        },
                        topComponent
                    );
                }
                topComponent.props.isPageComponent = true;
                pageInstance = render(topComponent, {
                    type: 'page',
                    props: {},
                    children: [],
                    root: true,
                    appendChild: noop
                });
                pageViewInstance = pageInstance;
                //得到用户定义的组件，如果用户使用了redux,那么它会用上<Provider />与<Connect />
                while (!pageViewInstance.classUid) {
                    var fiber = get(pageViewInstance).child;
                    if (fiber && fiber.stateNode) {
                        pageViewInstance = fiber.stateNode;
                    }
                }
                var anuSetState = pageInstance.setState;
                var anuForceUpdate = pageInstance.forceUpdate;
                var canSetData = false;
                function updatePage(pageInst) {
                    var data = pageInst.wxData;
                    data.state = pageViewInstance.state;
                    data.context = pageViewInstance.context;
                    data.props = pageViewInstance.props;
                    $wxPage.setData(safeClone(data), function() {});
                }
                pageInstance.forceUpdate = pageInstance.setState = function(a) {
                    var updateMethod = anuSetState;
                    var cbIndex = 1;
                    if (isFn(a) || a == null) {
                        updateMethod = anuForceUpdate;
                        cbIndex = 0;
                    }
                    var pageInst = this.$pageInst || this;
                    if (canSetData === false) {
                        canSetData = true;
                    }
                    var cb = arguments[cbIndex];
                    var args = Array.prototype.slice.call(arguments);
                    args[cbIndex] = function() {
                        cb && cb.call(this);
                        if (canSetData) {
                            canSetData = false;
                            updatePage(pageInst);
                        }
                    };
                    updateMethod.apply(this, args);
                };

                pageInstance.wxData = pageInstance.wxData || newData();

                updatePage(pageInstance);
            }
        };
    config.onReady = function() {
        var el;
        while ((el = delayMounts.shift())) {
            el.fn.call(el.instance);
            el.instance.componentDidMount = el.fn;
        }
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
        var name = HookMap[hook] || hook;
        var fn = pageViewInstance[name];
        if (isFn(fn)) {
            config[hook] = function() {
                return fn.apply(pageViewInstance, arguments);
            };
        }
    });

    if (testObject) {
        config.setData = function(obj) {
            config.data = obj;
        };
        config.onLoad();
        return config;
    }
    return safeClone(config);
}

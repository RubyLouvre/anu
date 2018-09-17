import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { Component } from 'react-core/Component';
import { isFn, noop, extend , get, miniCreateClass} from 'react-core/util';
import { eventSystem } from './eventSystem';
import { getUUID, newData } from './utils';

export function onPageUpdate(fiber) {
    var instance = fiber.stateNode;
    var type = fiber.type;
    if (!instance.instanceUid) {
        var uuid = 'i' + getUUID();
        instance.instanceUid = uuid;
        type.instances[uuid] = instance;
        //用于事件委托中
    }
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

function isReferenceType(val) {
    return val && (typeof val === 'object' || Object.prototype.toString.call(val) === '[object Array]');
}
var appStore;
var Provider = miniCreateClass(function (props) {
    this.store = props.store;
}, Component, {
    getChildContext: function getChildContext() {
        return { store: this.store };
    },
    render: function render$$1() {
        return this.props.children;
    }
});
export function applyAppStore(store){
    appStore = store;
}
export function toPage(PageClass, path, testObject) {
    //添加一个全局代理的事件句柄
    PageClass.prototype.dispatchEvent = eventSystem.dispatchEvent;

    PageClass.instances = PageClass.instances || {};
    var $wxPage = {
            setData: noop,
        },
        instance,
        config = {
            data: newData(),
            dispatchEvent: eventSystem.dispatchEvent,
            onLoad: function(query) {
                $wxPage = this;
                // eslint-disable-next-line
                console.log('onLoad', path);
                var topComponent = createElement(PageClass, {
                    path: path,
                    query: query,
                    isPageComponent: true
                });
                if (appStore) {
                    topComponent = createElement(Provider, { store: appStore }, topComponent);
                }
                instance = render(
                    topComponent,
                    {
                        type: 'page',
                        props: {},
                        children: [],
                        root: true,
                        appendChild: noop,
                    }
                );
                if (appStore) {
                    instance = get(instance).child.stateNode;
                }
                var anuSetState = instance.setState;
                var anuForceUpdate = instance.forceUpdate;
                var updating = false;
                var canSetData = false;
                function updatePage(pageInst) {
                    var data = pageInst.wxData;
                    extend(data, {
                        state: pageInst.state,
                        props: pageInst.props,
                        context: pageInst.context,
                    });

                    $wxPage.setData(safeClone(data), function() {
                        console.log('setData complete',data);
                    });
                }
                instance.forceUpdate = instance.setState = function(a) {
                    var updateMethod = anuSetState;
                    var cbIndex = 1;
                    if (isFn(a) || a == null) {
                        updateMethod = anuForceUpdate;
                        cbIndex = 0;
                    }
                    var pageInst = this.$pageInst || this;
                    if (updating === false) {
                        if (pageInst == this) {
                            pageInst.wxData = newData();
                        } 
                        canSetData = true;
                        updating = true;
                    }
                    var cb = arguments[cbIndex];
                    var args = Array.prototype.slice.call(arguments);
                    args[cbIndex] = function() {
                        cb && cb.call(this);
                        if (canSetData) {
                            canSetData = false;
                            updating = false;
                            updatePage(pageInst);
                        }
                    };
                    updateMethod.apply(this, args);
                };

                instance.wxData = instance.wxData || newData();
                updatePage(instance);
            },
            onShow() {
                PageClass.instances[instance.instanceUid] = instance;
                var fn = instance.componentDidShow;
                if (isFn(fn)) {
                    fn.call(instance);
                }
            },
            onHide() {
                delete PageClass.instances[instance.instanceUid];
                var fn = instance.componentDidHide;
                if (isFn(fn)) {
                    fn.call(instance);
                }
            },
            onUnload() {
                var fn = instance.componentWillUnmount;
                if (isFn(fn)) {
                    fn.call(instance);
                }
                instance = {};
            },
        };
    'onPageScroll,onShareAppMessage,onReachBottom,onPullDownRefresh'.replace(
        /\w+/g,
        function(hook) {
            config[hook] = function() {
                var fn = instance[hook];
                if (isFn(fn)) {
                    fn.apply(instance, arguments);
                }
            };
        }
    );
    if (testObject) {
        config.setData = function(obj) {
            config.data = obj;
        };
        config.onLoad();
        return config;
    }
    return safeClone(config);
}

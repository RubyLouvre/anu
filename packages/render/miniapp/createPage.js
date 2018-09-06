import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { isFn, noop, extend } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { getUUID } from './utils';

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
    return (
        val &&
        (typeof val === 'object' ||
            Object.prototype.toString.call(val) === '[object Array]')
    );
}
export function createPage(PageClass, path, testObject) {
    //添加一个全局代理的事件句柄
    PageClass.prototype.dispatchEvent = eventSystem.dispatchEvent;
  
    PageClass.instances = PageClass.instances || {};
    var $wxPage = {
            setData: noop
        },
        instance,
        config = {
            data: {},
            dispatchEvent: eventSystem.dispatchEvent,
            onLoad: function(query) {
                $wxPage = this;
                // eslint-disable-next-line
                console.log("onLoad", path);
                instance = render(
                    createElement(PageClass, {
                        path: path,
                        query: query,
                        isPageComponent: true
                    }),
                    {
                        type: 'page',
                        props: {},
                        children: [],
                        root: true,
                        appendChild: noop
                    }
                );
                var anuSetState = instance.setState;
                var anuForceUpdate = instance.forceUpdate;
                var updating = false,
                    canSetData = false;
                //劫持页面组件的生命周期，与setState进行联动
                instance.forceUpdate = instance.setState = function(a) {
                    instance.wxData = instance.wxData || {};
                    var updateMethod = anuSetState;
                    var cbIndex = 1;
                    if (isFn(a) || a == null) {
                        updateMethod = anuForceUpdate;
                        cbIndex = 0;
                    }
                    var pageInst = this.$pageInst || this;
                    if (updating === false) {
                        if (pageInst == this) {
                            pageInst.wxData = {};
                        } else {
                            this.updateWXData = true;
                        }
                        canSetData = true;
                        updating = true;
                    }
                    var inst = this,
                        cb = arguments[cbIndex],
                        args = Array.prototype.slice.call(arguments);
                    args[cbIndex] = function() {
                        cb && cb.call(inst);
                        if (canSetData) {
                            canSetData = false;
                            updating = false;
                            var data = pageInst.wxData;
                            extend(data, {
                                state: pageInst.state,
                                props: pageInst.props,
                                context: pageInst.context
                            });

                            $wxPage.setData(safeClone(data), function() {
                                // eslint-disable-next-line
                                console.log("setData", data);
                            });
                        }
                    };
                    updateMethod.apply(this, args);
                };
                instance.forceUpdate();
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
            onReady(){
                // eslint-disable-next-line
                // console.log('onReady',path);
            },
            onUnload() {
                var fn = instance.componentWillUnmount;
                if (isFn(fn)) {
                    fn.call(instance);
                }
                instance = {};
            }
        };
    if (testObject) {
        config.setData = function(obj){
            config.data = obj;
        };
        config.onLoad();
        return config;
    }
    return safeClone(config);
}

function applyChildComponentData(data, list) {
    list.forEach(function(el) {
        if (data[el.templatedata]) {
            data[el.templatedata].push(el);
        } else {
            data[el.templatedata] = [el];
        }
    });
}

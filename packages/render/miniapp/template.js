import { extend } from "react-core/util";
import { createElement } from "react-core/createElement";
import { getUUID } from "./getUUID";
export function onComponentUpdate(fiber) {
    var instance = fiber.stateNode;
    var type = fiber.type;
    var instances = type.instances;
    //不是使用miniCreateClass创建的组件直接返回
    if (!instances) {
        return;
    }
    var instanceCode = instance.instanceCode;
    if (!instanceCode) {
        instanceCode = instance.instanceCode = getUUID();
        instances[instanceCode] = instance;
        var p = fiber.return;
        while (p) {
            var inst = p._owner;
            if (inst) {
                if (inst.$pageInst) {
                    //如果它的父组件已经保存了$pageInst
                    instance.$pageInst = inst.$pageInst;
                    break;
                } else if (inst.props && inst.props.isPageComponent) {
                    instance.$pageInst = inst;
                    break;
                }
            }
        }
    }
    var inputProps = fiber._owner.props;
    var pageInst = instance.$pageInst;
    if (pageInst) {
        var arr = getData(pageInst);
        var newData = {
            props: instance.props,
            state: instance.state,
            context: instance.context,
            templatedata: inputProps.templatedata //template元素的
        };
        //注入
        newData.props.instanceCode = instanceCode;
        //无状态组件的更新
        if (instance.__isStateless) {
            var checkProps = fiber.memoizedProps;
            var usePush = true;
            for (var i = 0, el; (el = arr[i++]); ) {
                if (el.props === checkProps) {
                    extend(el, newData);
                    usePush = false;
                    break;
                }
            }
            if (usePush) {
                arr.push(newData);
            }
            return;
        }

        if (instance.updateWXData) {
            var checkProps = fiber.memoizedProps;
            for (var i = 0, el; (el = arr[i++]); ) {
                if (el.props === checkProps) {
                    extend(el, newData);
                    break;
                }
            }
            delete instance.updateWXData;
        } else {
            arr.push(newData);
        }
    }
}

export function onComponentDispose(fiber) {
    var instance = fiber.stateNode;
    var type = fiber.type;
    var instances = type.instances;
    if (!instances) {
        return;
    }
    var pageInst = instance.$pageInst;
    if (pageInst) {
        delete instances[instance.instanceCode];
        var props = fiber.props;
        var arr = getData(pageInst);
        for (var i = 0, el; (el = arr[i++]); ) {
            if (el.props === props) {
                arr.splice(i, 1);
                break;
            }
        }
    }
}

export function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    var componentProps = {}; //必须将is移除，防止在setData中被序列化
    for (var i in props) {
        if (i !== "is" && i != "templatedata") {
            componentProps[i] = props[i];
        }
    }
    if (!clazz.hackByMiniApp) {
        clazz.hackByMiniApp = true;
        clazz.instances = clazz.instances || {};
        var setState = clazz.prototype.setState;
        var forceUpdate = clazz.prototype.forceUpdate;
        //只对有状态组件的setState/forceUpate进行处理
        if (setState && !setState.fromPage) {
            var fn = (clazz.prototype.setState = function() {
                var pageInst = this.$pageInst;
                if (pageInst) {
                    pageInst.setState.apply(this, arguments);
                } else {
                    setState.apply(this, arguments);
                }
            });
            fn.fromPage = true;
            clazz.prototype.forceUpdate = function() {
                var pageInst = this.$pageInst;
                if (pageInst) {
                    pageInst.forceUpdate.apply(this, arguments);
                } else {
                    forceUpdate.apply(this, arguments);
                }
            };
        }
    }
    return createElement(clazz, componentProps);
}

function getData(instance) {
    return instance.allTemplateData || (instance.allTemplateData = []);
}

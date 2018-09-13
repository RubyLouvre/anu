import { extend } from 'react-core/util';
import { createElement } from 'react-core/createElement';
import { getUUID, classCached } from './utils';

export function onComponentUpdate(fiber) {
    var instance = fiber.stateNode;

    var type = fiber.type;
    var instances = type.instances;
    var instanceUid = instance.instanceUid;
    var parentInst = null;
    if (!instanceUid) {
        instanceUid = instance.instanceUid = getUUID();
        instances[instanceUid] = instance;
        var p = fiber.return;
        while (p) {
            if (p.name !== 'template' && p.tag < 4) {
                var stateNode = p.stateNode;
                if (!parentInst) {
                    parentInst = instance.$parentInst = stateNode;
                }
                if (p.props.isPageComponent) {
                    if (!stateNode.wxData) {
                        stateNode.wxData = {};
                    }
                    instance.$pageInst = stateNode;
                    break;
                }
                if (stateNode.$pageInst) {
                    instance.$pageInst = stateNode.$pageInst;
                    break;
                }
            }
            p = p.return;
        }
    }
    parentInst = instance.$parentInst;
    if (parentInst) {
        var inputProps = fiber._owner.props;
        var uuid = inputProps.templatedata;
        var data = instance.wxData || (instance.wxData = {});
        data.props = instance.props;
        data.state = instance.state;
        data.context = instance.context;
        data.templatedata = uuid;
        var arr = getData(parentInst, uuid);
        data.props.instanceUid = instanceUid;
        var checkProps = fiber.memoizedProps;
        if (instance.__isStateless) {
            var usePush = true;
            for (var i = 0, el; (el = arr[i++]); ) {
                if (el.props === checkProps) {
                    extend(el, data);
                    usePush = false;
                    break;
                }
            }
            if (usePush) {
                arr.push(data);
            }
            return;
        }
        //   if (instance.updateWXData) {
        if (fiber._hydrating){
            for (var i = 0, el; (el = arr[i++]); ) {
                if (el.props === checkProps) {
                    extend(el, data);
                    break;
                }
            }
            // delete instance.updateWXData;
        } else {
            arr.push(data);
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
    var parentInst = instance.$parentInst;
    if (parentInst) {
        delete instances[instance.instanceUid];
        var props = fiber.props;
        var inputProps = fiber._owner.props;
        var uuid = inputProps.templatedata;
        var arr = getData(parentInst, uuid);
        for (var i = 0, el; (el = arr[i++]); ) {
            if (el.props === props) {
                arr.splice(i, 1);
                break;
            }
        }
    }
}
var ignoreObject = {
    is: 1,
    templatedata: 1,
    classUid: 1,
    instanceUid: 1
};

export function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    var componentProps = {}; //必须将is移除，防止在setData中被序列化
    for (var i in props) {
        if (ignoreObject[i] !== 1) {
            componentProps[i] = props[i];
        }
    }
    if (props.fragmentUid && props.classUid){
        var parentClass = classCached[props.classUid];
        if (parentClass && parentClass.instances){
            var parentInstance =  parentClass.instances[props.instanceUid];
            componentProps.fragmentData = {
                state: parentInstance.state,
                props: parentInstance.props,
                context: parentInstance.context
            };
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

function getData(instance, uuid) {
    return instance.wxData[uuid] || (instance.wxData[uuid] = []);
}


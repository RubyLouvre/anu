import { createElement } from 'react-core/createElement';
import { getUUID, newData, classCached } from './utils';
const ignoreObject = {
    is: 1,
    $$loop: 1,
    $$index: 1,
    classUid: 1,
    instanceUid: 1
};
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
                        stateNode.wxData = newData();
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
        var uuid = inputProps.$$loop;
        var index = inputProps.$$index;
        if (index != null){
            uuid += index;
        }
        var data = instance.wxData || (instance.wxData = newData());
        data.props = instance.props;
        data.props.instanceUid = instance.instanceUid;
        data.state = instance.state;
        data.context = instance.context;
        getData(parentInst)[uuid] = [data];
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
        var inputProps = fiber._owner.props;
        var uuid = inputProps.$$loop;
        var index = inputProps.$$index;
        if (index != null){
            uuid += index;
        }
        delete getData(parentInst)[uuid];
    }
}


export function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    var componentProps = {}; //必须将is移除，防止在setData中被序列化
    for (var i in props) {
        if (ignoreObject[i] !== 1) {
            componentProps[i] = props[i];
        }
    }
    if (props.fragmentUid && props.classUid) {
        var parentClass = classCached[props.classUid];
        if (parentClass && parentClass.instances) {
            var parentInstance = parentClass.instances[props.instanceUid];
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

function getData(instance) {
    return instance.wxData.components; 
}

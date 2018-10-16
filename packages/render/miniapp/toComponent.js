import { createElement } from 'react-core/createElement';
import { getUUID, newData, classCached, currentPage } from './utils';
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
    
    instance.$pageInst = currentPage.value;
    var parentInst = null;
   
    var setState = type.prototype.setState;
    if (setState && !setState.fromPage) {
        var forceUpdate = type.prototype.forceUpdate;
        var fn = type.prototype.setState = function () {
            var pageInst = this.$pageInst;
            if (pageInst) {
                pageInst.setState.apply(this, arguments);
            } else {
                setState.apply(this, arguments);
            }
        };
        fn.fromPage = true;
        type.prototype.forceUpdate = function () {
            var pageInst = this.$pageInst;
            if (pageInst) {
                pageInst.forceUpdate.apply(this, arguments);
            } else {
                forceUpdate.apply(this, arguments);
            }
        };
    }
    if (!instance.$parentInst){
        var p = fiber.return;
        while (p) {
            if (p.name !== 'toComponent' && p.tag < 4) {
                var stateNode = p.stateNode;
                if (!parentInst) {
                    parentInst = instance.$parentInst = stateNode;
                    if (!parentInst.wxData) {
                        parentInst.wxData = newData();
                    }
                    break;
                }
            }
            p = p.return;
        }
    }

    parentInst = instance.$parentInst;
    if (parentInst) {
        var inputProps = Object(fiber._owner).props || {};
        var uuid = inputProps.$$loop,
            data;
        var index = inputProps.$$index;
        if (index != null) {
            uuid += index;
        }
        if (!uuid) {
            data = instance.wxData = currentPage.value.wxData;
        } else {
            data = instance.wxData || (instance.wxData = newData());
        }
        data.props = instance.props;
        data.props.instanceUid = instance.instanceUid;
        data.state = instance.state;
        data.context = instance.context;
        if (uuid) {
            getData(parentInst)[uuid] = [data];
        }
    }
}

export function onComponentDispose(fiber) {
    var instance = fiber.stateNode;
    var type = fiber.type;
    var parentInst = instance.$parentInst;
    if (parentInst) {
        delete type[instance.instanceUid];
        var inputProps = fiber._owner.props;
        var uuid = inputProps.$$loop;
        var index = inputProps.$$index;
        if (index != null) {
            uuid += index;
        }
        delete getData(parentInst)[uuid];
    }
}

export function toComponent(props) {
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
        if (parentClass) {
            var parentInstance = parentClass[props.instanceUid];
            componentProps.fragmentData = {
                state: parentInstance.state,
                props: parentInstance.props,
                context: parentInstance.context
            };
        }
    }
    componentProps.wxComponentFlag = true;
    return createElement(clazz, componentProps);
}

function getData(instance) {
    return instance.wxData.components;
}

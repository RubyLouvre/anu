import { noop, isFn, extend, get } from "react-core/util";
import { createElement } from "react-core/createElement";

export function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    var componentProps = {};//必须将is移除，防止在setData中被序列化
    for(var i in props){
        if(i !== "is" && i != "templatedata"){
            componentProps[i] = props[i]
        }
    }
    if (!clazz.hackByMiniApp) {
        clazz.hackByMiniApp = true;
        clazz.instances = clazz.instances || [];
        //如果是有狀态组件
        var proto = clazz.prototype;
        if (proto && proto.isReactComponent) {
            hijackStatefulHooks(proto, "componentWillMount");
            hijackStatefulHooks(proto, "componentWillUpdate");
            var oldUnmount = proto.componentWillUnmount;
            proto.componentWillUnmount = function() {
                oldUnmount && oldUnmount.call(this);
                var pageComponent = this.$pageComponent;
                if (pageComponent) {
                    var instances = get(this).type.instances;
                    var i = instances.indexOf(this);
                    if (i !== -1) {
                        instances.push(i, 1);
                    }
                    var props = this.props;
                    var arr = getData(pageComponent);
                    for (var i = 0, el; (el = arr[i++]); ) {
                        if (el.props === props) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
            };
        }
        var setState = clazz.prototype.setState;
        var forceUpdate = clazz.prototype.forceUpdate;
        clazz.prototype.setState = function() {
            var pageInst = this.$pageComponent;
            if (pageInst) {
                pageInst.setState.apply(this, arguments);
            } else {
                setState.apply(this, arguments);
            }
        };
        clazz.prototype.forceUpdate = function() {
            var pageInst = this.$pageComponent;
            if (pageInst) {
                pageInst.forceUpdate.apply(this, arguments);
            } else {
                forceUpdate.apply(this, arguments);
            }
        };
    }

    return createElement(clazz, componentProps);
}

function getData(instance) {
    return instance.allTemplateData || (instance.allTemplateData = []);
}

function hijackStatefulHooks(proto, method) {
    var oldHook = proto[method] || noop;
    proto[method] = function() {
        var fiber = this._reactInternalFiber;
        if (!this.instanceCode) {
            this.instanceCode = Math.random();
            var instances = this.constructor.instances;
            if (instances.indexOf(this) === -1) {
                instances.push(this);
            }
            var p = fiber.return;
            while (p) {
                var inst = p._owner;
                if (inst && inst.props && inst.props.isPageComponent) {
                    this.$pageComponent = inst;
                    break;
                }
            }
        }
        var inputProps = fiber._owner.props;
        var f = fiber.return;
        var pageComponent = null;
        while (f) {
            var exited = f._owner && f._owner.$pageComponent;
            if (exited) {
                pageComponent = exited;
                break;
            } else if (f.props && f.props.isPageComponent) {
                pageComponent = f.stateNode;
                break;
            }
            f = f.return;
        }
        if (pageComponent) {
            var arr = getData(pageComponent),
                props = this.props;
            var isUpdate = method === "componentWillUpdate";
            var newData = {
                props: isUpdate ? arguments[0] : props,
                state: isUpdate ? arguments[1] : this.state,
                templatedata: inputProps.templatedata //template元素的
            };
            //注入
            newData.props.instanceCode = this.instanceCode;
            if (this.updateWXData) {
                for (var i = 0, el; (el = arr[i++]); ) {
                    if (el.props === props) {
                        extend(el, newData);
                        break;
                    }
                }
                delete this.updateWXData;
            } else {
                arr.push(newData);
            }
            oldHook.call(this, arguments);
        }
    };
}

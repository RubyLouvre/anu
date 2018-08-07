import { noop, isFn } from "react-core/util";
import { createElement } from "react-core/createElement";

export function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    if (!clazz.hackByMiniApp) {
        clazz.hackByMiniApp = true;
        clazz.instances = clazz.instances || [];
        //如果是有狀态组件
        var proto = clazz.prototype;
        if (proto && proto.isReactComponent) {
            hijackStatefulHooks(proto, "componentWillMount");
            hijackStatefulHooks(proto, "componentWillUpdate");
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

    //...再上面一样
    return createElement(clazz, props);
}

function getData(instance) {
    return instance.allTemplateData || (instance.allTemplateData = []);
}
//var oldsetState =  instance.setState;

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
        this.props.instanceCode = this.instanceCode;
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
            var arr = getData(pageComponent);
            var isUpdate = method === "componentWillUpdate";
            arr.push({
                props: isUpdate ? arguments[0] : this.props,
                state: isUpdate ? arguments[1] : this.state,
                templatedata: inputProps.templatedata //template元素的
            });
            oldHook.call(this, arguments);
        }
    };
}

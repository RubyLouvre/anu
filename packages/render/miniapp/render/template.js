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
    }
    var setState = clazz.prototype.setState;
    console.log(!!setState, "*****");

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
        console.log(this);
        var inputProps = fiber._owner.props;
        this.props.instanceCode = this.instanceCode;

        var p = fiber.return;
        do {
            if (p && isFn(p.type) && p.type !== template) {
                break;
            }
        } while ((p = p.return));
        var parentInstance = p && p.stateNode;

        if (parentInstance) {
            var arr = getData(parentInstance);
            var isUpdate = method === "componentWillUpdate";
            arr.push({
                props: isUpdate ? arguments[0] : this.props,
                state: isUpdate ? arguments[1] : this.state,
                templatedata: inputProps.templatedata
            });
            oldHook.call(this, arguments);
        }
    };
}

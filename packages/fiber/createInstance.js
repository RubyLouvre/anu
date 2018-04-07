import { returnFalse, returnTrue } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { pushError } from "./unwindWork";

export function createInstance (fiber, context) {
    let updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        _isMounted: returnFalse
    };
    let { props, type, tag } = fiber,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = fiber.stateNode = {};
    try {
        if (isStateless) {
            instance = {
                refs: {},
                __proto__: type.prototype,
                props,
                context,
                __init: true,
                renderImpl: type,
                render: function f () {
                    let a = this.__keep;
                    if (a) {
                        delete this.__keep;
                        return a;
                    }
                    a = this.renderImpl(this.props, this.context);
                    if (a && a.render) {
                        // 返回一带render方法的纯对象，说明这是带lifycycle hook的无狀态组件
                        // 需要对象里的hook复制到instance中
                        for (let i in a) {
                            instance[i == "render" ? "renderImpl" : i] = a[i];
                        }
                    } else if (this.__init) {
                        this.__isStateless = returnTrue;
                        this.__keep = a;
                    }
                    return a;
                }
            };

            Renderer.currentOwner = instance;
            if (type.isRef) {
                instance.render = function () {
                    return type(this.props, this.ref);
                };
            } else {
                instance.render();
                delete instance.__init;
            }
        } else {
            // 有狀态组件
            instance = new type(props, context);
        }
    } catch (e) {
         pushError(fiber, 'constructor', e)
    } finally {
        Renderer.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.props = props;
    instance.updater = updater;
    return instance;
}

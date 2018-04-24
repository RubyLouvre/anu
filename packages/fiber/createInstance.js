import { returnFalse, returnTrue } from "react-core/util";
import { Component } from "react-core/Component";

import { Renderer } from "react-core/createRenderer";
//import { pushError } from "./ErrorBoundary";

export function createInstance(fiber, context) {
    let updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        isMounted: returnFalse,
    };
    let { props, type, tag, ref } = fiber,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = (fiber.stateNode = {});
    fiber.errorHook = "constructor";
    try {
        if (isStateless) {
            instance = {
                refs: {},
                props,
                context,
                ref,
                __proto__: type.prototype,
                __isStateless: returnTrue,
                __init: true,
                renderImpl: type,
                render: function f() {
                    let a = this.__keep;
                    if (a) {
                        delete this.__keep;
                        return a.value;
                    }
                    a = this.renderImpl(this.props, this.context);
                    if (a && a.render) {
                        delete this.__isStateless;
                        // 返回一带render方法的纯对象，说明这是带lifycycle hook的无狀态组件
                        // 需要对象里的hook复制到instance中
                        for (let i in a) {
                            instance[i == "render" ? "renderImpl" : i] = a[i];
                        }
                    } else if (this.__init) {
                        this.__keep = {
                            //可能返回一个对象
                            value: a,
                        };
                    }
                    return a;
                },
            };

            Renderer.currentOwner = instance;
            if (type.render) {
                //forwardRef函数形式只会执行一次，对象形式执行多次
                instance.render = function() {
                    return type.render(this.props, this.ref);
                };
            } else {
                instance.render();
                delete instance.__init;
            }
        } else {
            // 有狀态组件
            instance = new type(props, context);
            if (!(instance instanceof Component)) {
                throw `${type.name} doesn't extend React.Component`;
            }
        }
    // }catch (e) {
    //   pushError(fiber, "constructor", e);
    } finally {
        Renderer.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.props = props;
    instance.updater = updater;
    return instance;
}

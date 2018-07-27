import { returnFalse, isMounted, extend, gDSFP, gSBU } from "react-core/util";
import { Component } from "react-core/Component";
import { Renderer } from "react-core/createRenderer";

export function UpdateQueue() {
    return {
        pendingStates: [],
        pendingCbs: []
    };
}
export function createInstance(fiber, context) {
    let updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        isMounted: isMounted
    };
    let { props, type, tag, ref } = fiber,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = {
            refs: {},
            props,
            context,
            ref,
            __proto__: type.prototype
        };
    fiber.errorHook = "constructor";
    try {
        if (isStateless) {
            extend(instance, {
                __isStateless: true,
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
                            value: a
                        };
                    }
                    return a;
                }
            });
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
    } finally {
        Renderer.currentOwner = lastOwn;
        fiber.stateNode = instance;
        fiber.updateQueue = UpdateQueue();
        instance._reactInternalFiber = fiber;
        instance.updater = updater;
        instance.context = context;
        updater.enqueueSetState = Renderer.updateComponent;
        if (type[gDSFP] || instance[gSBU]) {
            instance.__useNewHooks = true;
        }
    }

    return instance;
}

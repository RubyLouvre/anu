import { returnFalse, isMounted, extend, gDSFP, gSBU } from 'react-core/util';
import { Component } from 'react-core/Component';
import { Renderer } from 'react-core/createRenderer';

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
    let { props, type, tag, ref, key } = fiber,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = {
            refs: {},
            props,
            key,
            context,
            ref,
            _reactInternalFiber: fiber,
            __proto__: type.prototype
        };
    fiber.updateQueue = UpdateQueue();
    fiber.errorHook = 'constructor';
    try {
        if (isStateless) {
            Renderer.currentOwner = instance;
            extend(instance, {
                __isStateless: true,
                renderImpl: type,
                render: function f1() {
                    return this.renderImpl(this.props, this.context);
                }
            });
            Renderer.currentOwner = instance;
        } else {
            // 有狀态组件
            instance = new type(props, context);
            if (!(instance instanceof Component)) {
                //这一行处理快应用instanceof BUG， 应该是与跨域iframe中 [] instance Array的行为相似
                if(!instance.updater || !instance.updater.enqueueSetState){
                  throw `${type.name} doesn't extend React.Component`;
                }
            }
        }
    } finally {
        Renderer.currentOwner = lastOwn;
        fiber.stateNode = instance;
        // fiber.updateQueue = UpdateQueue();
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

import { noop } from "./util";

import { CurrentOwner } from "./createElement";
function alwaysNull() {
    return null;
}
export function instantiateComponent(type, vtype, props, context) {
    var instance;
    if (vtype === 2) {
        instance = new type(props, context);
        //防止用户没有调用super或没有传够参数
        instance.props = instance.props || props;
        instance.context = instance.context || context;
    } else {
        instance = {
            refs: {},
            render: function() {
                return type(this.props, this.context);
            },
            __isStateless: 1,
            state: null,
            props: props,
            context: context,
            __pendingCallbacks: [],
            __current: noop,
            __mergeStates: alwaysNull
        };
        let lastOwn = CurrentOwner.cur;
        CurrentOwner.cur = instance;
        try {
            var mixin = type(props, context);
        } finally {
            CurrentOwner.cur = lastOwn;
        }
        if (mixin && mixin.render) {
            //支持module pattern component
            delete instance.__isStateless;
            Object.assign(instance, mixin);
        } else {
            instance.__rendered = mixin;
        }
    }

    return instance;
}

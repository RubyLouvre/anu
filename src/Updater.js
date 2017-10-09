var mountOrder = 1;
import { getChildContext, noop } from "../src/util";
import { Refs } from "./Refs";
function alwaysNull() {
    return null;
}
export var updateChains = {};
export function Updater(instance, vnode) {
    vnode._instance = instance;
    instance.updater = this;
    this._mountOrder = mountOrder++;
    this._mountIndex = this._mountOrder;
    this._instance = instance;
    this._pendingCallbacks = [];
    this._ref = noop;
    this._didHook = noop;
    this._pendingStates = [];
    this._lifeStage = 0; //判断生命周期
    //update总是保存最新的数据，如state, props, context, parentContext, vparent
    this.vnode = vnode;
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    mergeStates() {
        let instance = this._instance,
            pendings = this._pendingStates,
            state = instance.state,
            n = pendings.length;
        if (n === 0) {
            return state;
        }
        let nextState = Object.assign({}, state); //每次都返回新的state
        for (let i = 0; i < n; i++) {
            let pending = pendings[i];
            if (pending && pending.call) {
                pending = pending.call(instance, nextState, this.props);
            }
            Object.assign(nextState, pending);
        }
        pendings.length = 0;
        return nextState;
    },

    renderComponent(cb, rendered) {
        let { vnode, parentContext, _instance: instance } = this;
        //调整全局的 CurrentOwner.cur
        if (!rendered) {
            let lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            try {
                if (this.willReceive === false) {
                    rendered = this.rendered;
                    delete this.willReceive;
                } else {
                    rendered = instance.render();
                }
            } finally {
                Refs.currentOwner = lastOwn;
            }
        }

        //组件只能返回组件或null
        if (rendered === null || rendered === false) {
            rendered = { type: "#comment", text: "empty", vtype: 0 };
        } else if (!rendered || !rendered.type) {
            //true, undefined, array, {}
            throw new Error(`@${vnode.type.name}#render:You may have returned undefined, an array or some other invalid object`);
        }
        this.lastRendered = this.rendered;
        this.rendered = rendered;
        let childContext = rendered.vtype ? getChildContext(instance, parentContext) : parentContext;
        let dom = cb(rendered, this.vparent, childContext);
        if (!dom) {
            throw ["必须返回节点", rendered];
        }
        let list = updateChains[this._mountOrder];
        if (!list) {
            list = updateChains[this._mountOrder] = [this];
        }
        list.forEach(function(el) {
            el.vnode._hostNode = el._hostNode = dom;
        });
        return dom;
    }
};

export function instantiateComponent(type, vnode, props, context) {
    let isStateless = vnode.vtype === 4;
    let instance = isStateless
        ? {
            refs: {},
            render: function() {
                return type(this.props, this.context);
            }
        }
        : new type(props, context);
    let updater = new Updater(instance, vnode, props, context);
    //props, context是不可变的
    instance.props = updater.props = props;
    instance.context = updater.context = context;
    instance.constructor = type;
    updater.displayName = type.displayName || type.name;

    if (isStateless) {
        let lastOwn = Refs.currentOwner;
        Refs.currentOwner = instance;
        try {
            var mixin = instance.render();
        } finally {
            Refs.currentOwner = lastOwn;
        }
        if (mixin && mixin.render) {
            //支持module pattern component
            Object.assign(instance, mixin);
        } else {
            instance.__isStateless = true;
            updater.rendered = mixin;
        }
    }

    return instance;
}

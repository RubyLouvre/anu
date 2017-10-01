var mountOrder = 1;
import { getChildContext } from "../src/util";
import { CurrentOwner } from "./createElement";
function alwaysNull() {
    return null;
}
function Updater(instance, vnode, props, context) {
    //防止用户在构造器生成JSX
    vnode._instance = instance;
    instance.updater = this;
    this._mountOrder = mountOrder++;
    this._instance = instance;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._lifeStage = 0; //判断生命周期
    //update总是保存最新的数据，如state, props, context, parentContext, vparent
    this.nextVnode = vnode;
    this.props =  props;
    this.context = context;
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if(instance.__isStateless){
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    mergeStates: function(){
        let instance = this._instance,
            pendings = this._pendingStates,
            state = instance.state,
            n = pendings.length;
        if (n === 0) {
            return state;
        }
        let nextState = Object.assign({}, state);//每次都返回新的state
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
  
    
    renderComponent: function( cb, rendered, parentInstance) {
        let vnode = this.nextVnode;
        let instance = this._instance;
        let parentContext = this.parentContext;
        //调整全局的 CurrentOwner.cur
        if (!rendered) {
            try {
                var lastOwn = CurrentOwner.cur;
                CurrentOwner.cur = instance;
                rendered = instance.render();
            } finally {
                CurrentOwner.cur = lastOwn;
            }
        }
    
        //组件只能返回组件或null
        if (rendered === null || rendered === false) {
            rendered = { type: "#comment", text: "empty", vtype: 0 };
        } else if (!rendered || !rendered.vtype) {
        //true, undefined, array, {}
            throw new Error(
                `@${vnode.type
                    .name}#render:You may have returned undefined, an array or some other invalid object`
            );
        }
        this.lastRendered = this.rendered;
        this.rendered = rendered;
        let childContext = rendered.vtype
            ? getChildContext(instance, parentContext)
            : parentContext;
        let dom = cb(rendered, this.vparent, childContext);
        if(parentInstance){
            this._parentInstance = parentInstance;
        }
       
        updateInstanceChain(this, dom);
    
        return dom;
    }
};


function updateInstanceChain(updater, dom) {
    updater.nextVnode._hostNode =  updater._hostNode = dom;//同步到生成组件的那个虚拟DOM中
    var parent = updater._parentInstance;
    if (parent) {
        updateInstanceChain(parent.updater, dom);
    }
}

export function instantiateComponent(type, vnode, props, context) {
    var instance;
    if (vnode.vtype === 2) {
        instance = new type(props, context);
        //props, context是不可变的
        instance.props = props;
        instance.context = context;
        new Updater(instance, vnode, props, context);
    } else {
        instance = {
            refs: {},
            render: function() {
                return type(this.props, this.context);
            },
            __isStateless: 1,
            props: props,
            context: context
        };
        var updater = new Updater(instance, vnode, props, context);
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
            updater.rendered = mixin;
        }
    }

    return instance;
}

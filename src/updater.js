import { REACT_ELEMENT_TYPE, noop, extend, options, isFn, emptyArray } from "../src/util";
import { enqueueUpdater, enqueueQueue, spwanChildQueue, captureError } from "./scheduler";
import { Refs } from "./Refs";

function alwaysNull() {
    return null;
}
let mountOrder = 1;

/**
 * 为了防止污染用户的实例，需要将操作组件虚拟DOM与生命周期钩子的逻辑全部抽象到这个类中
 * 
 * @export
 * @param {any} instance 
 * @param {any} vnode 
 */
export function Updater(instance, vnode) {
    vnode._instance = instance;
    instance.updater = this;
    this._mountOrder = mountOrder++;
    this._instance = instance;
    this._pendingCallbacks = [];
    this._didHook = noop;
    this._pendingStates = [];
    this._hookName = "componentDidMount";
    //update总是保存最新的数据，如state, props, context, parentContext, parentVnode
    this.vnode = vnode;
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    enqueueSetState(state, cb) {
        if (isFn(cb)) {
            this._pendingCallbacks.push(cb);
        }
        if (state === true) {
            //forceUpdate
            this._forceUpdate = true;
        } else {
            //setState
            this._pendingStates.push(state);
        }
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            enqueueUpdater(this);
            return;
        }

        if (this._hookName === "componentDidMount") {
            //组件挂载期
            //componentWillUpdate中的setState/forceUpdate应该被忽略
            if (this._hydrating) {
                //在render方法中调用setState也会被延迟到下一周期更新.这存在两种情况，
                //1. 组件直接调用自己的setState
                //2. 子组件调用父组件的setState，
                this._renderInNextCycle = true;
            }
        } else {
            //组件更新期
            if (this._receiving) {
                //componentWillReceiveProps中的setState/forceUpdate应该被忽略
                return;
            }
            if (this._hydrating) {
                //在componentDidMount方法里面可能执行多次setState方法，来引发update，但我们只需要一次update
                this._renderInNextCycle = true;
                // 在componentDidMount里调用自己的setState，延迟到下一周期更新
                // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
                return;
            }
            var u = this;
            spwanChildQueue(function(queue) {
                queue.push({
                    host: u,
                    exec: u.onUpdate
                });
            });
        }
    },
    mergeStates() {
        let instance = this._instance,
            pendings = this._pendingStates,
            state = instance.state,
            n = pendings.length;
        if (n === 0) {
            return state;
        }
        let nextState = extend({}, state); //每次都返回新的state
        for (let i = 0; i < n; i++) {
            let pending = pendings[i];
            if (pending && pending.call) {
                pending = pending.call(instance, nextState, this.props);
            }
            extend(nextState, pending);
        }
        pendings.length = 0;
        return nextState;
    },

    onUpdate() {
        let { _instance: instance, _hostNode: dom, context, props, vnode } = this;
        if(this.inReceiveStage){
            let [lastVnode,nextVnode, nextContext] = this.inReceiveStage;
            delete this.inReceiveStage;
            nextVnode._hostNode = dom;
            nextVnode._instance = instance;
            //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
            //但还会继续向下比较
            this._receiving = true;
            captureError(instance, "componentWillReceiveProps",[this.props, nextContext]);
            this._receiving = false;
            Refs.detachRef(lastVnode, nextVnode);
        }


        let state = this.mergeStates();
        let shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate",[props, state, context])
        ) {
            shouldUpdate = false;
            if (this.nextVnode) {
                this.vnode = this.nextVnode;
                delete this.nextVnode;
            }
        } else {
            var { props: lastProps, context: lastContext, state: lastState } = instance;
            captureError(instance, "componentWillUpdate",[props, state, context]);
        }
        vnode._instance = instance;
        this._forceUpdate = false;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        let updater = this;
        enqueueQueue({
            host: this,
            exec: this.onEnd
        });
        if (shouldUpdate) {
            this._hydrating = true;
            let lastRendered = this.rendered;
            spwanChildQueue(function() {
                dom = updater.renderComponent(function(nextRendered, parentVnode, childContext) {
                    return options.alignVnode(lastRendered, nextRendered, parentVnode, childContext, updater);
                });
                updater.oldDatas = [lastProps, lastState, lastContext];
                updater._hookName = "componentDidUpdate";
            });
        }
 
        return dom;
    },

    onEnd: function() {
        Refs.clearElementRefs();
        let instance = this._instance;
        let vnode = this.vnode;
        //执行componentDidMount/Update钩子
        captureError(instance, this._hookName, this.oldDatas);
        if (this._dirty) {
            delete this._dirty;
        }

        this.oldDatas = emptyArray;
        //执行React Chrome DevTools的钩子
        if (this._hookName === "componentDidMount") {
            options.afterMount(instance);
        } else {
            options.afterUpdate(instance);
        }
        delete this._hookName;
        this._hydrating = false;
        //执行组件虚拟DOM的ref回调
        if (vnode._hasRef) {
            Refs.fireRef(vnode, instance.__isStateless ? null : instance);
        }
        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        if (this._renderInNextCycle) {
            delete this._renderInNextCycle;
            enqueueQueue({
                host: this,
                exec: this.onUpdate
            });
        }
    },
    renderComponent(cb) {
        let { vnode, parentContext, _instance: instance } = this;
        //调整全局的 CurrentOwner.cur
       
        let rendered;
       
        if (this.willReceive === false) {
            rendered = this.rendered;
            delete this.willReceive;
        } else {
            var lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render",[]);
            Refs.currentOwner = lastOwn;
        }
       
        

        //组件只能返回组件或null
        if (rendered === null || rendered === false) {
            rendered = { type: "#comment", text: "empty", vtype: 0, $$typeof: REACT_ELEMENT_TYPE };
        } else if (!rendered || !rendered.type) {
            //true, undefined, array, {}
            throw new Error(`@${vnode.type.name}#render:You may have returned undefined, an array or some other invalid object`);
        }

        let childContext = rendered.vtype ? getChildContext(instance, parentContext) : parentContext;
        let dom = cb(rendered, this.parentVnode, childContext);
        if (rendered._hostNode) {
            this.rendered = rendered;
        }
        let u = this;
        do {
            if (u.nextVnode) {
                u.vnode = u.nextVnode;
                delete u.nextVnode;
            }
            u.vnode._hostNode = u._hostNode = dom;
        } while ((u = u.parentUpdater));

        return dom;
    }
};

export function getChildContext(instance, parentContext) {
    if (instance.getChildContext) {
        let context = instance.getChildContext();
        if (context) {
            parentContext = Object.assign({}, parentContext, context);
        }
    }
    return parentContext;
}

export function getContextByTypes(curContext, contextTypes) {
    let context = {};
    if (!contextTypes || !curContext) {
        return context;
    }
    for (let key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = curContext[key];
        }
    }
    return context;
}



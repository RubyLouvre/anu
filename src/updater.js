import { fiberizeChildren, restoreChildren, createVText } from "./createElement";
import { extend, options, typeNumber, isFn, returnFalse, returnTrue } from "../src/util";
import { drainQueue, enqueueUpdater } from "./scheduler";
import { pushError, captureError } from "./error";
import { Refs } from "./Refs";

function alwaysNull() {
    return null;
}
let mountOrder = 1;
const support16 = true;
const errorType = {
    0: "undefined",
    2: "boolean",
    3: "number",
    4: "string",
    7: "array"
};
/**
 * 为了防止污染用户的实例，需要将操作组件虚拟DOM与生命周期钩子的逻辑全部抽象到这个类中
 * 
 * @export
 * @param {any} instance 
 * @param {any} vnode 
 */
export function Updater(instance, vnode) {
    vnode.stateNode = instance;
    instance.updater = this;
    this.instance = instance;
    this.vnode = vnode;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._jobs = ["resolve"];
    this._mountOrder = mountOrder++;
    // update总是保存最新的数据，如state, props, context, parentContext, parentVnode
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    addJob: function(newJob) {
        var jobs = this._jobs;
        if (jobs[jobs.length - 1] !== newJob) {
            jobs.push(newJob);
        }
    },
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

        if (this.isMounted === returnFalse) {
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
            this.addJob("patch");
            drainQueue([this]);
        }
    },
    mergeStates() {
        let instance = this.instance,
            pendings = this._pendingStates,
            n = pendings.length,
            state = instance.state;
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

    exec(updateQueue) {
        var job = this._jobs.shift();
        if (job) {
            this[job](updateQueue);
        }
    },
    isMounted: returnFalse,
    patch(updateQueue) {
        let { instance, context, props, vnode } = this;
        if (this._receiving) {
            let [lastVnode, nextVnode, nextContext] = this._receiving;
            nextVnode.stateNode = instance;
            //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
            //但还会继续向下比较
            captureError(instance, "componentWillReceiveProps", [this.props, nextContext]);
            delete this._receiving;
            Refs.detachRef(lastVnode, nextVnode);
        }

        Refs.clearElementRefs();
        let state = this.mergeStates();
        let shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;
            if (this.pendingVnode) {
                this.vnode = this.pendingVnode;
                delete this.pendingVnode;
            }
        } else {
            var { props: lastProps, context: lastContext, state: lastState } = instance;
            captureError(instance, "componentWillUpdate", [props, state, context]);
        }
        vnode.stateNode = instance;
        delete this._forceUpdate;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        this.addJob("resolve");
        if (shouldUpdate) {
            this._hydrating = true;
            this._hookArgs = [lastProps, lastState, lastContext];
            this.render(updateQueue);
        }
        updateQueue.push(this);
    },

    resolve: function(updateQueue) {
        Refs.clearElementRefs();
        let instance = this.instance;
        let vnode = this.vnode;

        // 执行componentDidMount/Update钩子
        var hasMounted = this.isMounted();
        var hookName = hasMounted ?  "componentDidUpdate": "componentDidMount";
        if (!hasMounted) {
            this.isMounted = returnTrue;
        }
        captureError(instance, hookName, this._hookArgs || []);
        delete this._hookArgs;
        //执行React Chrome DevTools的钩子
        if (hasMounted) {
            options.afterUpdate(instance);
        } else {
            options.afterMount(instance);
        }

        this._hydrating = false;
        //执行组件虚拟DOM的ref回调
        if (vnode._hasRef) {
            Refs.fireRef(vnode, instance.__isStateless ? null : instance);
        }
        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        if (this._renderInNextCycle) {
            delete this._renderInNextCycle;
            this.addJob("patch");
            updateQueue.push(this);
        }
    },
    render(updateQueue) {
        //vnode为组件虚拟DOM，也只能是组件虚拟DOM
        let { vnode, pendingVnode, instance, parentContext } = this,
            nextChildren,
            rendered,
            lastChildren;
        let target = pendingVnode || vnode;
        if (this.willReceive === false) {
            rendered = vnode.child;
            delete this.willReceive;
        } else {
            let lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render", []);
            Refs.currentOwner = lastOwn;
        }
        if (this.isMounted()) {
            lastChildren = restoreChildren(this.vnode);
        } else {
            lastChildren = [];
        }

        var oldProps = target.props;
        target.props = { children: rendered };
        nextChildren = fiberizeChildren(target);
        target.props = oldProps;
        if (!nextChildren.length) {
            var placeHolder = createVText("#comment", "empty");
            placeHolder.index = 0;
            placeHolder.return = target;
            nextChildren.push(placeHolder);
        }

        let childContext = parentContext,
            number = typeNumber(rendered);
        if (number === 7) {
            if (!support16) {
                pushError(instance, "render", new Error("React15 fail to render array"));
            }
        } else {
            if (number < 5) {
                var noSupport = !support16 && errorType[number];
                if (noSupport) {
                    pushError(instance, "render", new Error("React15 fail to render " + noSupport));
                }
            } else {
                childContext = getChildContext(instance, parentContext);
            }
        }
        //child在React16总是表示它是父节点的第一个节点
        var child = nextChildren[0];
       
        options.diffChildren(lastChildren, nextChildren, target, childContext, updateQueue);
        //  console.log("child",child,lastChildren, nextChildren);
        vnode.child = child;
        // this.rendered = child; //现在还用于devtools中
        let u = this;
        do {
            if (u.pendingVnode) {
                u.vnode = u.pendingVnode;
                delete u.pendingVnode;
            }
        } while ((u = u.parentUpdater));
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

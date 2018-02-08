import { extend, options, typeNumber, emptyObject, isFn, 
    returnFalse, returnTrue, clearArray
} from "../src/util";
import { fiberizeChildren } from "./createElement";
import { drainQueue, enqueueUpdater } from "./scheduler";
import { pushError, captureError } from "./ErrorBoundary";
import { insertElement, document } from "./browser";
import { Refs } from "./Refs";

function alwaysNull() {
    return null;
}
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
export function componentFiber(vnode, parentContext) {
    var { type, props } = vnode;
    if (!type) {
        throw vnode;
    }
    this.name = type.displayName || type.name;
    this.props = props;
    this._reactInternalFiber = vnode;
    this.context = getContextByTypes(parentContext, type.contextTypes);
    this.parentContext = parentContext;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._states = ["resolve"];
    this._mountOrder = Refs.mountOrder++;
    if(vnode.superReturn){
        this.isPortal = true;
    }
    // update总是保存最新的数据，如state, props, context, parentContext, parentVnode
    //  this._hydrating = true 表示组件会调用render方法及componentDidMount/Update钩子
    //  this._nextCallbacks = [] 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
}

componentFiber.prototype = {
    addState: function(state) {
        var states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition(updateQueue) {
        var state = this._states.shift();
        if (state) {
            this[state](updateQueue);
        }
    },
    enqueueSetState(state, cb) {
        if (state === true) {
            //forceUpdate
            this._forceUpdate = true;
        } else {
            //setState
            this._pendingStates.push(state);
        }
        if (this._hydrating) {
            //组件在更新过程（_hydrating = true），其setState/forceUpdate被调用
            //那么会延期到下一个渲染过程调用
            if (!this._nextCallbacks) {
                this._nextCallbacks = [cb];
            } else {
                this._nextCallbacks.push(cb);
            }
            return;
        } else {
            if (isFn(cb)) {
                this._pendingCallbacks.push(cb);
            }
        }
        if (document.__async) {
            //在事件句柄中执行setState会进行合并
            enqueueUpdater(this);
            return;
        }
        if (this.isMounted === returnTrue) {
            if (this._receiving) {
                //componentWillReceiveProps中的setState/forceUpdate应该被忽略
                return;
            }
            this.addState("hydrate");
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

    isMounted: returnFalse,
    init(updateQueue, insertCarrier) {
        let { props, context, _reactInternalFiber:vnode } = this;
        let type = vnode.type,
            isStateless = vnode.vtype === 4,
            instance,
            mixin;
        //实例化组件
        try {
            var lastOwn = Refs.currentOwner;
            if (isStateless) {
                instance = {
                    refs: {},
                    __proto__: type.prototype,
                    render: function() {
                        return type(this.props, this.context);
                    }
                };
                Refs.currentOwner = instance;
                mixin = type(props, context);
            } else {
                instance = new type(props, context);
                Refs.currentOwner = instance;
            }
        } catch (e) {
            //失败时，则创建一个假的instance
            instance = {
                updater: this
            };
            vnode.stateNode = instance;
            this.instance = instance;
            return pushError(instance, "constructor", e);
        } finally {
            Refs.currentOwner = lastOwn;
        }
        //如果是无状态组件需要再加工
        if (isStateless) {
            if (mixin && mixin.render) {
                //带生命周期的
                extend(instance, mixin);
            } else {
                //不带生命周期的
                vnode.child = mixin;
                instance.__isStateless = true;
                this.mergeStates = alwaysNull;
                this.willReceive = false;
            }
        }
       
        vnode.stateNode = this.instance = instance;
        getDerivedStateFromProps(this, type, props, instance.state);
        //如果没有调用constructor super，需要加上这三行
        instance.props = props;
        instance.context = context;
        instance.updater = this;
        var queue =  this.insertCarrier =  (this.isPortal ?  {} : insertCarrier);
      
        this.insertPoint = queue.dom;
        this.updateQueue = updateQueue;
        if (instance.componentWillMount) {
            captureError(instance, "componentWillMount", []);
        }
        instance.state = this.mergeStates();
        //让顶层的元素updater进行收集
        this.render(updateQueue);
        updateQueue.push(this);
    },

    hydrate(updateQueue, inner) {
        let { instance, context, props, _reactInternalFiber:vnode, pendingVnode } = this;
        if(this._states[0] === "hydrate"){
            this._states.shift(); // ReactCompositeComponentNestedState-state
        }
        let state = this.mergeStates();
        let shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;
            if (pendingVnode) {
                var child = this._reactInternalFiber.child;
                this._reactInternalFiber = pendingVnode;
                pendingVnode.child = child;
                delete this.pendingVnode;
            }
            var nodes = collectComponentNodes(this.children);
            var queue = this.insertCarrier;
            nodes.forEach(function(el) {
                insertElement(el, queue.dom);
                queue.dom = el.stateNode;
                // queue.unshift(el.stateNode);
            });
        } else {
            captureError(instance, "componentWillUpdate", [props, state, context]);
            var { props: lastProps, state: lastState } = instance;
            this._hookArgs = [lastProps, lastState];
        }
        if(this._hasError){
            return;
        }
        vnode.stateNode = instance;
        delete this._forceUpdate;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        if(!inner) {
            this.insertCarrier.dom = this.insertPoint;
        }
        if (shouldUpdate) {
            this.render(updateQueue);
        }
        this.addState("resolve");
        updateQueue.push(this);
    },
    render(updateQueue) {
        let { _reactInternalFiber: vnode, pendingVnode, instance, parentContext } = this,
            nextChildren = emptyObject,
            lastChildren = emptyObject,
            childContext = parentContext,
            rendered,
            number;

        if (pendingVnode) {
            vnode = this._reactInternalFiber = pendingVnode;
            delete this.pendingVnode;
        }
        this._hydrating = true;

        if (this.willReceive === false) {
            rendered = vnode.child;
            delete this.willReceive;
        } else {
            let lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render", []);
            if (this._hasError) {
                rendered = true;
            }
            Refs.currentOwner = lastOwn;
        }
        number = typeNumber(rendered);
        var hasMounted = this.isMounted();
        if (hasMounted) {
            lastChildren = this.children;
        }
        if (number > 2) {
            if (number > 5) {
                //array, object
                childContext = getChildContext(instance, parentContext);
            }
            nextChildren = fiberizeChildren(rendered, this);
        } else {
            //undefinded, null, boolean
            this.children = nextChildren; //emptyObject
            delete this.child;
        }
        var noSupport = !support16 && errorType[number];
        if (noSupport) {
            pushError(instance, "render", new Error("React15 fail to render " + noSupport));
        }
        Refs.diffChildren(lastChildren, nextChildren, vnode, childContext, updateQueue, this.insertCarrier);
    },
    // ComponentDidMount/update钩子，React Chrome DevTools的钩子， 组件ref, 及错误边界
    resolve(updateQueue) {
        let { instance, _reactInternalFiber: vnode } = this;
        let hasMounted = this.isMounted();
        if (!hasMounted) {
            this.isMounted = returnTrue;
        }
        if (this._hydrating) {
            let hookName = hasMounted ? "componentDidUpdate" : "componentDidMount"  ;
            captureError(instance, hookName, this._hookArgs || []);
            //执行React Chrome DevTools的钩子
            if (hasMounted) {
                options.afterUpdate(instance);
            } else {
                options.afterMount(instance);
            }
            delete this._hookArgs;
            delete this._hydrating;
        }

        if (this._hasError) {
            return;
        } else {
            //执行组件ref（发生错误时不执行）
            if (vnode._hasRef) {
                Refs.fireRef(vnode, instance);
                vnode._hasRef = false;
            }
            clearArray(this._pendingCallbacks).forEach(function(fn) {
                fn.call(instance);
            });
        }
        transfer.call(this, updateQueue);
    },
    catch(queue){
        let { instance } = this;
        // delete Refs.ignoreError; 
        this._states.length = 0;
        this.children = {};
        this._isDoctor = this._hydrating = true;
        instance.componentDidCatch.apply(instance, this.errorInfo);
        delete this.errorInfo;
        this._hydrating = false;
        transfer.call(this, queue);

    },
    dispose() {
        let {_reactInternalFiber: vnode, instance} = this;
        options.beforeUnmount(instance);
        instance.setState = instance.forceUpdate = returnFalse;
       
        Refs.fireRef(vnode, null);
        captureError(instance, "componentWillUnmount", []);
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        this.isMounted = returnFalse;
        vnode._disposed = this._disposed = true;
    }
};
function transfer(queue){
    var cbs = this._nextCallbacks,
        cb;
    if (cbs && cbs.length) {
        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        do {
            cb = cbs.shift();
            if (isFn(cb)) {
                this._pendingCallbacks.push(cb);
            }
        } while (cbs.length);
        delete this._nextCallbacks;
        this.addState("hydrate");
        queue.push(this);
    }
}
export function getDerivedStateFromProps(updater,type, props, state){
    if(isFn(type.getDerivedStateFromProps)){
        var state = type.getDerivedStateFromProps.call(null, props, state);
        if(state != null){
            updater._pendingStates.push(state);
        }
    }
}

export function getChildContext(instance, parentContext) {
    if (instance.getChildContext) {
        let context = instance.getChildContext();
        if (context) {
            parentContext = extend(extend({}, parentContext), context);
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

export function collectComponentNodes(children) {
    var ret = [];
    for (var i in children) {
        var child = children[i];
        var inner = child.stateNode;
        if (child._disposed) {
            continue;
        }
        if (child.vtype < 2) {
            ret.push(child);
        } else {
            var updater = inner.updater;
            if (child.child) {
                var args = collectComponentNodes(updater.children);
                ret.push.apply(ret, args);
            }
        }
    }
    return ret;
}

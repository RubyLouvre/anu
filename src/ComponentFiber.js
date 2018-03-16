import { extend, options, typeNumber, emptyObject, isFn, returnFalse, returnTrue, clearArray } from "./util";
import { fiberizeChildren } from "./createElement";
import { drainQueue, enqueueUpdater } from "./scheduler";
import { pushError, captureError } from "./ErrorBoundary";
import { insertElement, document } from "./browser";
import { Refs } from "./Refs";

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
export function ComponentFiber(vnode, parentFiber) {
    extend(this, vnode);
    let type = vnode.type;
    this.name = type.displayName || type.name;
    this.return = parentFiber;
    this.context = getMaskedContext(getContextProvider(parentFiber), type.contextTypes);
    this._reactInternalFiber = vnode;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._states = ["resolve"];
    this._mountOrder = Refs.mountOrder++;

    //  fiber总是保存最新的数据，如state, props, context
    //  this._hydrating = true 表示组件会调用render方法及componentDidMount/Update钩子
    //  this._nextCallbacks = [] 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
}

ComponentFiber.prototype = {
    addState: function (state) {
        let states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition(updateQueue) {
        let state = this._states.shift();
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
        if (this._isMounted === returnTrue) {
            if (this._receiving) {
                //componentWillReceiveProps中的setState/forceUpdate应该被忽略
                return;
            }
            this.addState("hydrate");
            drainQueue([this]);
        }
    },
    mergeStates() {
        let instance = this.stateNode,
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

    _isMounted: returnFalse,
    init(updateQueue, mountCarrier) {
        let { props, context, type, tag } = this,
            isStateless = tag === 1,
            lastOwn = Refs.currentOwner,
            instance,
            lifeCycleHook;
        try {
            if (isStateless) {
                instance = {
                    refs: {},
                    __proto__: type.prototype,
                    __init__: true,
                    props,
                    context,
                    render: function f() {
                        let a = type(this.props, this.context);
                        if (a && a.render) {
                            //返回一带render方法的纯对象，说明这是带lifycycle hook的无狀态组件
                            //需要对象里的hook复制到instance中
                            lifeCycleHook = a;
                            return this.__init__ ? null : a.render.call(this);
                        } //这是一个经典的无狀态组件
                        return a;
                    }
                };
                Refs.currentOwner = instance;
                if (type.isRef) {
                    instance.render = function () {
                        delete this.updater._reactInternalFiber._hasRef;
                        return type(this.props, this.updater.ref);
                    };
                } else {
                    this.child = instance.render();
                    if (lifeCycleHook) {
                        for (let i in lifeCycleHook) {
                            if (i !== "render") {
                                instance[i] = lifeCycleHook[i];
                            }
                        }
                        lifeCycleHook = false;
                    } else {
                        this._willReceive = false;
                        this._isStateless = true;
                    }
                    delete instance.__init__;
                }
            } else {
                //有狀态组件
                instance = new type(props, context);
            }
        } catch (e) {
            instance = {
                //出错就纯造一个类实例结构
                updater: this
            };
            this.stateNode = instance;
            return pushError(instance, "constructor", e);
        } finally {
            Refs.currentOwner = lastOwn;
        }
        this.stateNode = instance;
        getDerivedStateFromProps(this, type, props, instance.state);

        //如果没有调用constructor super，需要加上这三行
        instance.props = props;
        instance.context = context;
        instance.updater = this;
        let carrier = this._return ? {} : mountCarrier;
        this._mountCarrier = carrier;
        this._mountPoint = carrier.dom || null;
        if (instance.componentWillMount) {
            captureError(instance, "componentWillMount", []);
        }
        instance.state = this.mergeStates();
        //让顶层的元素updater进行收集
        this.render(updateQueue);
        updateQueue.push(this);
    },

    hydrate(updateQueue, inner) {
        let { stateNode: instance, context, props } = this;
        if (this._states[0] === "hydrate") {
            this._states.shift(); // ReactCompositeComponentNestedState-state
        }
        let state = this.mergeStates();
        let shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;

            let nodes = collectComponentNodes(this._children);
            let carrier = this._mountCarrier;
            carrier.dom = this._mountPoint;
            nodes.forEach(function (el) {
                insertElement(el, carrier.dom);
                carrier.dom = el.stateNode;
            });
        } else {
            captureError(instance, "componentWillUpdate", [props, state, context]);
            let { props: lastProps, state: lastState } = instance;
            this._hookArgs = [lastProps, lastState];
        }

        if (this._hasError) {
            return;
        }

        delete this._forceUpdate;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        if (!inner) {
            this._mountCarrier.dom = this._mountPoint;
        }

        if (shouldUpdate) {
            this.render(updateQueue);
        }
        this.addState("resolve");
        updateQueue.push(this);
    },
    render(updateQueue) {
        let { stateNode: instance } = this,
            children = emptyObject,
            fibers = this._children || emptyObject,
            rendered,
            number;

        this._hydrating = true;
        //给下方使用的context

        if (instance.getChildContext) {
            let c = getContextProvider(this.return);
            c = getUnmaskedContext(instance, c);
            this._unmaskedContext = c;
        }
        if (this._willReceive === false) {
            let a = this.child;
            if (a && a.sibling) {
                rendered = [];
                for (; a; a = a.sibling) {
                    rendered.push(a);
                }
            } else {
                rendered = a;
            }
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
        if (number > 2) {
            children = fiberizeChildren(rendered, this);
        } else {
            //undefinded, null, boolean
            this._children = children; //emptyObject
            delete this.child;
        }
        Refs.diffChildren(fibers, children, this, updateQueue, this._mountCarrier);
    },
    // ComponentDidMount/update钩子，React Chrome DevTools的钩子， 组件ref, 及错误边界
    resolve(updateQueue) {
        let { stateNode: instance, _reactInternalFiber: vnode } = this;
        let hasMounted = this._isMounted();
        if (!hasMounted) {
            this._isMounted = returnTrue;
        }
        if (this._hydrating) {
            let hookName = hasMounted ? "componentDidUpdate" : "componentDidMount";
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
                Refs.fireRef(this, instance, vnode);
                vnode._hasRef = false;
            }
            clearArray(this._pendingCallbacks).forEach(function (fn) {
                fn.call(instance);
            });
        }
        transfer.call(this, updateQueue);
    },
    catch(queue) {
        let { stateNode: instance } = this;
        this._states.length = 0;
        this._children = {};
        this._isDoctor = this._hydrating = true;
        instance.componentDidCatch.apply(instance, this.errorInfo);
        delete this.errorInfo;
        this._hydrating = false;
        transfer.call(this, queue);
    },
    dispose() {
        let { stateNode: instance } = this;
        options.beforeUnmount(instance);
        instance.setState = instance.forceUpdate = returnFalse;

        Refs.fireRef(this, null, this._reactInternalFiber);
        captureError(instance, "componentWillUnmount", []);
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        this._isMounted = returnFalse;
        this._disposed = true;
    }
};
function transfer(queue) {
    let cbs = this._nextCallbacks,
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
export function getDerivedStateFromProps(updater, type, props, state) {
    if (isFn(type.getDerivedStateFromProps)) {
        state = type.getDerivedStateFromProps.call(null, props, state);
        if (state != null) {
            updater._pendingStates.push(state);
        }
    }
}

export function getMaskedContext(curContext, contextTypes) {
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

export function getUnmaskedContext(instance, parentContext) {
    let context = instance.getChildContext();
    if (context) {
        parentContext = extend(extend({}, parentContext), context);
    }
    return parentContext;
}
export function getContextProvider(fiber) {
    do {
        let c = fiber._unmaskedContext;
        if (c) {
            return c;
        }
    } while ((fiber = fiber.return));
}

//收集fiber
export function collectComponentNodes(children) {
    let ret = [];
    for (let i in children) {
        let child = children[i];
        let instance = child.stateNode;
        if (child._disposed) {
            continue;
        }
        if (child.tag > 4) {
            ret.push(child);
        } else {
            let fiber = instance.updater;
            if (child.child) {
                let args = collectComponentNodes(fiber._children);
                ret.push.apply(ret, args);
            }
        }
    }
    return ret;
}
//明天测试ref,与tests

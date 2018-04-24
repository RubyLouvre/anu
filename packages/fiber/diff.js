import { effects, resetStack } from "./util";
import { updateEffects } from "./beginWork";
import { collectEffects } from "./completeWork";
import { commitEffects } from "./commitWork";
import { CALLBACK } from "./effectTag";
import { Renderer } from "react-core/createRenderer";
import { __push, get, isFn, topNodes, typeNumber, topFibers } from "react-core/util";
import { Unbatch } from "./unbatch";
import { Fiber } from "./Fiber";
import { createInstance } from "./createInstance";

const macrotasks = Renderer.macrotasks;
const batchedtasks = [],
    microtasks = [];
window.microtasks = microtasks;

/*
window.microtasks = microtasks;
window.macrotasks = macrotasks;
window.batchedtasks = batchedtasks;
*/
export function render(vnode, root, callback) {
    let container = createContainer(root),
        immediateUpdate = false;
    if (!container.hostRoot) {
        let fiber = new Fiber({
            type: Unbatch,
            tag: 2,
            props: {},
            return: container,
        });
        container.child = fiber;
        //将updateClassComponent部分逻辑放到这里，我们只需要实例化它
        let instance = (fiber.stateNode = createInstance(fiber, {}));
        instance.updater.enqueueSetState = updateComponent;
        instance._reactInternalFiber = fiber;
        container.hostRoot = instance;
        immediateUpdate = true;
        Renderer.emptyElement(container);
    }
    let carrier = {};
    updateComponent(
        container.hostRoot,
        {
            child: vnode,
        },
        wrapCb(callback, carrier),
        immediateUpdate
    );
    return carrier.instance;
}

function wrapCb(fn, carrier) {
    return function () {
        var fiber = get(this);
        var target = fiber.child ? fiber.child.stateNode : null;
        fn && fn.call(target);
        carrier.instance = target;
    };
}

function performWork(deadline, el) {
    workLoop(deadline);
    var boundary = Renderer.catchBoundary;
    if (macrotasks.length || microtasks.length || boundary) {
        while ((el = microtasks.shift())) {
            if (!el.disposed) {
                macrotasks.push(el);
            }
        }
        if (boundary) {
            delete Renderer.catchBoundary;
            delete Renderer.hasError;
            macrotasks.push(boundary);
        }
        requestIdleCallback(performWork);
    }
}


let ricObj = {
    timeRemaining() {
        return 2;
    }
};
let ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn(ricObj);
}

Renderer.scheduleWork = function () {
    performWork(ricObj);
};

var isBatching = false;
Renderer.batchedUpdates = function (callback) {
    var keepbook = isBatching;
    isBatching = true;
    try {
        return callback();
    } finally {
        isBatching = keepbook;
        if (!isBatching) {
            var el;
            while ((el = batchedtasks.shift())) {
                if (!el.disabled) {
                    macrotasks.push(el);
                }
            }
            Renderer.scheduleWork();
        }
    }
};

function workLoop(deadline) {
    let topWork = getNextUnitOfWork();
    if (topWork) {
        let fiber = topWork,
            info;
        if (topWork.type === Unbatch) {
            info = topWork.return;
        } else {
            let dom = getContainer(fiber);
            info = {
                containerStack: [dom],
                contextStack: [{}],
            };
        }
        while (fiber && !fiber.disposed && deadline.timeRemaining() > ENOUGH_TIME) {
            fiber = updateEffects(fiber, topWork, info);
        }
        __push.apply(effects, collectEffects(topWork, null, true));
        effects.push(topWork);

        if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
            workLoop(deadline); //收集任务
        } else {
            resetStack(info);
            commitEffects(); //执行任务
        }
    }
}

function getNextUnitOfWork(fiber) {
    fiber = macrotasks.shift();
    if (!fiber || fiber.merged) {
        return;
    }
    return fiber;
}

/**
 * 这是一个深度优先过程，beginWork之后，对其孩子进行任务收集，然后再对其兄弟进行类似操作，
 * 没有，则找其父节点的孩子
 * @param {Fiber} fiber
 * @param {Fiber} topWork
 */

function mergeUpdates(el, state, isForced, callback) {
    let fiber = el._updates || el;
    if (isForced) {
        fiber.isForced = true; // 如果是true就变不回false
    }
    if (state) {
        let ps = fiber.pendingStates || (fiber.pendingStates = []);
        ps.push(state);
    }
    if (isFn(callback)) {
        let cs = fiber.pendingCbs || (fiber.pendingCbs = []);
        if (!cs.length) {
            if (!fiber.effectTag) {
                fiber.effectTag = CALLBACK;
            } else {
                fiber.effectTag *= CALLBACK;
            }
        }
        cs.push(callback);
    }
}

function fiberContains(p, son) {
    while (son.return) {
        if (son.return === p) {
            return true;
        }
        son = son.return;
    }
}

function pushChildQueue(fiber, queue) {
    //判定当前节点是否包含已进队的节点
    let maps = {};
    for (let i = queue.length, el; (el = queue[--i]);) {
        //移除列队中比它小的组件
        if (fiber === el) {
            queue.splice(i, 1); //已经放进过，去掉
            continue;
        } else if (fiberContains(fiber, el)) {
            //不包含自身
            queue.splice(i, 1);
            continue;
        }
        maps[el.stateNode.updater.mountOrder] = true;
    }
    let enqueue = true,
        p = fiber,
        hackSCU = [];
    while (p.return) {
        p = p.return;
        var instance = p.stateNode;
        if (instance.refs && !instance.__isStateless && p.type !== Unbatch) {
            hackSCU.push(p);
            var u = instance.updater;
            if (maps[u.mountOrder]) {
                //它是已经在列队的某个组件的孩子
                enqueue = false;
                break;
            }
        }
    }
    hackSCU.forEach(function (el) {
        //如果是批量更新，必须强制更新，防止进入SCU
        if (el._updates) {
            el._updates.batching = true;
        }
        el.batching = true;
    });
    if (enqueue) {
        if (fiber._hydrating) {
            fiber._updates = fiber._updates || {};
        }
        queue.push(fiber);
    }
}
//setState的实现

function updateComponent(instance, state, callback, immediateUpdate) {
    let fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    let sn = typeNumber(state);
    let isForced = state === true;
    state = isForced ? null : sn === 5 || sn === 8 ? state : null;
    if (Renderer.catchBoundary == fiber) {
        mergeUpdates(fiber, state, isForced, callback);
        return;
    }
    let parent = Renderer._hydratingParent;
    if (fiber.setout) {
        //情况1，在componentWillMount/ReceiveProps中setState， 不放进列队
        // console.log("setState 1");
        immediateUpdate = false;
    } else if (parent && fiberContains(parent, fiber)) {
        //情况2，在componentDidMount/Update中，子组件setState， 放进microtasks
        // console.log("setState 2");
        microtasks.push(fiber);
    } else if (isBatching && !immediateUpdate) {
        // ReactDOM.render(vnode, container)，只对更新时批处理，创建时走情况5
        //  console.log("setState 3");
        //情况3， 在batchedUpdates中setState，可能放进batchedtasks
        pushChildQueue(fiber, batchedtasks);
    } else {
        //情况4，在componentDidMount/Update中setState，可能放进microtasks
        //情况5，在钩子外setState, 需要立即触发
        immediateUpdate = immediateUpdate || !fiber._hydrating;
        // console.log(fiber.name + " setState " + (immediateUpdate ? 4 : 5), fiber._hydrating);
        pushChildQueue(fiber, microtasks);
    }

    mergeUpdates(fiber, state, isForced, callback);
    if (immediateUpdate) {
        Renderer.scheduleWork();
    }
}
Renderer.updateComponent = updateComponent;

function validateTag(el) {
    return el && el.appendChild;
}
export function createContainer(root, onlyGet, validate) {
    validate = validate || validateTag;
    if (!validate(root)) {
        throw `container is not a element`; // eslint-disable-line
    }

    root.anuProp = 2018;
    let useProp = root.anuProp === 2018;
    //像IE6-8，文本节点不能添加属性
    if (useProp) {
        root.anuProps = void 0;
        if (get(root)) {
            return get(root);
        }
    } else {
        var index = topNodes.indexOf(root);
        if (index !== -1) {
            return topFibers[index];
        }
    }
    if (onlyGet) {
        return null;
    }
    var container = new Fiber({
        stateNode: root,
        tag: 5,
        name: "hostRoot",
        contextStack: [{}],
        containerStack: [root],
        type: root.nodeName || root.type,
    });
    if (useProp) {
        root._reactInternalFiber = container;
    } else {
        topNodes.push(root);
        topFibers.push(container);
    }
    return container;
}
//不是529100

export function getContainer(p) {
    if (p.parent) {
        return p.parent;
    }
    while ((p = p.return)) {
        if (p.tag === 5) {
            return p.stateNode;
        }
    }
}

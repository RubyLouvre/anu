import { effects, containerStack } from "./util";
import { updateEffects, updateClassComponent } from "./beginWork";
import { collectEffects, getContainer } from "./completeWork";
import { commitEffects } from "./commitWork";
import { CALLBACK } from "./effectTag";
import { Renderer } from "react-core/createRenderer";
import { __push, get, isFn } from "react-core/util";
import { Unbatch } from "./unbatch";
//import { createElement } from "react-core/createElement";
import { Fiber } from "./Fiber";


const macrotasks = Renderer.macrotasks;
const batchedtasks = [], microtasks = [];
window.microtasks = microtasks;
window.batchedtasks = batchedtasks;


const publicRoot = {};

export function render(vnode, root, callback) {
    let hostRoot = Renderer.updateRoot(root), immediateUpdate = false;
    if (!hostRoot.wrapperInstance) {
        var w = new Fiber({
            type: Unbatch,
            tag: 2,
            props: {},
            return: hostRoot
        });
        // w.name = "Unbatch" + Math.random();
        hostRoot.child = w;
        updateClassComponent(w);
        delete w._hydrating;
        hostRoot.wrapperInstance = w.stateNode;
        immediateUpdate = true;
    }
    Renderer.updateComponent(
        hostRoot.wrapperInstance,
        {
            child: vnode,
        },
        wrapCb(callback),
        immediateUpdate
    );
    return publicRoot.instance;
}


function wrapCb(fn) {
    return function () {
        var fiber = get(this);
        var target = fiber.child ? fiber.child.stateNode : null;
        fn && fn.call(target);
        publicRoot.instance = target;
    };
}

function performWork(deadline, el) {
    workLoop(deadline);
    if (macrotasks.length || microtasks.length) {
        while ((el = microtasks.shift())) {
            if (!el.disabled) {
                macrotasks.push(el);
            }
        }
        requestIdleCallback(performWork);
    }
}

let ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn({
        timeRemaining() {
            return 2;
        },
    });
}

Renderer.scheduleWork = function () {
    performWork({
        timeRemaining() {
            return 2;
        },
    });
};

var isBatchingUpdates = false;
Renderer.batchedUpdates = function (callback) {
    var keepbook = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
        return callback();
    } finally {
        isBatchingUpdates = keepbook;
        if (!isBatchingUpdates) {
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
        let fiber = topWork;
        let c = getContainer(fiber);
        if (c) {
            containerStack.unshift(c);
        }
        while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
            fiber = updateEffects(fiber, topWork);
        }
        if (topWork) {
            __push.apply(effects, collectEffects(topWork, null, true));
            if (topWork.effectTag) {
                effects.push(topWork);
            }
        }
        if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
            workLoop(deadline); //收集任务
        } else {
            commitEffects(); //执行任务
        }
    }
}

function getNextUnitOfWork(fiber) {
    fiber = macrotasks.shift();
    if (!fiber || fiber.merged) {
        return;
    }
    if (fiber.root) {
        fiber.stateNode = fiber.stateNode || {};
        if (!get(fiber.stateNode)) {
            Renderer.emptyElement(fiber);
        }
        fiber.stateNode._reactInternalFiber = fiber;
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
    var p = fiber,
        inQueue = false;   
    var hackSCU = [];
    while (p.return) {
        p = p.return;
        //判定它的父节点是否已经在列队中
        if (p.tag < 3 && p.type !== Unbatch) {
            if (p._updates) {
                inQueue = true; //在列队中就不会立即触发
                hackSCU.push(p);
            } else if (p.tag === 2) {
                hackSCU.push(p);
            }
            break;
        }
    }
    
    inQueue && hackSCU.forEach(function (el) {
        //如果是批量更新，必须强制更新，防止进入SCU
        if (el._updates) {
            el._updates.batching = true;
        }
        el.batching = true;
    });
    //判定当前节点是否包含已进队的节点
    for (var i = queue.length, el; (el = queue[--i]);) {
        if (fiberContains(fiber, el)) {//不包含自身
            queue.splice(i, 1);
        }
    }
    if (!inQueue) {
        fiber._updates = fiber._updates || {};
        queue.push(fiber);
    }
}

//setState的实现
Renderer.updateComponent = function (instance, state, callback, immediateUpdate) {
    let fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    let parent = Renderer._hydratingParent;
    let isForced = state === true;
    state = isForced ? null : state;

    if (fiber.willing) {
        //情况1，在componentWillMount/ReceiveProps中setState， 不放进列队
        //  console.log("setState 1");
        immediateUpdate = false;
    } else if (parent && fiberContains(parent, fiber)) {
        //情况2，在componentDidMount/Update中，子组件setState， 放进microtasks
        // console.log("setState 2");
        microtasks.push(fiber);
    } else if (isBatchingUpdates && !immediateUpdate) {
        // ReactDOM.render(vnode, container)，只对更新时批处理，创建时走情况5
        // console.log("setState 3");
        //情况3， 在batchedUpdates中setState，可能放进batchedtasks
        pushChildQueue(fiber, batchedtasks);
    } else {
        //情况4，在componentDidMount/Update中setState，可能放进microtasks
        //情况5，在钩子外setState, 需要立即触发
        immediateUpdate = immediateUpdate || !fiber._hydrating;
        // console.log(fiber.name + " setState " + (immediateUpdate ? 4 : 5));
        pushChildQueue(fiber, microtasks);
    }

    mergeUpdates(fiber, state, isForced, callback);
    if (immediateUpdate) {
        Renderer.scheduleWork();
    }
};


//不是529100
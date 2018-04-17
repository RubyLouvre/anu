import { effects, containerStack } from "./util";
import { updateEffects } from "./beginWork";
import { collectEffects, getContainer } from "./completeWork";
import { commitEffects } from "./commitWork";
import { CALLBACK } from "./effectTag";
import { Renderer } from "react-core/createRenderer";
import { __push, get, isFn } from "react-core/util";

const macrotasks = Renderer.macrotasks;
const batchedCbs = [], microtasks = [];
export function render(vnode, root, callback) {
    let hostRoot = Renderer.updateRoot(root), instance = null;
    // 如果组件的componentDidMount/Update中调用ReactDOM.render
    if (hostRoot._hydrating) {
        hostRoot.pendingCbs.push(function () {
            render(vnode, root, callback);
        });
        return;
    }
    //如果在ReactDOM.batchedUpdates中调用ReactDOM.render
    if (isBatchingUpdates) {
        if (get(root)) {
            batchedCbs.push(function () {
                render(vnode, root, callback);
            });
            return;
        } else {
            root.isOther = true;
        }
    }

    hostRoot.props = {
        children: vnode
    };
    hostRoot.pendingCbs = [function () {
        instance = hostRoot.child ? hostRoot.child.stateNode : null;
        callback && callback.call(instance);
        hostRoot._hydrating = false; // unlock
    }];
    hostRoot.effectTag = CALLBACK;
    hostRoot._hydrating = true; // lock 表示正在渲染
    macrotasks.push(hostRoot);
    if (!Renderer.isRendering) {
        Renderer.scheduleWork();
    }
    return instance;
}

function performWork(deadline) {
    workLoop(deadline);
    if (macrotasks.length || microtasks.length) {
        requestIdleCallback(performWork);
    }
}

let ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn({
        timeRemaining() {
            return 2;
        }
    });
}

Renderer.scheduleWork = function () {
    performWork({
        timeRemaining() {
            return 2;
        }
    });
};

var isBatchingUpdates = false;
Renderer.batchedUpdates = function (callback) {
    var keepbook = isBatchingUpdates;
    isBatchingUpdates = true;
    //  console.log("isBatchingUpdates = true");
    Renderer.batch = {};
    try {
        return callback();
    } finally {
        isBatchingUpdates = keepbook;
        if (!isBatchingUpdates) {
            batchedCbs.forEach(fn => fn());
            batchedCbs.length = 0;
            Renderer.scheduleWork();
            Renderer.batch = false;
            //  console.log("isBatchingUpdates = false");
        }
    }
};
function getRoot(fiber) {
    while (fiber.return) {
        fiber = fiber.return;
    }
    return fiber;
}
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
function mountSorter(u1, u2) {
    return u1.stateNode.updater.mountOrder - u2.stateNode.updater.mountOrder;
}
function getNextUnitOfWork(fiber) {
    if (microtasks.length) {
        microtasks.sort(mountSorter);
        __push.apply(macrotasks, microtasks);
        microtasks.length = 0;
    }
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
function fiberContains(parent, son){
    while (son) {
        if(son === parent){
            son.isForced = true
            return true;
        }
        son = son.return;
    }
}
function parentIsHydrating(fiber, nextRendering){
    var p = fiber, batching = false;
    while (p.return) {
        p = p.return;
        if (p.tag < 3 && p._hydrating && !p.root) {
            batching = true;
            break;
        }
    }
    if(nextRendering){
        //如果当前fiber不在一个hydrating树中，那么将它放到列队
        for (var i =  microtasks.length, el; el = microtasks[--i]; ) {
            if(fiberContains(el, fiber ))
               microtasks.splice(i, 1);
            }
        }
        if(batching == false){
            microtasks.push(fiber);
        }
   

    }else{

    }

}
Renderer.updateComponent = function (instance, state, callback) {
    let fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    let root = getRoot(fiber), rootNode = root.stateNode;
    if (rootNode && rootNode.isOther) {
        delete rootNode.isOther;
        batchedCbs.push(Renderer.updateComponent.bind(null, instance, state, callback));
        return;
    }
    let isForced = state === true;
    state = isForced ? null : state;
    let p = fiber, inBatchedUpdate, batching = false;

    if (fiber.willing) {
        mergeUpdates(fiber, state, isForced, callback);
    } else {
        if (isBatchingUpdates) {
            fiber._hydrating = true;
            batching = parentIsHydrating(fiber, microtasks, true);

        } else {
            batching = parentIsHydrating(fiber, microtasks); 
        }
        var tasks = macrotasks;
        if (fiber._hydrating) {
            tasks = microtasks;
            if (!fiber._updates) {
                fiber._updates = {};
                tasks.push(fiber);
            }
            mergeUpdates(fiber, state, isForced, callback);
        } else {

            mergeUpdates(fiber, state, isForced, callback);
            macrotasks.push(fiber);
            Renderer.scheduleWork();
        }

    }
};
/*
Renderer.updateComponent = function (instance, state, callback) {
    let fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    let root = getRoot(fiber), rootNode = root.stateNode;
    if( rootNode && rootNode.isOther){
        delete rootNode.isOther;
        batchedCbs.push(Renderer.updateComponent.bind(null, instance, state, callback));
        return;
    }
    
    let isForced = state === true;
    state = isForced ? null : state;
    let p = fiber, inBatchedUpdate;
    // if(!isForced){
    if (isBatchingUpdates) {
        inBatchedUpdate = true;
    } else {//如果在setState中setState
        while (p.return) {
            p = p.return;
            if (p.tag < 3 && p._hydrating) {
                inBatchedUpdate = true;
               
                break;
            }
        }
    }
    //  }
    if (fiber._hydrating || inBatchedUpdate) {
        // 如果是render及didXXX中使用setState,那么需要在下一个周期更新
        var tasks = microtasks;
          if (inBatchedUpdate) {
            tasks = microtasks;
        }
      
        if (!fiber._updates) {
            fiber._updates = {};
            tasks.push(fiber);
        }
        mergeUpdates(fiber, state, isForced, callback);
    } else {
        // 如果是在willXXX钩子中使用setState，那么直接修改fiber及instance
        mergeUpdates(fiber, state, isForced, callback);
        if (!fiber._hooking) {
            //如果在hook外使用setState，需要立即更新视图
            macrotasks.push(fiber);
            Renderer.scheduleWork();
        }
    }
};
*/
//在批量更新中，如果祖先组件正在更新，
//有两个渲染列队
//第一个叫marcotasks,当前渲染的

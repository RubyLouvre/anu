import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

function hydrate(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        true,
        callback,
    );
}
function render(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        false,
        callback,
    );
}

function unstable_renderSubtreeIntoContainer(parentComponent,vdom, container, callback  ) {
    return legacyRenderSubtreeIntoContainer(
        parentComponent,
        vdom,
        container,
        false,
        callback,
    );
}


function unmountComponentAtNode(container) {
    if (container && container._reactRootContainer) {
        // Unmount should not be batched.
        unbatchedUpdates(() => {
            legacyRenderSubtreeIntoContainer(null, null, container, false, () => {
                container._reactRootContainer = null;
            });
        });
        return true;
    } else {
        return false;
    }
}


function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback,
) {
    // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
    let root = container._reactRootContainer;
    if (typeof callback === 'function') {
        const originalCallback = callback;
        callback = function() {
            const instance = getPublicRootInstance(root._internalRoot);
            originalCallback.call(instance);
        };
    }
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
            container,
            forceHydrate,
        );
       
        // Initial mount should not be batched.
        unbatchedUpdates(() => {
            if (parentComponent != null) {
                root.render(
                    parentComponent,
                    children,
                    callback,
                );
            } else {
                root.render(children, callback);
            }
        });
    } else {
        // Update
        if (parentComponent != null) {
            root.render(
                parentComponent,
                children,
                callback,
            );
        } else {
            root.render(children, callback);
        }
    }
    return getPublicRootInstance(root._internalRoot);
}

function legacyCreateRootFromDOMContainer( container,forceHydrate) {
    const shouldHydrate =
      forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    // First clear any existing content.
    if (!shouldHydrate) {
        let rootSibling;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    // Legacy roots are not async by default.
    const isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot(
    container: Container,
    isConcurrent: boolean,
    hydrate: boolean,
  ) {
    const root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
    root.render = render
  }



 function render(
    parentComponent,
    children,
    callback,
  ) {
    const root = this._internalRoot;
   
    callback = callback === undefined ? null : callback;
    updateContainer(children, root, parentComponent, callback);
};



export const ROOT_ATTRIBUTE_NAME = 'data-reactroot';

function shouldHydrateDueToLegacyHeuristic(container) {
    const rootElement = getReactRootElementInContainer(container);
    return !!(
        rootElement &&
      rootElement.nodeType === ELEMENT_NODE &&
      rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
    );
}
const NoWork = 0;
const noTimeout = -1;

function createContainer(container, isConcurrent, hydrate){
    const uninitializedFiber = createHostRootFiber(isConcurrent);
    var fiber = {
        current: uninitializedFiber,
        containerInfo: container,
        pendingChildren: null,
  
        pingCache: null,
  
        earliestPendingTime: NoWork,
        latestPendingTime: NoWork,
        earliestSuspendedTime: NoWork,
        latestSuspendedTime: NoWork,
        latestPingedTime: NoWork,
  
        didError: false,
  
        pendingCommitExpirationTime: NoWork,
        finishedWork: null,
        timeoutHandle: noTimeout,
        context: null,
        pendingContext: null,
        hydrate,
        nextExpirationTimeToWorkOn: NoWork,
        expirationTime: NoWork,
        firstBatch: null,
        nextScheduledRoot: null,
      };
      uninitializedFiber.stateNode = fiber;
      return fiber;
    
}
function createHostRootFiber(isConcurrent) {
    var mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;
  
    return {
        tag: HostRoot,
        mode: mode,
        expirationTime: NoWork
    }
  }
  
 function updateContainer( vnode ,
    rootFiber,//fiber
    parentComponent,
    callback,
  ) {
    const current = rootFiber.current;
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, current);

    // TODO: If this is a nested container, this won't be the root.
    const fiber = rootFiber.current;
    const context = getContextForSubtree(parentComponent);
    if (rootFiber.context === null) {
        rootFiber.context = context;
    } else {
        rootFiber.pendingContext = context;
    }
  
    return scheduleRootUpdate(fiber, vnode, expirationTime, callback);
}

var maxSigned31BitInt = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = maxSigned31BitInt;

var UNIT_SIZE = 10;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
  return 1073741822 - (ms / UNIT_SIZE | 0);
}


var originalStartTimeMs = new Date - 0;
var cacheTime = msToExpirationTime(originalStartTimeMs);
function recomputeCurrentRendererTime(){
    var currentTimeMs = Date.now() - originalStartTimeMs;
    cacheTime = msToExpirationTime(currentTimeMs);
    return cacheTime;
}
function requestCurrentTime(isRendering) {
    /*
调度程序调用requestCurrentTime来计算过期时间
时间。

过期时间是通过添加到当前时间(开始)来计算的
时间)。但是，如果在同一个事件中安排了两个更新，则我们
应该将它们的启动时间视为同步的，即使是实际的时钟
从第一次呼叫到第二次呼叫之间的时间已经提前了。

换句话说，因为过期时间决定了更新的批处理方式，
我们希望在同一事件中发生的所有类似优先级的更新
接收相同的过期时间。否则我们就会流泪。

我们跟踪两个独立的时间:当前的“呈现器”时间和
当前的“调度”时间。渲染器时间可以随时更新;它
只存在于最小化调用性能。
    */
    if (isRendering) {
      //我们已经开始渲染。返回最近读取的时间。
      return cacheTime
    }
    // Check if there's pending work.
   var nextFlushedExpirationTime = findHighestPriorityRoot();
    if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
     //   如果没有挂起的工作，或者挂起的工作不在屏幕上，我们可以
     //   阅读当前的时间，没有撕裂的风险。
      return recomputeCurrentRendererTime();
    }
  //  已经有正在工作的fiber。我们可能运行于浏览器的某些事件中，
  //  如果读取当前时间，可能会导致多次更新
  //  在同一事件中接收不同的过期时间，导致撕裂。返回最后一次读取时间。在下一次空闲回调期间
  //  时间将会更新。
    return cacheTime;
  }

function scheduleRootUpdate(
    current,
    vnode,
    expirationTime,
    callback,
) {
    
    const update = createUpdate(expirationTime);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {element:vnode};
  
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
       
        update.callback = callback;
    }
  
    flushPassiveEffects();
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime);
  
    return expirationTime;
}
var nextRenderExpirationTime = NoWork

function scheduleWork(fiber, expirationTime) {
	const root = scheduleWorkToRoot(fiber, expirationTime);
	if (root === null) {
		return;
	}
	if (
		!isWorking &&
		nextRenderExpirationTime !== NoWork &&
		expirationTime > nextRenderExpirationTime
	) {
		resetStack();
	}
	markPendingPriorityLevel(root, expirationTime);
	if (
		//如果在准备阶段或commitRoot阶段或渲染另一个节点
		!isWorking ||
		isCommitting ||
		// ...unless this is a different root than the one we're rendering.
		nextRoot !== root
	) {
		const rootExpirationTime = root.expirationTime;
		requestWork(root, rootExpirationTime);
	}
}

function scheduleWorkToRoot(fiber, expirationTime) {
  
   
  
    // Update the source fiber's expiration time
    if (fiber.expirationTime < expirationTime) {
      fiber.expirationTime = expirationTime;
    }
    var alternate = fiber.alternate;
    if (alternate !== null && alternate.expirationTime < expirationTime) {
      alternate.expirationTime = expirationTime;
    }
    // Walk the parent path to the root and update the child expiration time.
    var node = fiber.return;
    var root = null;
    if (node === null && fiber.tag === HostRoot) {
      root = fiber.stateNode;
    } else {
      while (node !== null) {
        alternate = node.alternate;
        if (node.childExpirationTime < expirationTime) {
          node.childExpirationTime = expirationTime;
          if (alternate !== null && alternate.childExpirationTime < expirationTime) {
            alternate.childExpirationTime = expirationTime;
          }
        } else if (alternate !== null && alternate.childExpirationTime < expirationTime) {
          alternate.childExpirationTime = expirationTime;
        }
        if (node.return === null && node.tag === HostRoot) {
          root = node.stateNode;
          break;
        }
        node = node.return;
      }
    }
  
    return root;
  }
  

function findHighestPriorityRoot() {
    var highestPriorityWork = NoWork;
    var highestPriorityFiber = null
    for(var i = 0; i < roots.length; i++){
        var root = roots[i];
        if(root.expirationTime > highestPriorityWork){
            highestPriorityWork = root.expirationTime
            highestPriorityFiber = root;
        }
    }
    nextFlushedRoot = highestPriorityFiber;
    return  nextFlushedExpirationTime = highestPriorityWork;

  }
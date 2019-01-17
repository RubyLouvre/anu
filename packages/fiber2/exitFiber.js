
import { HostRoot, IndeterminateComponent,
    LazyComponent,
    SimpleMemoComponent,
    FunctionComponent,
    ForwardRef,
    HostComponent, 
    HostPortal, 
    ClassComponent, 
    HostText,
    Fragment,
    Mode,
    Profiler,
    SuspenseComponent } from './fiberTags';
import { Deletion, DidCapture, NoEffect, Update,} from './effectTag';
export function bailoutOnAlreadyFinishedWork (alternate, fiber, renderExpirationTime) {
    // Check if the children have any pending work.
    var childExpirationTime = fiber.childExpirationTime;
    if (childExpirationTime < renderExpirationTime) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
        return null;
    } else {
    // This fiber doesn't have work, but its subtree does. Clone the child
    // fibers and continue.
        cloneChildFibers(alternate, fiber);
        return fiber.child;
    }
}

export function cloneChildFibers (alternate, fiber) {
    var alternateChild = fiber.child;
    if (alternateChild === null) {
        return;
    }
    var newChild = createAlternate(alternateChild, alternateChild.pendingProps, alternateChild.expirationTime);
    fiber.child = newChild;
    newChild.return = fiber;
    while (alternateChild.sibling !== null) {
        alternateChild = alternateChild.sibling;
        newChild = newChild.sibling = createAlternate(alternateChild, alternateChild.pendingProps, alternateChild.expirationTime);
        newChild.return = fiber;
    }
    newChild.sibling = null;
}


export function completeWork(alternate, fiber, renderExpirationTime) {
    const newProps = fiber.pendingProps;
    switch (fiber.tag) {
        case IndeterminateComponent:
            break;
        case LazyComponent:
            break;
        case SimpleMemoComponent:
            break;
        case FunctionComponent:
            break;
        case ForwardRef:
            break;
        case Fragment:
            break;
        case Mode:
            break;
        case Profiler:
            break;
        case ClassComponent: 
            const instance = fiber.stateNode;
            if (instance.shiftContext){
                shiftContext(fiber);
            }
            break;
        case HostRoot: 
            break;
        case HostComponent: 
            const type = fiber.type;
            if (alternate !== null && fiber.stateNode != null) {
                //更新属性与孩子
                updateHostComponent(
                    alternate,
                    fiber,
                    type,
                    newProps
                );
                if (alternate.ref !== fiber.ref) {
                    markRef(fiber);
                }
            } else {
                const parentNode = getHostParent(fiber);
                const dom = createDOMElement(
                    type,
                    newProps,
                    parentNode,
                    fiber,
                );
                appendAllChildren(dom, fiber, false, false);
                if (finalizeInitialChildren(
                    dom,
                    type,
                    newProps,
                    rootContainerInstance,
                    alternateHostContext,
                )
                ) {
                    markUpdate(fiber);
                }
                fiber.stateNode = dom;
            }
            if (fiber.ref !== null) {
                markRef(fiber);
            }
            break;
        case HostText: 
            let newText = newProps;
            if (alternate && fiber.stateNode != null) {
                const oldText = alternate.memoizedProps;
                if (oldText !=  newText){
                    fiber.effectTag != ContentReset;
                }
            } else {
                fiber.stateNode = createTextNode(
                    newText,
                    rootContainerInstance,
                    alternateHostContext,
                    fiber,
                );
            }
            break;
        case SuspenseComponent: 
            const nextState = fiber.memoizedState;
            if ((fiber.effectTag & DidCapture) !== NoEffect) {
                // Something suspended. Re-render with the fallback children.
                fiber.expirationTime = renderExpirationTime;
                // Do not reset the effect list.
                return fiber;
            }
      
            const nextDidTimeout = nextState !== null;
            const prevDidTimeout = alternate !== null && alternate.memoizedState !== null;
      
            if (alternate !== null && !nextDidTimeout && prevDidTimeout) {
                // We just switched from the fallback to the normal children. Delete
                // the fallback.
                // TODO: Would it be better to store the fallback fragment on
                // the stateNode during the begin phase?
                const alternateFallbackChild = (alternate.child).sibling;
                if (alternateFallbackChild !== null) {
                // Deletions go at the beginning of the return fiber's effect list
                    const first = fiber.firstEffect;
                    if (first !== null) {
                        fiber.firstEffect = alternateFallbackChild;
                        alternateFallbackChild.nextEffect = first;
                    } else {
                        fiber.firstEffect = fiber.lastEffect = alternateFallbackChild;
                        alternateFallbackChild.nextEffect = null;
                    }
                    alternateFallbackChild.effectTag = Deletion;
                }
            }
      
            if (nextDidTimeout || prevDidTimeout) {
                // If the children are hidden, or if they were previous hidden, schedule
                // an effect to toggle their visibility. This is also used to attach a
                // retry listener to the promise.
                fiber.effectTag |= Update;
            }
            break;
        case HostPortal:
            popHostContainer(fiber);
            updateHostContainer(fiber);
            break;
    }
}


function getHostParent(fiber){
    while (fiber.return){
        fiber = fiber.return;
        if (fiber.tag === HostComponent){
            return fiber.stateNode;
        }
        if (fiber.containerInfo){
            return fiber.containerInfo;
        }
    }
}

function createTextNode(newText,rootContainerInstance,alternateHostContext,fiber){
    return document.createTextNode(newText);
}


function createPortal(children, container, implementation, key) {
    return {
        // This tag allow us to uniquely identify this as a React Portal
        tag: HostPortal,
        key: key == null ? null : '' + key,
        children: children,
        containerInfo: container,
        implementation: implementation
    };
}
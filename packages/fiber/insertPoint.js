import { PLACE, WORKING, NOWORK } from './effectTag';

//查找它后面的节点
export function getInsertPoint(fiber) {
    let parent = fiber.parent;
    while (fiber) {
        if (fiber.stateNode === parent || fiber.isPortal) {
            return null;
        }
        //首先往左找，找不到找这的父亲的左边
        let found = forward(fiber);
        if (found) {
            return found;
        }
        fiber = fiber.return;
    }
}

export function setInsertPoints(children) {
    for (let i in children) {
        let child = children[i];
        if (child.disposed) {
            continue;
        }
        if (child.tag > 4) {
            let p = child.parent;
            child.effectTag = PLACE;
            child.forwardFiber = p.insertPoint;
            p.insertPoint = child;
            for (
                let pp = child.return;
                pp && pp.effectTag === NOWORK;
                pp = pp.return
            ) {
                pp.effectTag = WORKING;
            }
        } else {
            if (child.child) {
                setInsertPoints(child.children);
            }
        }
    }
}

function forward(fiber) {
    var found;
    while (fiber.forward) {
        fiber = fiber.forward;
        //如果这已经被销毁或者是传送门
        if (fiber.disposed || fiber.isPortal) {
            continue;
        }
        if (fiber.tag > 3) {
            return fiber;
        }
        if (fiber.child) {
            found = downward(fiber);
            if (found) {
                return found;
            }
        }
    }
}

function downward(fiber) {
    var found;
    while (fiber.lastChild) {
        fiber = fiber.lastChild;
        if (fiber.disposed || fiber.isPortal) {
            return;
        }
        if (fiber.tag > 3) {
            return fiber;
        }
        if (fiber.forward) {
            found = forward(fiber);
            if (found) {
                return found;
            }
        }
    }
}

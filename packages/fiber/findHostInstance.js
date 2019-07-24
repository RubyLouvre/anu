import { get } from "react-core/util";

export function findHostInstance(fiber) {
    if (!fiber) {
        return null;
    } else if (fiber.nodeType) {
        return fiber;
    } else if (fiber.tag > 3) {
        // 如果本身是元素节点
        return fiber.stateNode;
    } else if (fiber.tag < 3) {
        return findHostInstance(fiber.stateNode);
    } else if (fiber.refs && fiber.render) {
        fiber = get(fiber);
        let childrenMap = fiber.children;
        if (childrenMap) {
            for (let i in childrenMap) {
                let dom = findHostInstance(childrenMap[i]);
                if (dom) {
                    return dom;
                }
            }
        }
    }
    return null;
}



import { get, toWarnDev } from "react-core/util";

// [Top API] ReactDOM.findDOMNode
export function findDOMNode(stateNode) {
    if (stateNode == null) {
        // 如果是null
        return null;
    }

    if (stateNode.nodeType) {
        // 如果本身是元素节点
        return stateNode;
    }
    // 实例必然拥有updater与render
    if (stateNode.render) {
        let fiber = get(stateNode);
        if(fiber.disposed){
            toWarnDev("findDOMNode:disposed component")
        }
        let c = fiber.child;
        if (c && !c.disposed) {
            return findDOMNode(c.stateNode);
        } else {
            return null;
        }
    }
    throw "findDOMNode:invalid type"
}
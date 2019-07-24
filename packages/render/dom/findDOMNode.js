import { findHostInstance } from "react-fiber/findHostInstance";

// [Top API] ReactDOM.findDOMNode
export function findDOMNode(fiber) {
    if (fiber == null) {
        return null;
    }
    if (fiber.nodeType === 1) {
        return fiber;
    }
    if (!fiber.render) {
        throw "findDOMNode:invalid type";
    }
    return findHostInstance(fiber);
}

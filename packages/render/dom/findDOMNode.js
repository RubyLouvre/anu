

import { findHostInstance } from "react-fiber/findHostInstance";

// [Top API] ReactDOM.findDOMNode
export function findDOMNode(fiber) {
    if (fiber === null || (fiber && fiber.nodeType)) {
        return fiber;
    }
    if (!fiber || !fiber.render) {
        throw "findDOMNode:invalid type";
    }

    return findHostInstance(fiber);
}


import { findHostInstance } from "react-fiber/findHostInstance";

// [Top API] ReactDOM.findDOMNode
export function findDOMNode(fiber) {
    if (!fiber && !fiber.nodeType && !fiber.render && !fiber.refs ) {
        throw "findDOMNode:invalid type";
    }
    return findHostInstance(fiber);
}
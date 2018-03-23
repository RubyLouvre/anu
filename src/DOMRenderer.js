
import { inputControll, formElements } from "./inputControll";
import { diffProps } from "./diffProps";
import { emptyObject, topNodes, topFibers } from "./share";
import { emptyElement, createElement, insertElement, removeElement } from "./browser";
//其他Renderer也要实现这些方法
export let DOMRenderer = {
    updateAttribute(fiber) {
        let { type, props, lastProps, stateNode } = fiber;
        diffProps(stateNode, lastProps || emptyObject, props, fiber);
        if (formElements[type]) {
            inputControll(fiber, stateNode, props);
        }
    },
    updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props.children;
    },
    createElement,
    insertElement,
    emptyElement(fiber){
        emptyElement(fiber.stateNode);
    },
    removeElement(fiber) {
        let instance = fiber.stateNode;
        removeElement(instance);
        let j = topNodes.indexOf(instance);
        if (j !== -1) {
            topFibers.splice(j, 1);
            topNodes.splice(j, 1);
        }
    }
};
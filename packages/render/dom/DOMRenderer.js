import { diffProps } from "./props";
import { document, NAMESPACE, contains } from "./browser";

import {
    get,
    innerHTML,
    emptyObject,
    topNodes,
    topFibers,
    toWarnDev
} from "react-core/util";
import { Renderer, createRenderer } from "react-core/createRenderer";
import { Fiber } from "react-fiber/Fiber";
import { detachFiber } from "react-fiber/beginWork";
import { commitEffects } from "react-fiber/commitWork";
import { render } from "react-fiber/diff";


export function createElement(vnode) {
    let p = vnode.return;
    let { type, props, ns, text } = vnode;
    switch (type) {
    case "#text":
        //只重复利用文本节点
        var node = recyclables[type].pop();
        if (node) {
            node.nodeValue = text;
            return node;
        }
        return document.createTextNode(text);
    case "#comment":
        return document.createComment(text);

    case "svg":
        ns = NAMESPACE.svg;
        break;
    case "math":
        ns = NAMESPACE.math;
        break;

    default:
        do {
            if (p.tag === 5) {
                ns = p.stateNode.namespaceURI;
                if (p.type === "foreignObject" || ns === NAMESPACE.xhtml) {
                    ns = "";
                }
                break;
            }
        } while ((p = p.return));

        break;
    }
    try {
        if (ns) {
            vnode.namespaceURI = ns;
            return document.createElementNS(ns, type);
        }
        //eslint-disable-next-line
    } catch (e) { }
    let elem = document.createElement(type);
    let inputType = props && props.type; //IE6-8下立即设置type属性
    if (inputType) {
        try {
            elem = document.createElement("<" + type + " type='" + inputType + "'/>");
        } catch (err) {
            //xxx
        }
    }
    return elem;
}

let fragment = document.createDocumentFragment();
function emptyElement(node) {
    let child;
    while ((child = node.firstChild)) {
        emptyElement(child);
        if (child === Renderer.focusNode) {
            Renderer.focusNode = false;
        }
        node.removeChild(child);
    }
}

const recyclables = {
    "#text": []
};
export function removeElement(node) {
    if (!node) {
        return;
    }
    if (node.nodeType === 1) {
        emptyElement(node);
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
        }
    }
    if (node === Renderer.focusNode) {
        Renderer.focusNode = false;
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}

function insertElement(fiber) {
    let { stateNode: dom, parent, insertPoint } = fiber;
    try {
        if (insertPoint == null) {
            if (dom !== parent.firstChild) {
                parent.insertBefore(dom, parent.firstChild);
            }
        } else {
            if (dom !== parent.lastChild) {
                parent.insertBefore(dom, insertPoint.nextSibling);
            }
        }

    } catch (e) {
        throw e;
    }
    let isElement = fiber.tag === 5;
    let prevFocus = isElement && document.activeElement;

    if (isElement && prevFocus !== document.activeElement && contains(document.body, prevFocus)) {
        try {
            Renderer.focusNode = prevFocus;
            prevFocus.__inner__ = true;
            prevFocus.focus();
        } catch (e) {
            prevFocus.__inner__ = false;
        }
    }
}

function collectText(fiber, ret){
    for(var c = fiber.child; c ; c = c.sibling){
        if(c.tag === 5){
            collectText(c, ret);
            removeElement(c.stateNode)
        }else if(c.tag === 6){
            ret.push(c.props.children);
        }else {
            collectText(c, ret);
        }
    }
}
function isTextContainer(fiber){
    switch(fiber.type){
    case "option":
    case "noscript":
    case "textarea":
    case "style":
    case "script":
        return true;
    default:
        return false;
    }
}
//其他Renderer也要实现这些方法
export let DOMRenderer = createRenderer({
    render,
   
    updateAttribute(fiber) {
        let { type, props, lastProps, stateNode } = fiber;
        if(isTextContainer(fiber)){
            var texts = [];
            collectText(fiber, texts);
            var text = texts.reduce(function(a, b){
                return a + b;
            }, "");
            switch(fiber.type){
            case "textarea":
                if( lastProps == emptyObject && !("value" in props) && !("defaultValue" in props)){
                  //  stateNode.innerHTML = text;
                    props.defaultValue = text;
                }
                break;
            case "option":
                stateNode.text = text;
                //   stateNode.duplexValue = "value" in props ? props.value: stateNode.text;
                break;
            default:
                stateNode.innerHTML = text;
                break;
            }
        }
        diffProps(stateNode, lastProps || emptyObject, props, fiber);
        if (type === "option") {
            if ("value" in props) {
                stateNode.duplexValue = stateNode.value = props.value;
            } else {
                stateNode.duplexValue = stateNode.text;
            }
        }
        
    },
    updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props.children;
    },
    updateRoot(root) {
        if (!(root && root.appendChild)) {
            throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
        }
        var hostRoot = get(root);
        if (!hostRoot) {
            let ns = root.namespaceURI;
            ns = !ns || ns === NAMESPACE.xhtml ? "" : ns;
            hostRoot = new Fiber({
                stateNode: root,
                root: true,
                tag: 5,
                className: root.className,
                name: "hostRoot",
                type: ns ? root.tagName : root.tagName.toLowerCase(),
                namespaceURI: ns, //必须知道第一个元素的文档类型
            });
        }
        if (topNodes.indexOf(root) == -1) {
            topNodes.push(root);
            topFibers.push(hostRoot);
        }
        return hostRoot;
    },
    createElement,
    insertElement,
    emptyElement(fiber) {
        emptyElement(fiber.stateNode);
    },
    unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
        toWarnDev("unstable_renderSubtreeIntoContainer", true);
        return Renderer.render(vnode, container, callback);
    },
    // [Top API] ReactDOM.unmountComponentAtNode
    unmountComponentAtNode(container) {
        let rootIndex = topNodes.indexOf(container);
        if (rootIndex > -1) {
            let lastFiber = topFibers[rootIndex],
                effects = [];
            detachFiber(lastFiber, effects);
            effects.shift();
            commitEffects(effects);
            topNodes.splice(rootIndex, 1);
            topFibers.splice(rootIndex, 1);
            container._reactInternalFiber = null;
            return true;
        }
        return false;
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
});

//setState把自己放进列队
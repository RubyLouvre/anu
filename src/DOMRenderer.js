import { inputControll, formElements } from "./inputControll";
import { diffProps } from "./diffProps";
import { get, Flutter } from "./util";
import { emptyObject, topNodes, topFibers } from "./share";
import { document, NAMESPACE, contains } from "./browser";


export function createElement(vnode) {
    let p = vnode.return;
    let { type, props, namespaceURI: ns, text } = vnode;
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
    case "div":
    case "span":
    case "p":
    case "tr":
    case "td":
    case "li":
        ns = "";
        break;
    default:
        if (!ns) {
            do {
                if (p.tag === 5) {
                    ns = p.namespaceURI;
                    if (p.type === "foreignObject") {
                        ns = "";
                    }
                    break;
                }
            } while ((p = p.return));
        }
        break;
    }
    try {
        if (ns) {
            vnode.namespaceURI = ns;
            return document.createElementNS(ns, type);
        }
        //eslint-disable-next-line
	} catch (e) {}
    let elem = document.createElement(type);
    let inputType = props && props.type; //IE6-8下立即设置type属性
    if (inputType) {
        elem.type = inputType;
    }
    return elem;
}

let fragment = document.createDocumentFragment();
function emptyElement(node) {
    let child;
    while ((child = node.firstChild)) {
        emptyElement(child);
        if (child === Flutter.focusNode) {
            Flutter.focusNode = false;
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
    if (node === Flutter.focusNode) {
        Flutter.focusNode = false;
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}

function insertElement(fiber) {
    //找到可用的父节点
    let dom = fiber.stateNode,
        parentNode = fiber.parent,
        before =  fiber.insertPoint;
    try {
        if(before == null){
            if(dom !== parent.firstChild){
                //console.log(dom, "插入最前面",!!parent.firstChild)
                parentNode.insertBefore(dom, parent.firstChild);
            }
			
        }else{
            if(dom !== parent.lastChild){
                //console.log(" 移动 ", dom === before, dom, before)
                parentNode.insertBefore(dom, before.nextSibling);
            }
        }
		
    } catch (e) {
        throw e;
    }
    let isElement = fiber.tag === 5;
    let prevFocus = isElement && document.activeElement;

    if (isElement && prevFocus !== document.activeElement && contains(document.body, prevFocus)) {
        try {
            Flutter.focusNode = prevFocus;
            prevFocus.__inner__ = true;
            prevFocus.focus();
        } catch (e) {
            prevFocus.__inner__ = false;
        }
    }
}



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
    updateRoot(vnode, root) {
        if (!(root && root.appendChild)) {
            throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
        }
        let hostRoot = {
            stateNode: root,
            root: true,
            tag: 5,
            name: "hostRoot",
            type: root.tagName.toLowerCase(),
            props: {
                children: vnode
            },
            namespaceURI: root.namespaceURI, //必须知道第一个元素的文档类型
            alternate: get(root)
        };
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

import { diffProps } from "./props";
import { document, NAMESPACE, contains } from "./browser";
import { get, extend, emptyObject, topNodes, topFibers } from "react-core/util";
import { Renderer, createRenderer } from "react-core/createRenderer";
import { render, createContainer } from "react-fiber/diff";
//import { contextStack } from 'react-fiber/util';

export function createElement(vnode) {
    let p = vnode.return;
    let { type, props, ns } = vnode;
    switch (type) {
    case "#text":
        //只重复利用文本节点

        return props.children;
        
    case "#comment":
        return "<!--"+props.childre+"-->"
    default:
        return ["<"+ vnode.type, ">"]
}

let fragment = document.createDocumentFragment();
function emptyElement(node) {
    let child;
    while ((child = node.firstChild)) {
        emptyElement(child);
        if (child === Renderer.focusNode) {
            Renderer.focusNode = null;
        }
        node.removeChild(child);
    }
}

const recyclables = {
    "#text": [],
};
export function removeElement(node) {
    if (!node) {
        return;
    }
    if (node.nodeType === 1) {
        emptyElement(node);
        if (node._reactInternalFiber) {
            var i = topFibers.indexOf(node._reactInternalFiber);
            if (i !== -1) {
                topFibers.splice(i, -1);
                topNodes.splice(i, -1);
            }
        }
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
        }
    }
    if (node === Renderer.focusNode) {
        Renderer.focusNode = null;
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}

function insertElement(fiber) {
    let { stateNode: dom, parent, insertPoint } = fiber;
    try {
        let after = insertPoint ? insertPoint.nextSibling : parent.firstChild;
        if (after === dom) {
            return;
        }
        if (after === null && dom === parent.lastChild) {
            return;
        }
        parent.insertBefore(dom, after);

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

function collectText(fiber, ret) {
    for (var c = fiber.child; c; c = c.sibling) {
        if (c.tag === 5) {
            collectText(c, ret);
            removeElement(c.stateNode);
        } else if (c.tag === 6) {
            ret.push(c.props.children);
        } else {
            collectText(c, ret);
        }
    }
}
function isTextContainer(fiber) {
    switch (fiber.type) {
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
        if (isTextContainer(fiber)) {
            var texts = [];
            collectText(fiber, texts);
            var text = texts.reduce(function(a, b) {
                return a + b;
            }, "");
            switch (fiber.type) {
            case "textarea":
                
                if (!("value" in props) && !("defaultValue" in props)) {
                    if (!lastProps) {
                        props.defaultValue = text;
                    } else {
                        props.defaultValue = lastProps.defaultValue;
                    }
                }
                break;
            case "option":
            case "style":
            case "script":
                stateNode.children = [text];
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
    updateContext(fiber, text) {
        fiber.children = text
    },

    createElement(fiber) {
        return {
            type: fiber.type,
            props: props,
            children: fiber.tag === 6 ? fiber.props.children : [],
        };
    },
    insertElement(fiber) {
        let dom = fiber.stateNode,
            parentNode = fiber.parent,
            before = fiber.insertPoint,
            children = parentNode.children;
        try {
            if (before == null) {
                //要插入最前面
                if (dom !== children[0]) {
                    remove(children, dom);
                    children.unshift(dom);
                }
            } else {
                if (dom !== children[children.length - 1]) {
                    remove(children, dom);
                    var i = children.indexOf(before);
                    children.splice(i + 1, 0, dom);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    emptyElement(fiber) {
        let dom = fiber.stateNode;
        let children = dom && dom.children;
        if (dom && Array.isArray(children)) {
            children.forEach(NoopRenderer.removeElement);
        }
    },
    removeElement(fiber) {
        if (fiber.parent) {
            var parent = fiber.parent;
            var node = fiber.stateNode;
            remove(parent.children, node);
        }
    },
});
function remove(children, node) {
    var index = children.indexOf(node);
    if (index !== -1) {
        children.splice(index, 1);
    }
}
//setState把自己放进列队

function StringElement(type, props, children){
   this.type = type
   this.props = props
   this.children = []
}
StringElement.prototype = {
    toString(){
        var str = "<" + type + stringifyAttributes(props, type);
            if (voidTags[type]) {
                return str + "/>\n";
            }
            str += ">";
            if (innerHTML) {
                str += innerHTML;
            } else {
                var fakeUpdater = {
                    _reactInternalFiber: vnode
                };
                var children = fiberizeChildren(props.children, fakeUpdater);
                for (var i in children) {
                    var child = children[i];
                    child.return = vnode;
                    str += renderVNode(child, context);
                }
                vnode.updater = fakeUpdater;
            }
            return str + "</" + type + ">\n";
    }
}
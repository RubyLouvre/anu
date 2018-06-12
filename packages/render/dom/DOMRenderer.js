import { diffProps } from './props';
import { document, NAMESPACE } from './browser';
import { get, noop, extend, emptyObject, topNodes, topFibers } from 'react-core/util';
import { Renderer, createRenderer } from 'react-core/createRenderer';
import { render, createContainer } from 'react-fiber/scheduleWork';
import { fireDuplex } from './duplex';

export function createElement(vnode) {
    let p = vnode.return;
    let { type, props, ns } = vnode;
    switch (type) {
    case '#text':
        //只重复利用文本节点
        var node = recyclables[type].pop();
        if (node) {
            node.nodeValue = props;
            return node;
        }
        return document.createTextNode(props);
    case '#comment':
        return document.createComment(props);

    case 'svg':
        ns = NAMESPACE.svg;
        break;
    case 'math':
        ns = NAMESPACE.math;
        break;

    default:
        do {
            var s = p.name == 'AnuPortal' ? p.props.parent : p.tag === 5 ? p.stateNode : null;
            if (s) {
                ns = s.namespaceURI;
                if (p.type === 'foreignObject' || ns === NAMESPACE.xhtml) {
                    ns = '';
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
    } catch (e1) { /*skip*/ }
    let elem = document.createElement(type);
    let inputType = props && props.type; //IE6-8下立即设置type属性
    if (inputType) {
        try {
            elem = document.createElement('<' + type + ' type=\'' + inputType + '\'/>');
        } catch (e2) {/*skip*/ }
    }
    return elem;
}

let fragment = document.createDocumentFragment();
function emptyElement(node) {
    let children = node.childNodes;
    for (let i = 0, child; (child = children[i++]);) {
        node.removeChild(child);
    }
}
const recyclables = {
    '#text': [],
};
Renderer.middleware({
    begin: noop,
    end: fireDuplex
});

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
        if (recyclables['#text'].length < 100) {
            recyclables['#text'].push(node);
        }
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}


function insertElement(fiber) {
    let { stateNode: dom, parent } = fiber;

    try {
        let insertPoint = fiber.forwardFiber ? fiber.forwardFiber.stateNode : null;
        let after = insertPoint ? insertPoint.nextSibling : parent.firstChild;
        if (after == dom) {
            return;
        }
        if (after === null && dom === parent.lastChild) {
            return;
        }
        //插入**元素节点**会引发焦点丢失，触发body focus事件
        Renderer.inserting = fiber.tag === 5 && document.activeElement;
        parent.insertBefore(dom, after);
        Renderer.inserting = null;
    } catch (e) {
        throw e;
    }

}

/*
function injectInternals(internals) {
    var hook = getWindow().__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || !hook.inject || hook.isDisabled || !hook.supportsFiber) {
        // DevTools exists, even though it doesn't support Fiber.
        return true;
    }
    try {
        var rendererID = hook.inject(internals);
        devTool.onCommitRoot = function (fiber) {
            try{
                var root = fiber.stateNode;
                root.current = fiber;
                return hook.onCommitFiberRoot(rendererID, root);
            }catch(e){ }
        };
        devTool.onCommitUnmount = function (fiber) {
            try{
                return hook.onCommitFiberUnmount(rendererID, fiber);
            }catch(e){ }
        };
    } catch (err) { }
    return true;
}*/
  

//其他Renderer也要实现这些方法
render.Render = Renderer;
export let DOMRenderer = createRenderer({
    render,
    updateAttribute(fiber) {
        let { props, lastProps, stateNode } = fiber;
        diffProps(stateNode, lastProps || emptyObject, props, fiber);
    },
    updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props;
    },
    createElement,
    insertElement,
    emptyElement(fiber) {
        fiber.stateNode.innerHTML = '';
        emptyElement(fiber.stateNode);
    },
    unstable_renderSubtreeIntoContainer(instance, vnode, root, callback) {
        let container = createContainer(root),
            context = container.contextStack[0],
            fiber = get(instance),
            childContext;
        while (fiber.return) {
            var inst = fiber.stateNode;
            if (inst && inst.getChildContext) {
                childContext = inst.getChildContext();
                extend(context, childContext);
                break;
            }
            fiber = fiber.return;
        }
        if (!childContext && fiber.contextStack) {
            extend(context, fiber.contextStack[0]);
        }
        return Renderer.render(vnode, root, callback);
    },

    // [Top API] ReactDOM.unmountComponentAtNode
    unmountComponentAtNode(root) {
        let container = createContainer(root, true);
        let instance = container && container.hostRoot;
        if (instance) {
            Renderer.updateComponent(
                instance,
                {
                    child: null,
                },
                function () {
                    let i = topNodes.indexOf(root);
                    if (i !== -1) {
                        topNodes.splice(i, 1);
                        topFibers.splice(i, 1);
                    }
                    root._reactInternalFiber = null;
                },
                true
            );
            return true;
        }
        return false;
    },
    removeElement(fiber) {
        let instance = fiber.stateNode;
        if (instance) {
            removeElement(instance);
            if (instance._reactInternalFiber) {
                let j = topNodes.indexOf(instance);
                if (j !== -1) {
                    topFibers.splice(j, 1);
                    topNodes.splice(j, 1);
                }
            }
        }

    },
});
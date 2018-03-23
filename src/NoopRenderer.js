
import { Refs } from "./Refs";
import { updateQueue } from "./share";
//其他Renderer也要实现这些方法
var rootContainer = {
    type:"root",
    children: []
};
function cleanChildren(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.map(function (el) {
        if (el.type == "#text") {
            return el.children;
        } else {
            return {
                type: el.type,
                props: el.props,
                children: cleanChildren(el.children)
            };
        }
    });
}
var yieldData = [];
export let NoopRenderer = {
    updateAttribute(fiber) {

    },
    updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props.children;
    },
    render(vnode) {
        updateQueue.push(Object.assign({}, vnode, {
            alternate: vnode,
            effectTag: 2
        }));
        Refs.workLoop({
            timeRemaining() {
                return 2;
            }
        });
        // return instance;
    },
    getChildren() {
        return cleanChildren(rootContainer.children || []);
    },
    yield(a) {
        yieldData.push(a);
    },
    flush() {
        var ret = yieldData.concat();
        yieldData.length = 0;
        return ret;
    },
    createElement(fiber) {
        return {
            type: fiber.type,
            props: null,
            children: fiber.tag === 6 ? fiber.props.children : []
        };
    },
    insertElement(fiber) {
        let p = fiber.return,
            dom = fiber.stateNode,
            parentNode;
        if (!fiber.return && typeof dom.type === "string"  ) {

            console.log("进入这里", dom);
            rootContainer = dom;

            return;
        }
        while (p) {
            if (p.tag === 5) {
                parentNode = p.stateNode;
                console.log("break", parentNode);
                break;
            }
            p = p._return || p.return;
        }
        if (!parentNode) {
            parentNode = rootContainer;
        }
        console.log(fiber, parentNode,"!!!");
        var children = parentNode.children;
        var offset = parentNode._justInsert ? children.indexOf(parentNode._justInsert) : 0;
        parentNode._justInsert = dom;
        if (offset === 0) {
            if (children[0] === dom) {
                return;
            } else {
                children.unshift(dom);
            }
        } else {
            if (children[offset + 1] === dom) {
                return;
            } else {
                children.splice(offset + 1, 0, dom);
            }
        }
    },
    emptyElement(fiber) {
        // emptyElement(fiber.stateNode);
    },
    removeElement(fiber) {

    }
};
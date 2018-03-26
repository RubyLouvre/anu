import { get } from "./util";

//其他Renderer也要实现这些方法
function cleanChildren(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.map(function(el) {
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
var rootContainer = {
    type: "root",
    props: null,
    children: []
};
var yieldData = [];
export let NoopRenderer = {
    updateAttribute() {},
    updateContext(fiber) {
        fiber.stateNode.children = fiber.props.children;
    },
    reset() {
        rootContainer = {
            type: "root",
            props: null,
            children: []
        };
    },
    updateRoot(vnode) {
        return  {
            type: "root",
            root: true,
            stateNode: rootContainer,
            props: {
                children: vnode
            },
            tag: 5,
            alternate: get(rootContainer),
        };
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
        let dom = fiber.stateNode,
            parentNode = fiber.parent,
            before = fiber.mountPoint,
            children = parentNode.children;
        try {
            if (before == null) {
                if (dom !== children[0]) {
                    remove(children, dom);
                    children.unshift(dom);
                }
            } else {
                if (dom !== children[children.length - 1]) {
                    remove(children, dom);
                    children.push(dom);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    emptyElement(fiber) {
        // [].concat(fiber.children).forEach(NoopRenderer.removeElement);
    },
    removeElement(fiber) {
        if (fiber.parent) {
            var parent = fiber.parent;
            var node = fiber.stateNode;
            remove(parent.children, node);
        }
    }
};
function remove(children, node) {
    var index = children.indexOf(node);
    if (index !== -1) {
        children.splice(index, 1);
    }
}

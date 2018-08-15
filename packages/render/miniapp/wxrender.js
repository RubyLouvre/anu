import { noop, isFn } from "react-core/util";
import { createRenderer } from "react-core/createRenderer";
import { render } from "react-fiber/scheduleWork";
import { onComponentDispose, onComponentUpdate } from "./template";
import { onPageUpdate } from "./createPage";
import { eventSystem } from "./eventSystem";

//其他Renderer也要实现这些方法
function cleanChildren(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.map(function(el) {
        if (el.type == "#text") {
            return el.props;
        } else {
            return {
                type: el.type,
                props: el.props,
                children: cleanChildren(el.children)
            };
        }
    });
}
var autoContainer = {
    type: "root",
    appendChild: noop,
    props: null,
    children: []
};
var onEvent = /(?:on|catch)[A-Z]/;
function getEventHashCode(name, props,key) {
    var n = name.charAt(0) == "o" ? 2 : 5;
    var type = name.slice(n).toLowerCase();
    var eventCode =  props[ "data-" + type + "-fn"]
    return eventCode + (key != null ? "-" + key : "");
}
export let Renderer = createRenderer({
    render: render,
    updateAttribute(fiber) {
        let { props, lastProps } = fiber;
        let classId = props["data-class-code"];
        var instanceId = props["data-instance-code"];
        if (classId) {
            var clazz = eventSystem.classCache[classId];
            if (clazz && clazz.instances) {
                var instance = clazz.instances[instanceId];
                if (instance) {
                    //保存用户创建的事件在实例上
                    var cached =
                        instance.$$eventCached || (instance.$$eventCached = {});
                    for (let name in props) {
                        if (onEvent.test(name) && isFn(props[name])) {
                            var code = getEventHashCode(name,props, fiber.key);
                            cached[code] = props[name];
                        }
                    }
                    if (lastProps) {
                        for (let name in lastProps) {
                            if (onEvent.test(name) && !props[name]) {
                                var code = getEventHashCode(name,lastProps, fiber.key);
                                delete cached[code];
                            }
                        }
                    }
                }
            }
        }
    },

    updateContent(fiber) {
        fiber.stateNode.props = fiber.props;
    },
    onUpdate(fiber) {
        if (fiber.type.instances) {
            if (fiber.props.isPageComponent) {
                onPageUpdate(fiber);
            } else {
                onComponentUpdate(fiber);
            }
        }
    },
    onDispose(fiber) {
        if (fiber.type.instances) {
            if (!fiber.props.isPageComponent) {
                onComponentDispose(fiber);
            }
        }
    },

    getRoot() {
        return autoContainer;
    },
    getChildren() {
        return cleanChildren(autoContainer.children || []);
    },
    createElement(fiber) {
        return fiber.tag === 5
            ? {
                  type: fiber.type,
                  props: fiber.props || {},
                  children: []
              }
            : {
                  type: fiber.type,
                  props: fiber.props
              };
    },
    insertElement(fiber) {
        let dom = fiber.stateNode,
            parentNode = fiber.parent,
            forwardFiber = fiber.forwardFiber,
            before = forwardFiber ? forwardFiber.stateNode : null,
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
            children.forEach(Renderer.removeElement);
        }
    },
    removeElement(fiber) {
        if (fiber.parent) {
            var parent = fiber.parent;
            var node = fiber.stateNode;
            remove(parent.children, node);
        }
    }
});

function remove(children, node) {
    var index = children.indexOf(node);
    if (index !== -1) {
        children.splice(index, 1);
    }
}

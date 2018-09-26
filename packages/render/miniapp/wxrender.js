import { isFn, noop } from 'react-core/util';
import { createRenderer } from 'react-core/createRenderer';
import { render } from 'react-fiber/scheduleWork';
import { onComponentDispose, onComponentUpdate } from './toComponent';
import { onPageUpdate } from './toPage';
import { classCached, currentPage, delayMounts } from './utils';

var onEvent = /(?:on|catch)[A-Z]/;
function getEventHashCode(name, props, key) {
    var n = name.charAt(0) == 'o' ? 2 : 5;
    var type = name.slice(n).toLowerCase();
    var eventCode = props['data-' + type + '-uid'];
    return eventCode + (key != null ? '-' + key : '');
}
export let Renderer = createRenderer({
    render: render,
    updateAttribute(fiber) {
        let { props, lastProps } = fiber;
        let classId = props['data-class-uid'];
        var instanceId = props['data-instance-uid'];
        if (classId) {
            var clazz = classCached[classId];
            if (clazz && clazz) {
                var instance = clazz[instanceId];
                if (instance) {
                    //保存用户创建的事件在实例上
                    var cached = instance.$$eventCached || (instance.$$eventCached = {});
                    for (let name in props) {
                        if (onEvent.test(name) && isFn(props[name])) {
                            var code = getEventHashCode(name, props, props['data-key']);
                            cached[code] = props[name];
                            cached[code+'Fiber'] = fiber;
                        }
                    }
                    if (lastProps) {
                        for (let name in lastProps) {
                            if (onEvent.test(name) && !props[name]) {
                                code = getEventHashCode(name, lastProps, lastProps['data-key']);
                                delete cached[code];
                                delete cached[code+'Fiber'];
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
        var noMount = !fiber.hasMounted;
        var instance = fiber.stateNode;
        if(noMount && instance.componentDidMount){
            delayMounts.push({
                instance: instance,
                fn: instance.componentDidMount
            })
            instance.componentDidMount = noop
        }
        if (fiber.props.isPageComponent && currentPage.value.props.path != fiber.props.path){
            currentPage.value = fiber.stateNode;
            onPageUpdate(fiber);
        } else if (fiber.props.wxComponentFlag){
            onComponentUpdate(fiber);
        }
    },
    onDispose(fiber) {
        if (fiber.props.wxComponentFlag) {
            onComponentDispose(fiber);
        }
    },
    createElement(fiber) {
        return fiber.tag === 5
            ? {
                type: fiber.type,
                props: fiber.props || {},
                children: [],
			  }
            : {
                type: fiber.type,
                props: fiber.props,
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
    },
});

function remove(children, node) {
    var index = children.indexOf(node);
    if (index !== -1) {
        children.splice(index, 1);
    }
}

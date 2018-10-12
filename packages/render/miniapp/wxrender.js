import { isFn, noop, toLowerCase, get } from 'react-core/util';
import { createRenderer } from 'react-core/createRenderer';
import { render } from 'react-fiber/scheduleWork';
import { getUUID, delayMounts, updateView } from './utils';

var onEvent = /(?:on|catch)[A-Z]/;
function getEventHashCode(name, props, key) {
	var n = name.charAt(0) == 'o' ? 2 : 5;
	var type = toLowerCase(name.slice(n));
	var eventCode = props['data-' + type + '-uid'];
	return eventCode + (key != null ? '-' + key : '');
}
export let Renderer = createRenderer({
	render: render,
	updateAttribute(fiber) {
		let { props, lastProps } = fiber;
		let classId = props['data-class-uid'];
		let instance = fiber._owner; //clazz[instanceId];
		if (instance && !instance.classUid) {
			instance = get(instance)._owner;
		}

		if (instance && classId) {
			//保存用户创建的事件在实例上
			var cached = instance.$$eventCached || (instance.$$eventCached = {});
			for (let name in props) {
				if (onEvent.test(name) && isFn(props[name])) {
					var code = getEventHashCode(name, props, props['data-key']);
					cached[code] = props[name];
					cached[code + 'Fiber'] = fiber;
				}
			}
			if (lastProps) {
				for (let name in lastProps) {
					if (onEvent.test(name) && !props[name]) {
						code = getEventHashCode(name, lastProps, lastProps['data-key']);
						delete cached[code];
						delete cached[code + 'Fiber'];
					}
				}
			}
		}
	},

	updateContent(fiber) {
		fiber.stateNode.props = fiber.props;
	},
	onUpdate: function onBeforeRender(fiber) {
		var type = fiber.type;
		if (type.reactInstances) {
            var name = fiber.name;
            var instance = fiber.stateNode;
            var noMount = !fiber.hasMounted;
			if (!instance.instanceUid) {
				var uuid = 'i' + getUUID();
				instance.instanceUid = uuid;
				type[uuid] = instance;
			}
			instance.props.instanceUid = instance.instanceUid;
			if (type.wxInstances) {
				//只处理通用组件
				if (type.wxInstances.length && !instance.wx) {
					var wx = (instance.wx = type.wxInstances.shift());
					wx.reactInstance = instance;
					console.log('onBeforeRender时更新', name);
					updateView(instance);
				}
				if (!instance.wx) {
					console.log('onBeforeRender时更新', name, '没有wx');
					type.reactInstances.push(instance);
				}
			}
			if (instance.wx) {
				updateView(instance);
            }
            if (noMount && instance.componentDidMount) {
                delayMounts.push({
                    instance: instance,
                    fn: instance.componentDidMount,
                });
                instance.componentDidMount = noop;
            }
		}
	
	},
	onDispose(fiber) {
		var instance = fiber.stateNode;
		var wx = instance.wx;
		if (wx) {
			wx.reactInstance = null;
			instance.wx = null;
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

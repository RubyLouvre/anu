import { currentPage } from './utils';
export function onComponentUpdate(fiber) {
	var instance = fiber.stateNode;
	var type = fiber.type;
	instance.$pageInst = currentPage.value;
	if (!instance.__isStateless && instance.setState !== eventSystem.setState) {
		instance.setState = eventSystem.setState;
		instance.forceUpdate = eventSystem.forceUpdate;
	}
}
export function onComponentDispose(fiber) {
	var instance = fiber.stateNode;
	var type = fiber.type;
	var parentInst = instance.$parentInst;
	if (parentInst) {
		delete type[instance.instanceUid];
	}
}

var registerComponents = {};
export function useComponent(props, children) {
	var is = props.is;
	var clazz = registerComponents[is];
	delete props.is;
	var args = [].slice.call(arguments, 2);
	args.unshift(clazz, props);
	console.log('使用组件', is);
	return createElement.apply(null, args);
}
export function registerComponent(userComponent, path) {
	registerComponents[path] = userComponent;
	userComponent.instances = [];
	console.log('注册组件', path);
	return {
		properties: {
			$$list: String,
		},
		data: {
			props: {},
			state: {},
			context: {},
		},
		methods: {
			dispatchEvent: eventSystem.dispatchEvent,
		},

		lifetimes: {
			created: function() {
				console.log('add ');
				userComponent.instances.push(this);
			},
			// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
			attached: function() {
				console.log('attached');
			},

			detached: function() {
				console.log('detached');
			},
		},
	};
}
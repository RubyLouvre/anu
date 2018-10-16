import { eventSystem } from './eventSystem';
import { createElement } from 'react-core/createElement';
import { updateMiniApp, appType } from './utils';
var registerComponents = {};
export function useComponent(props) {
	var is = props.is;
	var clazz = registerComponents[is];
	delete props.is;
	var args = [].slice.call(arguments, 2);
	args.unshift(clazz, props);
	console.log('使用组件', is);
	return createElement.apply(null, args);
}

var hooksName = {
	wx: ['created', 'attached', 'detached'],
	bu: ['created', 'attached', 'detached'],
	ali: ['didMount', 'didMount', 'didUnmount'],
	quick: ['onInit', 'onReady', 'onDestroy'],
};

export function registerComponent(type, name) {
	registerComponents[name] = type;
	var reactInstances = (type.reactInstances = []);
	var wxInstances = (type.wxInstances = []);
	var hooks = [
		function created() {
			var instance = reactInstances.shift();
			if (instance) {
				console.log('created时为', name, '添加wx');
				instance.wx = this;
				this.reactInstance = instance;
			} else {
				console.log('created时为', name, '没有对应react实例');
				wxInstances.push(this);
			}
		},
		function attached() {
            if(appType == "ali"){
                created.call(this)
            }
			if (this.reactInstance) {
				updateMiniApp(this.reactInstance);
				console.log('attached时更新', name);
			} else {
				console.log('attached时无法更新', name);
			}
		},
		function detached() {
			this.reactInstance = null;
		},
	];
	var data = {
		props: {},
		state: {},
		context: {},
	};
	var config = {
		data: data,
		public: data,
		dispatchEvent: eventSystem.dispatchEvent,
		methods: {
			dispatchEvent: eventSystem.dispatchEvent,
		},
	};
	hooksName[appType].forEach(function(name, index) {
		config[name] = hooks[index];
	});

	return config;
}

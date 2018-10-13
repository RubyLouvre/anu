import { eventSystem } from './eventSystem';
import { createElement } from 'react-core/createElement';
import { updateMiniApp } from './utils';
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
export function registerComponent(type, name) {
    registerComponents[name] = type;
	var reactInstances = (type.reactInstances = []);
	var wxInstances = (type.wxInstances = []);
	console.log('注册', name, '组件');
	return {
		data: {
			props: {},
			state: {},
			context: {},
		},
		methods: {
			dispatchEvent: eventSystem.dispatchEvent,
		},
		lifetimes: {
			created: function created() {
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
			attached: function attached() {
				if (this.reactInstance) {
					updateMiniApp(this.reactInstance);
					console.log('attached时更新', name);
				} else {
					console.log('attached时无法更新', name);
				}
			},
			detached: function detached() {
				this.reactInstance = null;
			},
		},
	};
}
import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { Component } from 'react-core/Component';
import { isFn, noop, get, miniCreateClass } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { newData, delayMounts, setState, forceUpdate, updateView } from './utils';


const HookMap = {
	onShow: 'componentDidShow',
	onHide: 'componentDidHide',
	onUnload: 'componentWillUnmount',
};


var appStore;
var Provider = miniCreateClass(
	function Provider(props) {
		this.store = props.store;
	},
	Component,
	{
		getChildContext: function getChildContext() {
			return { store: this.store };
		},
		render: function render$$1() {
			return this.props.children;
		},
	}
);
export function applyAppStore(store) {
	appStore = store;
}
export function registerPage(PageClass, path, testObject) {
	console.log(path, '注册页面');
	var pageInstance,
		pageViewInstance,
		config = {
			data: newData(),
			dispatchEvent: eventSystem.dispatchEvent,
			onLoad(query) {
				console.log('开始载入页面',path);
				var topComponent = createElement(PageClass, {
					path: path,
					query: query,
				});
				if (appStore) {
					topComponent.props.wxComponentFlag = true;
					topComponent = createElement(
						Provider,
						{
							path: path,
							store: appStore,
						},
						topComponent
					);
				}
				topComponent.props.isPageComponent = true;
				pageInstance = render(topComponent, {
					type: 'page',
					props: {},
					children: [],
					root: true,
					appendChild: noop,
				});
				pageViewInstance = pageInstance;
				while (!pageViewInstance.classUid) {
					var fiber = get(pageViewInstance).child;
					if (fiber && fiber.stateNode) {
						pageViewInstance = fiber.stateNode;
					}
				}
				this.reactInstance = pageViewInstance;
				pageViewInstance.wx = this;

				pageViewInstance.setState = setState;
				pageViewInstance.forceUpdate = forceUpdate;
				updateView(pageViewInstance)
			
			},
			onReady() {
				console.log('页面布局完成',path);
				var el;
				while ((el = delayMounts.shift())) {
					el.fn.call(el.instance);
					el.instance.componentDidMount = el.fn;
				}
			},
		};
	Array(
		'onPageScroll',
		'onShareAppMessage',
		'onReachBottom',
		'onPullDownRefresh',
		'onShow',
		'onHide',
		'onUnload'
	).forEach(function(hook) {
		config[hook] = function() {
			var name = HookMap[hook] || hook;
			var fn = pageViewInstance[name];
			if (isFn(fn)) {
				return fn.apply(pageViewInstance, arguments);
			}
		};
	});
	if (testObject) {
		config.setData = function(obj) {
			config.data = obj;
		};
		config.onLoad();
		return config;
	}
	return config;
}

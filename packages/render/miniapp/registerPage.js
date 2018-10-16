import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { isFn, noop } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { newData, delayMounts, updateMiniApp } from './utils';

const HookMap = {
	onShow: 'componentDidShow',
	onHide: 'componentDidHide',
	onUnload: 'componentWillUnmount',
};

export function applyAppStore() {
	console.log('此方法已废弃');
}
export function registerPage(PageClass, path, testObject) {
	PageClass.reactInstances = [];
	console.log(path, '注册页面');
	var pageViewInstance,
		config = {
			data: newData(),
			dispatchEvent: eventSystem.dispatchEvent,
			onLoad: function onLoad(query) {
				console.log('开始载入页面', path);
				pageViewInstance = render(
					createElement(PageClass, {
						path: path,
						query: query,
						isPageComponent: true,
					}),
					{
						type: 'page',
						props: {},
						children: [],
						root: true,
						appendChild: noop,
					}
				);

				this.reactInstance = pageViewInstance;
				pageViewInstance.wx = this;
				//	pageViewInstance.setState = setState;
				//	pageViewInstance.forceUpdate = forceUpdate;
				console.log('更新页面数据', path);
				updateMiniApp(pageViewInstance);
			},
			onReady: function onReady() {
				console.log('页面布局完成', path);
				var el;
				while ((el = delayMounts.pop())) {
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

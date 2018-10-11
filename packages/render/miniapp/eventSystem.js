import { returnFalse,get } from 'react-core/util';
import { classCached } from './utils';
import { Renderer } from 'react-core/createRenderer';

export var eventSystem = { //hijack
    setState: function(state, cb) {
		console.log(state);
		eventSystem.hackSetState(this);
		this.updater.enqueueSetState(this, state, cb);
	},
	forceUpdate: function(cb) {
		eventSystem.hackSetState(this);
		this.updater.enqueueSetState(this, true, cb);
	},
	hackSetState: function(instance) {
		var fiber = get(instance);
		var queue = fiber.updateQueue;
		if (!queue.pendingStates.length) {
			var cbs = queue.pendingCbs;
			cbs.push(function() {
				instance.wx.setData({
					props: instance.props,
					context: instance.context,
					state: instance.state,
				});
			});
		}
	},
	dispatchEvent: function(e) {
		var target = e.currentTarget;
		var dataset = target.dataset || {};
		var eventUid = dataset[e.type + 'Uid'];
		var instance = this.reactInstance;
		if (!instance) {
			return;
		}
		if (!instance.$$eventCached) {
			return;
		}
		var fiber = instance.$$eventCached[eventUid + 'Fiber'];
		if (e.type == 'change' && fiber) {
			if (fiber.props.value + '' == e.detail.value) {
				return;
			}
		}
		var key = dataset['key'];
		eventUid += key != null ? '-' + key : '';
		if (instance) {
			Renderer.batchedUpdates(function() {
				try {
					var fn = instance.$$eventCached[eventUid];
					fn && fn.call(instance, createEvent(e, target));
				} catch (err) {
					console.log(err.stack);
				}
			}, e);
		}
	},
};
//创建事件对象
function createEvent(e, target) {
    var event = {};
    if (e.detail) {
        event.detail = e.detail;
        Object.assign(event, e.detail);
        Object.assign(target, e.detail);
    }
    event.stopPropagation = function() {
        // eslint-disable-next-line
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.preventDefault = returnFalse;
    event.type = e.type;
    event.currentTarget = event.target = target;
    event.touches = e.touches;
    event.timeStamp = new Date() - 0;
    return event;
}

下一代基于小程序的自定义组件机制的娜娜奇快搞出来了，核心库体积更小，支持微信，百度，支付宝与快应用的转译，

早期的组件机制是基于template标签，需要添加许多属性，需要只要一个什么传参也没有的组件标签就行了，从而压缩整価的大小

也提供命令，让业务线检测自己的代码是否超出配额

转译时会检测你的样式表是否兼容快应用的样式规则子集，强制要你使用flexbox进行布局，帮你添加各种补丁与转换单位

根据平台打包不同的业务代码，注入原本不支持的组件，

我们将继续提供一套只使用flexbox布局兼容快应用的样式表与组件库

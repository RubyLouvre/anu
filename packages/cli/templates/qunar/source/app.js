import React from '@react';
import './pages/platform/index/index';

import './pages/apis/index/index';
import './pages/apis/clipboard/index';
import './pages/apis/storage/index';
import './pages/apis/canvas/index';
import './pages/apis/canvas/strokeStyle/index';
import './pages/apis/canvas/textBaseline/index';
import './pages/apis/canvas/rect/index';
import './pages/apis/canvas/fillStyle/index';
import './pages/apis/canvas/arc/index';
import './pages/apis/canvas/globalAlpha/index';
import './pages/apis/route/index';
import './pages/apis/request/index';

import './pages/native/index/index';
import './pages/native/button/index';
import './pages/native/checkbox/index';
import './pages/native/input/index';
import './pages/native/slider/index';
import './pages/native/picker/index';
import './pages/native/radio/index';
import './pages/native/textarea/index';
import './pages/native/label/index';
import './pages/native/view/index';
import './pages/native/scrollView/index';
import './pages/native/movableView/index';
import './pages/native/swiper/index';
import './pages/native/audio/index';
import './pages/native/image/index';
import './pages/native/video/index';
import './pages/native/camera/index';

import './pages/syntax/index/index';
import './pages/syntax/extend/index';
import './pages/syntax/stateless/index';
import './pages/syntax/hooks/index';
import './pages/syntax/loop/index';
import './pages/syntax/loop2/index';
import './pages/syntax/loop3/index';
import './pages/syntax/loop4/index';
import './pages/syntax/loop5/index';
import './pages/syntax/webview/index';
import './pages/syntax/inlineStyle/index';
import './pages/syntax/if/index';
import './pages/syntax/ifcom/index';
import './pages/syntax/children/index';
import './pages/syntax/await/index';
import './pages/syntax/multiple/index';

import './pages/platform/ticketSearch/index'; 
import './pages/platform/calendar/index';
import './pages/platform/boat/index';
import './pages/platform/scenic/index';
import './pages/platform/strategy/index';
import './pages/platform/userCenter/index';
import './pages/platform/question/index/index';
import './pages/platform/question/detail/index';
import './pages/platform/cardList/index';
import './pages/platform/citySelect/index';

import './pages/platform/about/index';

import './app.scss';

class Global extends React.Component {
	config = {
	    window: {
	        backgroundTextStyle: 'light',
	        // navigationBarBackgroundColor: '#0088a4',
	        navigationBarTitleText: 'mpreact',
			navigationBarTextStyle: 'white'
	    },
	    tabBar: {
	        color: '#929292',
	        selectedColor: '#00bcd4',
	        borderStyle: 'black',
	        backgroundColor: '#ffffff',
	        list: [
	            {
	                pagePath: 'pages/platform/index/index',
	                iconPath: '/assets/image/homepage_normal.png',
	                selectedIconPath: '/assets/image/homepage_select.png',
	                text: '首页'
	            },
	            {
	                pagePath: 'pages/platform/question/index/index',
	                iconPath: '/assets/image/question_normal.png',
	                selectedIconPath: '/assets/image/question_select.png',
	                text: '问答社区'
	            },
	            {
	                pagePath: 'pages/platform/userCenter/index',
	                iconPath: '/assets/image/uc_normal.png',
	                selectedIconPath: '/assets/image/uc_select.png',
	                text: '我的'
	            }
	        ]
	    }
	};
	onCollectLogs(dataset, type, node) {
	    var page = React.getCurrentPage();
	    if (!page) {
	        return;
	    }
	    var path = page.props.path;
	    var uuid = dataset.beaconUid;
	    if (node) {
	        var xpath = [];
	        while (node.parentNode) {
	            var index = node.parentNode.children.indexOf(node);
	            xpath.unshift(index);
	            node = node.parentNode;
	        }
	        uuid = xpath.join('/');
	    }
		console.log('收集日志', path, type, uuid); //eslint-disable-line
	}
	globalData = {
	    ufo: 'ufo'
	};
	onGlobalShow() {
		console.log(React.getCurrentPage().props.path, 'onGlobalShow'); //eslint-disable-line
	}
	onGlobalLoad() {
	    if (process.env.ANU_ENV === 'quick') {
	        React.api.initStorageSync(this.globalData.__storage);
	    }
	}
	onShowMenu(pageInstance, app) {
	    //点击左上角的按扭出现菜单，这里设置 转发，设置快捷方式， 关于等功能
	    if (process.env.ANU_ENV === 'quick') {
	        var api = React.api;
	        api.showActionSheet({
	            itemList: ['转发', '添加到桌面', '关于', '取消'],
	            success: function(ret) {
	                switch (ret.index) {
	                    case 0: //分享转发
	                        var fn = pageInstance.onShareAppMessage || app.onGlobalShare;
	                        var obj = fn && fn();
	                        if (obj) {
								console.log(obj); //eslint-disable-line
	                            obj.type = obj.type || 'path';
	                            obj.data = obj.data || obj.path;
	                            obj.success =
									obj.success ||
									function(a) {
										console.log(a, '分享成功'); //eslint-disable-line
									};
	                            obj.fail =
									obj.fail ||
									function(a) {
										console.log(a, '分享失败'); //eslint-disable-line
									};
	                            api.share(obj);
	                        }
	                        break;
	                    case 1:
	                        // 保存桌面
	                        api.createShortcut();
	                        break;
	                    case 2:
	                        // 关于
	                        api.getSystemInfo({
	                            success: function(appInfo) {
	                                api.redirectTo({
	                                    url: `pages/platform/about/index?brand=${appInfo.brand}&version=${appInfo.version}`
	                                });
	                            }
	                        });
	                        break;
	                    case 3:
	                        // 取消
	                        break;
	                }
	            }
	        });
	    }
	}

	onLaunch() {
	    //针对快应用的全局getApp补丁
	    if (process.env.ANU_ENV === 'quick') {
	        var ref = Object.getPrototypeOf(global) || global;
			var _this = this;
			this.globalData = this.$def.globalData;
	        ref.getApp = function() {
	            return _this;
	        };
	    }
		console.log('App launched'); //eslint-disable-line
	}
}
//这样写相当于为每一个页面组件的外面都加上一个<Provider />，如果你想在页面上用到store里的数据，
//需要用react-redux的connect方法包一下，详见pages/syntax/redux
// React.applyAppStore(store);
// eslint-disable-next-line
export default App(new Global());

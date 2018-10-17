import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';
import { isFn, noop } from 'react-core/util';
import { eventSystem } from './eventSystem';
import { delayMounts, updateMiniApp } from './utils';
var showMenuList = [
    {
        title: '保存桌面',
        callback() {
            createShortcut();
        }
    },
    {
        title: '关于',
        callback() {
            const router = require('@system.router');
            const appInfo = require('@system.app').getInfo();
            router.push({
                uri: '/pages/About',
                params: {
                    name: appInfo.name,
                    icon: appInfo.icon
                }
            });
        }
    },
    {
        title: '取消',
        callback() {}
    }
];
/**
 * 显示菜单
 */
export function showMenu(shareObject) {
    const prompt = require('@system.prompt');
    let list =  showMenuList;
    if (shareObject) {
        list = [
            {
                title: '分享',
                callback() {
                    const share = require('@system.share');
                    share.share({
                        shareType: 0,
                        title: '标题',
                        summary: '摘要',
                        imagePath: 'xxx/xxx/xxx/share.jpg',
                        targetUrl: 'http://www.example.com',
                        platforms: ['WEIBO'],
                        success: function(data) {
                            console.log('handling success');
                        },
                        fail: function(data, code) {
                            console.log(`handling fail, code = ${code}`);
                        }
                    });
                }
            }
        ].concat(showMenuList);
    }
    //分享转发 https://doc.quickapp.cn/features/service/share.html
    prompt.showContextMenu({
        itemList: list.map(function(el) {
            return el.title;
        }),
        success: function(ret) {
            var el = list[ret.index];
            if (el) {
                el.callback();
            }
        }
    });
}
export var shareObject = {};
export function getApp() {
    return shareObject.app;
}
/**
 * 创建桌面图标
 * 注意：使用加载器测试`创建桌面快捷方式`功能时，请先在`系统设置`中打开`应用加载器`的`桌面快捷方式`权限
 */
export function createShortcut() {
    const prompt = require('@system.prompt');
    const shortcut = require('@system.shortcut');
    shortcut.hasInstalled({
        success: function(ret) {
            if (ret) {
                prompt.showToast({
                    message: '已创建桌面图标'
                });
            } else {
                shortcut.install({
                    success: function() {
                        prompt.showToast({
                            message: '成功创建桌面图标'
                        });
                    },
                    fail: function(errmsg, errcode) {
                        prompt.showToast({
                            message: `${errcode}: ${errmsg}`
                        });
                    }
                });
            }
        }
    });
}

export function registerPage(PageClass, path) {
    PageClass.reactInstances = [];
    var instance;
    var config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        eventSystem: eventSystem.dispatchEvent,
        onInit(query) {
            instance = render(
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
            transmitData(PageClass, path, instance, this);
        },
        onShow() {
            transmitData(PageClass, path, instance, this);
            var fn = this.reactInstance.componentDidShow;
            fn.call(this.reactInstance);
        },
        onReady() {
            console.log('页面布局完成', path);
            var el;
            while ((el = delayMounts.pop())) {
                el.fn.call(el.instance);
                el.instance.componentDidMount = el.fn;
            }
        },
        onMenuPress(a) {
            instance.onMenuPress && instance.onMenuPress(a);
        }
    };

    return config;
}
// shareObject的数据不是长久的，在页面跳转时，就会丢失
function transmitData(pageClass, pagePath, reactInstance, quickInstance) {
    //互相持有引用
    reactInstance.wx = quickInstance;
    quickInstance.reactInstance = reactInstance;
    //更新视图
    updateMiniApp(reactInstance);
    //关联页面的wrapper的各种事件
    var cc = reactInstance.config || pageClass.config;
    shareObject.pageConfig = cc;
    shareObject.pagePath = pagePath;
    shareObject.page = reactInstance; //React实例
    shareObject.app = quickInstance.$app.$def; //app
}

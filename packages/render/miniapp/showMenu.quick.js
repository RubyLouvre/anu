import { api }  from 'api.quick';

export function showMenu(instance, app){
    var appInfo = api.getSystemInfo();
    api.showActionSheet({
        itemList: ['转发', '保存到桌面', '关于', '取消'],
        success: function (ret) {
            switch (ret.index) {
                case 0: //分享转发
                    var fn = instance.onShareAppMessage;
                    var obj = fn && fn();
                    if (obj){
                        api.share(obj);
                    }
                    fn = app.onGlobalShare;
                    obj = fn && fn();
                    if (obj){
                        api.share(obj);
                    }
                    break;
                case 1:
                    // 保存桌面
                    createShortcut();
                    break;
                case 2:
                    // 关于
                    api.redirectTo({
                        url: 'pages/about/index',
                        params: { name: appInfo.name, icon: appInfo.icon }
                    });
                    break;
                case 3:
                    // 取消
                    break;
            }
        }
    });
}

function createShortcut () {
    var shortcut = require('@system.shortcut');
    shortcut.hasInstalled({
        success: function (ret) {
            if (ret) {
                api.showToast({ message: '已创建桌面图标' });
            } else {
                shortcut.install({
                    success: function () {
                        api.showToast({ message: '成功创建桌面图标' });
                    },
                    fail: function (errmsg, errcode) {
                        api.showToast({ message: 'error: ' + errcode + '---' + errmsg });
                    }
                });
            }
        }
    });
}
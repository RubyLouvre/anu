import { api }  from '../api.quick';
const shortcut = require('@system.shortcut');

function createShortcut () {
    shortcut.hasInstalled({
        success: function (ret) {
            if (ret) {
                api.showToast({ title: '已创建桌面图标' });
                console.log('已创建桌面图标');
            } else {
                shortcut.install({
                    success: function () {
                        api.showToast({ title: '成功创建桌面图标' });
                        console.log('成功创建桌面图标');
                    },
                    fail: function (errmsg, errcode) {
                        api.showToast({ title: 'error: ' + errcode + '---' + errmsg });
                        console.log('错误', errcode, errmsg);
                    }
                });
            }
        }
    });
}

export {
    createShortcut
}
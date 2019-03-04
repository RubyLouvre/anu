import { showToast }  from './dialog';

export function createShortcut () {
    var shortcut = require('@system.shortcut');

    shortcut.hasInstalled({
        success: function (ret) {
            if (ret) {
                showToast({ title: '已创建桌面图标' });
            } else {
                shortcut.install({
                    success: function () {
                        showToast({ title: '成功创建桌面图标' });
                    },
                    fail: function (errmsg, errcode) {
                        showToast({ title: 'error: ' + errcode + '---' + errmsg });
                    }
                });
            }
        }
    });
}

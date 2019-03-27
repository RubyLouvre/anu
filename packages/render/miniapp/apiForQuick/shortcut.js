import { showToast }  from './dialog';
//桌面图标
export function createShortcut () {
    var shortcut = require('@system.shortcut');

    shortcut.hasInstalled({
        success: function (ok) {
            if (ok) {//成功回调。参数：true 已创建，false 未创建
                showToast({ title: '已创建桌面图标' });
            } else {
                shortcut.install({
                    success: function () {
                        showToast({ title: '成功创建桌面图标' });
                    },
                    fail: function (errmsg, errcode) {
                        if (errcode === 200) {
                            showToast({ title: '请打开系统授权后再试' });
                            return;
                        }
                        console.log(errcode, errmsg);
                    }
                });
            }
        }
    });
}
import { showToast }  from './dialog';
var shortcut = require('@system.shortcut');
//桌面图标
export function createShortcut() {
    
    shortcut.hasInstalled({
        success: function success(ok) {
            if (ok) {
                showToast({ title: '已创建桌面图标' });
            } else {
                shortcut.install({
                    success: function success() {
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

export function shortcutInstall(obj) {
    return shortcut.install(obj);
}

export function hasInstalled(obj) {
    return shortcut.hasInstalled(obj);
}
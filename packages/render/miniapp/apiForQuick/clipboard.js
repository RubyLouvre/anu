const clipboard = require('@system.clipboard');
import { noop } from 'react-core/util';

// 剪切板

//设置系统剪贴板的内容

function setClipboardData({
    data: text,
    success,
    fail,
    complete
}) {
    clipboard.set({
        text,
        success: success || noop,
        fail: fail || noop,
        complete: complete || noop
    });
}

function getClipboardData({
    success,
    fail,
    complete
}) {
    clipboard.get({
        success:  function(obj) {
            success({
                data: obj.text
            });
        },
        fail: fail || noop,
        complete: complete || noop
    });
}

export {setClipboardData, getClipboardData};



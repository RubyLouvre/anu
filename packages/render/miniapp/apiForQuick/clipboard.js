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
    success = noop,
    fail = noop,
    complete = noop
}) {
    clipboard.get({
        success:  function(obj) {
            success({
                data: obj.text
            });
        },
        fail,
        complete
    });
}

export {setClipboardData, getClipboardData};



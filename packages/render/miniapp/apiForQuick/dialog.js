var prompt = require('@system.prompt');

import { noop } from 'react-core/util';
/**
 * 显示一个可以带两个按钮的弹窗
 * @param {*} obj 
 *  title	String	否	标题
    message	String	否	内容
    buttons	Array	否	按钮的数组，按钮结构：{text:'text',color:'#333333'}，
           color可选：buttons的第1项为positive button；
                     buttons的第2项（如果有）为negative button；
                     buttons的第3项（如果有）为neutral button。
                     最多支持3个button
    success	Function	否	成功回调
    cancel	Function	否	取消回调
    complete Function	否	执行结束后的回调
    showCancel Boolean true 是否显示取消按钮
 */
export function showModal(obj) {
    obj.showCancel = obj.showCancel === false ? false : true;
    var buttons = [
        {
            text: obj.confirmText,
            color: obj.confirmColor
        }
    ];
    if (obj.showCancel) {
        buttons.push({
            text: obj.cancelText,
            color: obj.cancelColor
        });
    }
    obj.buttons = obj.confirmText ? buttons : [];
    obj.message = obj.content;
    delete obj.content;
    let fn = obj['success'];
    obj['success'] = res => {
        res.confirm = !res.index;
        fn && fn(res);
    };
    prompt.showDialog(obj);
}
export function showToast(obj) {  
    obj.message = obj.title;
    obj.duration = obj.duration / 1000 >= 1 ? 1: 0;
    let success = obj.success || noop,
        fail = obj.fail || noop,
        complete = obj.complete || noop;
    try {
        prompt.showToast(obj);
        success();
    } catch (err) {
        fail(err);
    } finally {
        complete();
    }
}

export function showActionSheet(obj) {
    prompt.showContextMenu(obj);
}
export function showLoading(obj) {
    obj.message = obj.title;
    obj.duration = 1;
    prompt.showToast(obj);
}
//export function hideLoading(){}
//export function hideToast(){}



import { handleSuccess, handleFail } from '../utils';

/**
 * 电话
 * @param {string} phoneNumber 需要拨打的电话号码
 */

function makePhoneCall(options = {}) {
    return new Promise(function(resolve, reject) {
        let { 
            phoneNumber = '',
            success = () => {},
            fail = () => {},
            complete = () => {}
        } = options;
        phoneNumber = String(phoneNumber);
        if (/^\d+$/.test(phoneNumber)) {
            window.location.href = `tel:${phoneNumber}`;
            handleSuccess({
                errMsg: 'makePhoneCall: success',
                phoneNumber
            }, success, complete, resolve);
        } else {
            handleFail({
                errMsg: 'phoneNumber格式错误',
                phoneNumber
            }, fail, complete, reject);
        }
    });
}

export default {
    makePhoneCall
};

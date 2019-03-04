const payAPI = require('@service.pay');
const wxpayAPI = require('@service.wxpay');
const alipayAPI = require('@service.alipay');

export function pay(obj) { 
    payAPI.pay(obj);
}
//获取服务提供商
export function getProvider() {
<<<<<<< HEAD
    return payAPI.getProvider();
}

export function wxpayGetType() {
    return wxpayAPI.getType();
=======
    return payAPI.getProvider()
}

export function wxpayGetType() {
    return wxpayAPI.getType()
>>>>>>> faa22cfc28c7655e48ebe7a81cd80e516a34e1f0
}

export function wxpay(obj) {
    wxpayAPI.pay(obj);
}

export function alipay(obj) {
    alipayAPI.pay(obj);
}
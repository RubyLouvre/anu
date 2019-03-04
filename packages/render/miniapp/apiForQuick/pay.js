const payAPI = require('@service.pay');
const wxpayAPI = require('@service.wxpay');
const alipayAPI = require('@service.alipay');

export function pay(obj) { 
    payAPI.pay(obj);
}
//获取服务提供商
export function getProvider() {
    return payAPI.getProvider();
}

export function wxpayGetType() {
    return wxpayAPI.getType();
}

export function wxpay(obj) {
    wxpayAPI.pay(obj);
}

export function alipay(obj) {
    alipayAPI.pay(obj);
}
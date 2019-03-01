const payAPI = require('@service.pay')
const wxpayAPI = require('@service.wxpay')
const alipayAPI = require('@service.alipay')

export function pay(obj) {
    
    payAPI.pay(obj)
}

export function getProvider() {
    payAPI.getProvider()
}

export function wxpayGetType() {
    wxpayAPI.getType()
}

export function wxpay() {
    wxpayAPI.pay()
}

export function alipay() {
    alipayAPI.pay()
}
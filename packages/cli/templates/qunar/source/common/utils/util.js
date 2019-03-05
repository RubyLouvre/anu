import React from '@react';
// 返回全局对象
function getGlobalInfo() {
    const json = React.api.getStorageSync('UserData');
    if (!json || json === '[object Object]') {
        return {user: {}, cookies: {}};
    }
    if (typeof(json) === 'string') {
        try {
            return JSON.parse(React.api.getStorageSync('UserData'));
        } catch (err) {
            return {user: {}, cookies: {}};
        }

    }
    if (process.env.ANU_ENV.ANU_ENV === 'quick') {
        // eslint-disable-next-line
        console.log('注意！！！！快应用不支持同步拿缓存，请切换getGlobalInfoAsync方法');
    }
    return React.api.getStorageSync('UserData');
}
// 快应用 异步
async function getGlobalInfoAsync() {
    return new Promise((resolve, reject) => {
        React.api.getStorage({
            key: 'UserData',
            success: res => {
                // eslint-disable-next-line
                console.log('异步拿缓存数据', res.data);
                resolve(res.data || {user: {}, cookies: {}, extraCookie: {}});
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
async function getGlobalInfoAsyncByKey(key) {
    return new Promise((resolve, reject) => {
        React.api.getStorage({
            key,
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
// 返回系统信息 快应用没有同步方法 首页获取会因底bar导致高度拿错
async function getSystemInfo () {
    return new Promise((resolve, reject) => {
        React.api.getSystemInfo({
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
// 快应用 返回IME号
async function getDeviceId() {
    return new Promise((resolve, reject) => {
        React.api.getDeviceId({
            success: res => {
                resolve(res.deviceId);
                updateUserInfo({
                    cookies: {
                        andid: res.deviceId
                    }
                });
            },
            fail: err => {
                reject(err);
                updateUserInfo({
                    cookies: {
                        andid: ''
                    }
                });
            }
        });
    });
}
async function updateUserInfo(data) {
    if (!data) {
        return;
    }
    const storage = await getGlobalInfoAsync();
    const { cookies, user, extraCookie } = storage;
    // 如果带了登录态，替换
    let newCookies = data.cookies || {};
    let newUser = data.user || {};
    for (let k in newCookies) {
        cookies[k] = newCookies[k];
    }
    for (let k in newUser) {
        user[k] = newUser[k];
    }
    let UserData = { cookies: cookies, user: user, extraCookie };
    React.api.setStorage({
        key: 'UserData',
        data: UserData
    });
}
Date.prototype.format = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
            );
        }
    }
    return fmt;
};

function isEmptyString(property) {
    return !property || property.length === 0;
}

function isEmptyArray(array) {
    return !array || array.length === 0;
}

function isEmptyObject(obj) {
    for (var key in obj) {
        return !key;
    }
    return true;
}

function isValidPhone(phoneNumber) {
    return phoneNumber.length == 11 && phoneNumber.charAt(0) == '1';
}

function stringifyURLParam(param) {
    var rstString = '';
    for (var key in param) {
        rstString += `${key}=${param[key]}&`;
    }
    rstString = rstString.substr(0, rstString.length - 1);
    return rstString;
}

function parseURLParam(param) {
    var rst = {};
    for (var key in param) {
        rst[key] = JSON.parse(param[key]);
    }
    return rst;
}

function mixin(sub = {}, sup = {}) {
    for (const name in sup) {
        if (name == 'data') {
            sub.data = Object.assign(sub.data || {}, sup.data);
        } else if (sub[name] === undefined) {
            sub[name] = sup[name];
        }
    }

    return sub;
}

function queryToParam(query) {
    const params = {};
    const arr = query.split('&');
    let key, value;
    for (var i = 0; i < arr.length; i++) {
        [key = '', value = ''] = arr[i].split('=');
        // 给对象赋值
        params[key] = value;
    }
    return params;
}

function queryToCookie(query){
    const params = {};
    const arr = query.split(';');
    let key, value;
    for (var i = 0; i < arr.length; i++) {
        const _index = arr[i].indexOf('=');
        key = arr[i].slice(0,_index);
        value = arr[i].slice(_index+1);
        // 给对象赋值
        params[key] = value;
    }
    return params;
}

var debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
    // 据上一次触发时间间隔
        var last = new Date() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = new Date();
        var callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
};
// [{A: []}, {B: []}] ==> [{key: 'A', value: []}, {key: 'B', value: []}]
var arrayTransform = function(arr) {
    return arr.map(function(item) {
        let obj = {};
        for (let i in item) {
            obj.key = i;
            obj.value = item[i];
            break;
        }

        return obj;
    });
};

function json_parse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}


function openWebview({url='', params={}, loginSync=false}){

    if (Object.keys(params).length){
        url += url.indexOf('?')!== -1 ?'&':'?' + stringifyURLParam(params);
    }


    url = encodeURIComponent(url);

    React.api.navigateTo({
        url: `/pages/platform/webView/index?url=${url}&loginSync=${loginSync}`
    });
}

function toPay({cashierUrl}){

    cashierUrl = encodeURIComponent(cashierUrl);

    React.api.navigateTo({
        url: `/pages/platform/pay/index?cashierUrl=${cashierUrl}`
    });
}

// copy自度假项目
// iphone机型model定义，详见：
// https://everyi.com/by-identifier/ipod-iphone-ipad-specs-by-model-identifier.html
const iphoneModelMap = {
    JUST_IPHONE: '',
    5: '5[^\\d]?[1-4]|6[^\\d]?[1-2]',
    6: '7[^\\d]?[1-2]|8[^\\d]?[1-2]',
    SE: '8[^\\d]?4',
    7: '9[^\\d]?[1-4]',
    8: '10[^\\d]?[1-24-5]',
    X: '10[^\\d]?[36]|11[^\\d]?[2468]' // x xs xsmax xr
};

// 传具体型号（见上面key），或者不传（判断是否iphone）
const isIphone = async (model = 'JUST_IPHONE') => {
    model = model.toUpperCase();
    if (!(model in iphoneModelMap)) {
        throw new Error('暂未收录该种iPhone机型');
    }
    const cacheKey = 'iph' + model;
    if (isIphone[cacheKey]) {
        return isIphone[cacheKey];
    }
    const iPhoneRegExp = new RegExp('iPhone\\s?' + iphoneModelMap[model], 'i');
    const systemInfo = await getSystemInfo();
    const systemModel = systemInfo.model;
    return isIphone[cacheKey] = iPhoneRegExp.test(systemModel);
};
const isIphoneX = async () => await isIphone('X');

// 需要绑定到React组件实例上
const setIsIphoneX = async function() {
    const isIpx = await isIphoneX();
    this.setState({
        isIphoneX: isIpx
    });
};

export default {
    isEmptyObject: isEmptyObject,
    isEmptyArray: isEmptyArray,
    isEmptyString: isEmptyString,
    isValidPhone: isValidPhone,
    stringifyURLParam: stringifyURLParam,
    parseURLParam: parseURLParam,
    mixin,
    queryToParam,
    debounce,
    arrayTransform,
    json_parse,
    getGlobalInfo,
    openWebview,
    toPay,
    getSystemInfo,
    queryToCookie,
    getGlobalInfoAsync,
    getDeviceId,
    setIsIphoneX,
    getGlobalInfoAsyncByKey
};

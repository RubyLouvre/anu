import React from '@react';
import Requester from './requester/requester.js';
import util from './util';
const emptyFunc = () => {};

function request(obj) {
    if (process.env.ANU_ENV === 'quick') {
        React.api.getStorage({
            key: 'UserData',
            success: res => {
                quickRequest(obj, res.data);
            }
        });
        return;
    }

    const initUserData = React.api.getStorageSync('UserData');
    quickRequest(obj, initUserData);
}


function setResponseCookid(res, initUserData) {
    // 拿到 响应头的header 
    if (!res.header) return;
    const setCookie = res.header['Set-Cookie'] || res.header['set-cookie'];
    let setCookieString = '';
    if (!setCookie) return;
    if (Array.isArray(setCookie)){
        setCookie.forEach(v => {
            setCookieString = setCookieString + v + ';';
        }); 
        setCookieString = setCookieString.replace(/\s+/g,'');
    } else if (typeof(setCookie) === 'string') {
        setCookieString = setCookie.replace(/\s+/g,'');
    }
    const setCookieObj = util.queryToCookie(setCookieString);
    const oldSetCookieObj = initUserData.extraCookie || {};
    for (let k in setCookieObj){
        oldSetCookieObj[k] = setCookieObj[k];
    }
    React.api.setStorageSync('UserData',  {
        cookies: initUserData.cookies,
        user: initUserData.user,
        extraCookie: oldSetCookieObj
    } );
}

// 针对快应用不支持同步拿缓存
function quickRequest (obj, initUserData) {
    const originalSuccessCb = obj.success || emptyFunc;
    const originalFailCb = obj.fail || emptyFunc;
    const originalCompleteCb = obj.complete || emptyFunc;
    obj.header || (obj.header = {});

    // cookie处理
    const extraCookie = initUserData.extraCookie || {};
    const cookie = [];
    for (const name in initUserData.cookies) {
        cookie.push(`${name}=${ initUserData.cookies[name]}`);
    }
    for (const name in extraCookie) {
        cookie.push(`${name}=${ extraCookie[name]}`);
    }
    obj.header.cookie =  cookie.join(';');

    // 封装回调函数
    // eslint-disable-next-line
    const finalFailCb = (res, isNetworkError = true) => {
        originalFailCb(res);
    };

    // 忽略Status直接执行success，否则不为0时走fail
    const finalSuccessCb = (res) => {
        setResponseCookid(res, initUserData);
        const { data } = res;
        // 兼容火车票代码 不解构直接返回所有数据
        if (obj.returnAll){
            originalSuccessCb(res);
            return;
        }
        // ignoreStatus
        if (obj.ignoreStatus) {
            originalSuccessCb(data);
        } else {
            if (data.status === 0 || data.errcode === 0 || data.ret) {
                originalSuccessCb(data);
            } else {
                finalFailCb(data, false);
            }
        }
    };

    const finalCompleteCb = () => {
        originalCompleteCb();
    };

    obj.success = finalSuccessCb;
    obj.fail = finalFailCb;
    obj.complete = finalCompleteCb;

    Requester(obj, initUserData);
}
export default request;
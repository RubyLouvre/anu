import { runCallbacks } from '../utils.js';
var router = require('@system.router');
import { getCurrentPages } from '../getCurrentPages.quick';

var rQuery = /\?(.*)/
var urlReg = /(((http|https)\:\/\/)|(www)){1}[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;

export function getQueryFromUri(uri, query) {
    return uri.replace(rQuery, function (a, b) {
        b.split('&').forEach(function (param) {
            param = param.split('=');
            query[param[0]] = param[1];
        });
        return '';
    });
}

function createRouter(name) {
    return function (obj, inner) {
        var uri = "", params = {}, delta = 0;
        if (name === 'back') {
            delta = Object(obj).delta
            if (delta + 0 !== delta) {
                console.warn('navigateBack的传参应该为({delta: number})');
            }
        } else {
            var href = Object(obj).url || "";
            //如果是http地址, 直接跳webview
            if (urlReg.test(href)) {
                var webview = require('@system.webview');
                webview.loadUrl({
                    url: href,
                    allowthirdpartycookies: true
                });
                return;
            }
            uri = href.slice(href.indexOf('/pages') + 1);
            if (process.env.ANU_WEBVIEW) {
                var webViewRoutes = {};
                //如果是webview, 跳转到/pages/__web__view__/__web__view__.ux页面
                try {
                    webViewRoutes = require('./webviewConfig.js');
                    let effectPath = uri.split('?')[0];
                    if (webViewRoutes[effectPath]) {
                        let config = webViewRoutes[effectPath];
                        params = {
                            src: config.src || '',
                            allowthirdpartycookies: config.allowthirdpartycookies || false,
                            trustedurl: config.trustedurl || []
                        };
                    }

                } catch (err) {
                    //skip
                }
                if (webViewRoutes[uri.split('?')[0]]) {
                    uri = '/pages/__web__view__';
                }
            }
            uri = getQueryFromUri(uri, params).replace(/\/index$/, '');
            //以hap://, https?开头，是跳到其他快应用
            if (uri.charAt(0) !== '/' && !uri.test(/^(hap|https?)\:/)) {
                uri = '/' + uri;
            }
        }
        if (typeof getApp !== 'undefined') {
            var globalData = getApp().globalData;
            var queryObject = globalData.__quickQuery || (globalData.__quickQuery = {});
            var currentPages = getCurrentPages()
            switch (name) {
                case 'push':
                    currentPages.push(uri)
                    break;
                case 'replace':
                    var last = currentPages.pop()
                    delete queryObject[last]
                    if (inner === 'clear') {
                        currentPages.length = 0;
                    }
                    currentPages.push(uri);
                    break;
                case 'back':
                    while (delta) {
                        uri = currentPages.pop();
                        if (uri) {
                            delta = delta - 1;
                            console.log("DEBUG::", router.getState().path == uri)
                            params = queryObject[uri];
                        } else {
                            return
                        }
                    }
            }
        }
        if (name !== 'back') {
            queryObject[uri] = params;
        }
        router[name]({
            uri: uri,
            params: params
        });
    };
}
export var navigateTo = createRouter('push');
export var redirectTo = createRouter('replace');
export var navigateBack = createRouter('back');

//wx.reLaunch 与 wx.redirectTo()的用途基本相同， 
//只是 wx.reLaunch()先关闭了内存中所有保留的页面，再跳转到目标页面。
export var reLaunch = function (obj) {
    router.clear();
    redirectTo(obj, 'clear');
};

export function makePhoneCall({ phoneNumber, success, fail, complete }) {
    runCallbacks(function () {
        router.push({
            uri: `tel:${phoneNumber}`
        });
    }, success, fail, complete);
}




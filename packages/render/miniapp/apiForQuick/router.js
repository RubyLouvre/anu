import { runCallbacks } from '../utils.js';
import { getBrandSync } from './device'
var router = require('@system.router');
var device = require('@system.device');
function createRouter(name) {
    return function(obj) {
        var href = obj ? obj.url || obj.uri || '' : '';
        var uri = href.slice(href.indexOf('/pages') + 1);
        
        var params = {};
        var urlReg = /(((http|https)\:\/\/)|(www)){1}[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
        
        //如果是http地址, 直接跳
        if (urlReg.test(href)) {
            var webview = require('@system.webview');
            webview.loadUrl({
                url: href,
                allowthirdpartycookies: true
            });
            return;
        }

        if ( process.env.ANU_WEBVIEW ) {
            var webViewRoutes = {};
            //如果是webview, 跳转到/pages/__web__view__/__web__view__.ux页面
            try {
                webViewRoutes = require('./webviewConfig.js');
                let effectPath = uri.split('?')[0];
                if (!!webViewRoutes[effectPath]) {
                    let config = webViewRoutes[effectPath];
                    params = {
                        src: config.src || '',
                        allowthirdpartycookies: config.allowthirdpartycookies || false,
                        trustedurl: config.trustedurl || []
                    }
                }
                
            } catch (err) {
                //skip
            }

            if (webViewRoutes[uri.split('?')[0]]) {
                uri = '/pages/__web__view__';
            }
        }

       
        uri = uri.replace(/\?(.*)/, function (a, b) {
            b.split('&').forEach(function (param) {
                param = param.split('=');
                params[param[0]] = param[1];
            });
            return '';
        }).replace(/\/index$/, '');
        if (uri.charAt(0) !== '/') {
            uri = '/' + uri;
        }
        if( getBrandSync() === 'HUAWEI' && typeof getApp !== 'undefined' ){
           var globalData =  getApp().globalData;
           var queryObject = globalData.__huaweiQuery || (globalData.__huaweiQuery = {}); 
           queryObject[uri] = JSON.stringify(params);
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
export var reLaunch = function(obj){
    router.clear();
    redirectTo(obj);
} 

export function makePhoneCall({ phoneNumber, success , fail , complete  }) {
    runCallbacks(function(){
        router.push({
            uri: `tel:${phoneNumber}`
        }); 
    }, success, fail, complete);
}

import { noop } from 'react-core/util';
import { runFunction } from '../utils';
var router = require('@system.router');
function createRouter(name) {
  return function(obj) {
    var href = obj ? obj.url || obj.uri || '' : '';
    var uri = href.slice(href.indexOf('/pages') + 1);
    var webViewUrls = {};
    var webViewRoute = '';
    //from https://www.regextester.com/98192
    var urlReg = /(((http|https)\:\/\/)|(www)){1}[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
    //如果是http地址
    if (urlReg.test(href)) {
      webViewRoute = href;
    } else {
      //查找是否有webview配置
      try {
        webViewUrls = require('./webviewConfig.js');
        webViewRoute = webViewUrls[uri];
      } catch (err) {
        //eslint-disable-line
      }
    }

    //如果webViewRoute有值, 走@system.webview跳转
    if (webViewRoute) {
      var webview = require('@system.webview');
      webview.loadUrl({
        url: webViewRoute,
        allowthirdpartycookies: true
      });
      return;
    }

    //其他按普通跳转处理
   
    var params = {};
    uri = uri
      .replace(/\?(.*)/, function(a, b) {
        b.split('&').forEach(function(param) {
          param = param.split('=');
          params[param[0]] = param[1];
        });
        return '';
      })
      .replace(/\/index$/, '');
    if (uri.charAt(0) !== '/') {
      uri = '/' + uri;
    }
    router[name]({
      uri,
      params
    });
  };
}
export var navigateTo = createRouter('push');
export var redirectTo = createRouter('replace');
export var navigateBack = createRouter('back');

export function makePhoneCall(obj) {
  let phoneNumber = obj.phoneNumber;
  let success = obj.success || noop,
    fail = obj.fail || noop,
    complete = obj.complete || noop;

  try {
    router.push({
      uri: `tel:${phoneNumber}`
    });
    runFunction(success);
  } catch (error) {
    runFunction(fail, error);
  } finally {
    runFunction(complete);
  }
}

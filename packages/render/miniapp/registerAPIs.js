import { onAndSyncApis, noPromiseApis, otherApis } from './apiList';
import { noop } from 'react-core/util';

export function promisefyApis(ReactWX, facade, more) {
    const weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis, more);
    Object.keys(weApis).forEach(key => {
        var needWrapper = more[key] || facade[key] || noop;
        if (!onAndSyncApis[key] && !noPromiseApis[key]) {
            ReactWX.api[key] = function(options) { 
                var args = [].slice.call(arguments)
                if ( ! options || Object(options) !== options ) {
                    return needWrapper.apply(facade, args);
                }
                let task = null;
                let obj = Object.assign({}, options)
                args[0] = obj;
                const p = new Promise((resolve, reject) => {
                    ['fail', 'success', 'complete'].forEach(k => {
                        obj[k] = res => {
                            //执行用户自己的fail，success，complete
                            options[k] && options[k](res);
                            if (k === 'success') {
                                resolve(key === 'connectSocket' ? task: res);
                            } else if (k === 'fail') {
                                reject(res);
                            }
                        };
                    });
                    if (needWrapper === noop){
                        console.warn('平台未不支持',key, '方法');//eslint-disable-line
                    } else {
                        task = needWrapper.apply(facade, args);
                        if(task && options.getRawResult){
                            options.getRawResult(task);
                        }
                    }
                });
                
                return p;
            };
        } else {
            if (needWrapper == noop){
                ReactWX.api[key] = noop;
            } else {
                ReactWX.api[key] = function() {
                    return needWrapper.apply(facade, arguments);
                };
            }
        }
    });
}

function pxTransform(size) {
    let deviceRatio = this.api.deviceRatio;
    return parseInt(size, 10) / deviceRatio + 'rpx';
}

function initPxTransform(facade) {   
    function fallback(windowWidth){
        facade.designWidth = windowWidth;
        facade.deviceRatio = 750 / windowWidth / 2;
    }
    if (facade.getSystemInfo) {
        facade.getSystemInfo({
            success: function(res) {
                fallback(res.windowWidth);
            }
        });
    } else {
        fallback(375);
    }
}

export function registerAPIs(ReactWX, facade, override) {
    registerAPIsQuick(ReactWX, facade, override);
    initPxTransform(ReactWX.api);
    ReactWX.api.pxTransform =  ReactWX.pxTransform = pxTransform.bind(ReactWX);
}

export function registerAPIsQuick(ReactWX, facade, override) {
    if(!ReactWX.api ){ //防止多次promisefyApis
        ReactWX.api = {};
        promisefyApis(ReactWX, facade, override(facade) );
    }
}

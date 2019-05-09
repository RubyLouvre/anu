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
                            options[k] && options[k](res);
                            if (k === 'success') {
                                if (key === 'connectSocket') {
                                    resolve(task);
                                } else {
                                    resolve(res);
                                }
                            } else if (k === 'fail') {
                                reject(res);
                            }
                        };
                    });
                    if (needWrapper === noop){
                        console.warn('平台未不支持',key, '方法');//eslint-disable-line
                    } else {
                        task = needWrapper.apply(facade, args);
                    }
                });
                if (key === 'uploadFile' || key === 'downloadFile') {
                    p.progress = cb => {
                        task.onProgressUpdate(cb);
                        return p;
                    };
                    p.abort = cb => {
                        cb && cb();
                        task.abort();
                        return p;
                    };
                }
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
    ReactWX.api = {};
    promisefyApis(ReactWX, facade, override(facade) );
}

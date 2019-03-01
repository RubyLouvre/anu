import { onAndSyncApis, noPromiseApis, otherApis } from './apiList';
import { isFn, noop } from 'react-core/util';



const RequestQueue = {
    MAX_REQUEST: 5,
    queue: [],
    request(options) {
        this.push(options);
        this.run();
    },

    push(options) {
        this.queue.push(options);
    },

    run() {
        if (!this.queue.length) {
            return;
        }
        if (this.queue.length <= this.MAX_REQUEST) {
            let options = this.queue.shift();
            let completeFn = options.complete;
            var self = this;
            options.complete = function() {
                completeFn && completeFn.apply(null, arguments);
                self.run();
            };
            if (this.facade.httpRequest) {
                this.facade.httpRequest(options);
            } else if (this.facade.request) {
                this.facade.request(options);
            }
        }
    }
};

function request(options) {
    options = options || {};
    options.headers = options.headers || options.header;
    const originSuccess = options.success || noop;
    const originFail = options.fail || noop;
    const originComplete = options.complete || noop;
    const p = new Promise((resolve, reject) => {
        options.success = res => {
            //  支付宝返回字段不相同
            res.statusCode = res.status || res.statusCode;
            res.header = res.headers || res.header;
            originSuccess(res);
            resolve(res);
        };
        options['fail'] = res => {
            originFail(res);
            reject(res);
        };

        options['complete'] = res => {
            originComplete(res);
        };

        RequestQueue.request(options);
    });
    return p;
}

export function promisefyApis(ReactWX, facade, more) {
    const weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis);
    Object.keys(weApis).forEach(key => {
        var needWrapper = more[key] || facade[key] || noop;
        if (!onAndSyncApis[key] && !noPromiseApis[key]) {
            ReactWX.api[key] = options => {
                options = options || {};
              
                if ( options +'' === options ) {
                    return needWrapper(options);
                }
                let task = null;
                let obj = Object.assign({}, options);
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
                        task = needWrapper(obj);
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
    RequestQueue.facade = facade;
    ReactWX.api.request = request;
    initPxTransform(ReactWX.api);
    ReactWX.api.pxTransform =  ReactWX.pxTransform = pxTransform.bind(ReactWX);
}

export function registerAPIsQuick(ReactWX, facade, override) {
    ReactWX.api = {};
    promisefyApis(ReactWX, facade, override(facade) );
}

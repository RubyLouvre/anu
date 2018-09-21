import { onAndSyncApis, noPromiseApis, otherApis } from './apiList';

function initPxTransform() {
    var wxConfig = this.api;
    var windowWidth = 375;
    wxConfig.designWidth = windowWidth;
    wxConfig.deviceRatio = 750 / windowWidth / 2;
    if (wxConfig.getSystemInfo) {
        wxConfig.getSystemInfo({
            success: function(res) {
                windowWidth = res.windowWidth;
                wxConfig.designWidth = windowWidth;
                wxConfig.deviceRatio = 750 / windowWidth / 2;
            }
        });
    }
}

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
            options.complete = () => {
                completeFn && completeFn.apply(options, [...arguments]);
                this.run();
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
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }
    const originSuccess = options['success'];
    const originFail = options['fail'];
    const originComplete = options['complete'];
    const p = new Promise((resolve, reject) => {
        options['success'] = res => {
            originSuccess && originSuccess(res);
            resolve(res);
        };
        options['fail'] = res => {
            originFail && originFail(res);
            reject(res);
        };

        options['complete'] = res => {
            originComplete && originComplete(res);
        };

        RequestQueue.request(options);
    });
    return p;
}

function processApis(ReactWX, facade, override) {
    const weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis);
    Object.keys(weApis).forEach(key => {
        if (!onAndSyncApis[key] && !noPromiseApis[key]) {
            ReactWX.api[key] = options => {
                options = options || {};
                let task = null;
                let obj = Object.assign({}, options);
                if (typeof options === 'string') {
                    return facade[key](options);
                }
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
                    task = facade[key](obj);
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
            ReactWX.api[key] = function() {
                return facade[key].apply(facade, arguments);
            };
        }
    });

    if (override){
        Object.assign(ReactWX.api, override);
    }
}

function pxTransform(size) {
    let deviceRatio = this.api.deviceRatio;
    return parseInt(size, 10) / deviceRatio + 'rpx';
}

export function injectAPIs(ReactWX, facade) {
    ReactWX.api = {};
    processApis(ReactWX, facade);
    ReactWX.api.request = request;
    if (typeof getCurrentPages == 'function') {
        ReactWX.getCurrentPages = getCurrentPages;
    }
    if (typeof getApp == 'function') {
        ReactWX.getApp = getApp;
    }
    RequestQueue.facade = facade;
    ReactWX.initPxTransform = initPxTransform.bind(ReactWX)();
    ReactWX.pxTransform = pxTransform.bind(ReactWX);
}

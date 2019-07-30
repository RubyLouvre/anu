/* eslint no-console:0 */
import axios from 'axios';
import qs from 'qs';
import { handleSuccess, handleFail } from '../utils';

const CancelToken = axios.CancelToken;

const contentTypeMap = {
    'jpg': 'application/x-jpg',
    'jpeg': 'image/jpeg',
    'png': 'application/x-png',
    'gif': 'image/gif'
};

class BaseTask {
    constructor(fileType) {
        this._headerReceivedCallbacks = [];
        this._progressUpdateCallbacks = [];
        this._source = CancelToken.source();
        axios.defaults.headers = {
            'Content-Type': fileType && contentTypeMap[fileType] || 'application/x-www-form-urlencoded'
        };
    }
    abort() {
        this._source.cancel();
    }
    offHeadersReceived(callback) {
        
    }
    onHeadersReceived(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function!');
        }
        this._headerReceivedCallbacks.push(callback);
    }
}

class RequestTask extends BaseTask {
    constructor({
        url = '',
        method = 'get',
        data = {},
        header = {},
        responseType = 'text',
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        super();
        method = method.toLowerCase();

        Object.keys(data).forEach(key => {
            if (data[key] === '' || data[key] == null) delete data[key];
        });

        if (method === 'get') data = { params: data };
        if (method === 'post') data = qs.stringify(data);
        axios({
            method,
            url,
            data,
            headers: header,
            responseType,
            cancelToken: this._source.token
        })
            .then(res => {
                if (axios.isCancel(res)) {
                    handleFail(res.message || 'request abort!', fail, complete);
                    return;
                }
                this._headerReceivedCallbacks.forEach((cb) => {
                    cb({
                        header: res.headers
                    });
                });
                handleSuccess(res, success, complete);
            })
            .catch(err => {
                handleFail(err, fail, complete);
            });
    }
    
}

class DownloadTask extends BaseTask {
    constructor({
        url = '',
        header = '',
        formData = {},
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        let fileType = '';
        url.replace(/\.(\w+)$/, function(match, type) {
            fileType = type;
        });
        super(fileType);
        const reg = /\/([\w.]+?)$/;
        const name = url.match(reg) && url.match(reg)[1] || 'temp';

        axios({
            url,
            method: 'GET',
            responseType: 'blob',
            headers: header,
            data: getFormData(formData),
            onDownloadProgress: (progressEvent) => {
                this._progressUpdateCallbacks.forEach((cb) => {
                    cb(getProcessEventData(progressEvent));
                });
            }
        })
            .then(response => {
                if (response && response.status === 200) {
                    const url = window.URL.createObjectURL(
                        new Blob([response.data])
                    );
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    handleSuccess(response, success, complete);
                } else {
                    handleFail(response, fail, complete);
                }
            })
            .catch(err => {
                handleFail(err, fail, complete);
            });
    }
    offProgressUpdate() {}
    onProgressUpdate(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function!');
        }
        this._progressUpdateCallbacks.push(callback);
    }
}

class UploadeTask extends BaseTask {
    constructor({
        url = '',
        formData = {},
        header = {},
        filePath = new File(),
        name = 'file',
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        super();
        Object.assign(formData, {
            [name]: filePath
        });
        axios({
            method: 'post',
            url,
            data: getFormData(formData),
            headers: Object.assign(
                {},
                { 'content-type': 'multipart/form-data' },
                header
            ),
            onUploadProgress: (progressEvent) => {
                this._progressUpdateCallbacks.forEach((cb) => {
                    cb(getProcessEventData(progressEvent));
                });
            }
        })
            .then(res => {
                handleSuccess(res, success, complete);
            })
            .catch(err => {
                handleFail(err, fail, complete);
            });
    }
    offProgressUpdate() {}
    onProgressUpdate(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function!');
        }
        this._progressUpdateCallbacks.push(callback);
    }
}

axios.interceptors.response.use(
    response => {
        return response.status === 200
            ? Promise.resolve(response)
            : Promise.reject(response);
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 404:
                    error.message = '请求错误,未找到该资源';
                    break;
                case 500:
                    error.message = '服务器端出错';
                    break;
                default:
                    error.message = `未知错误: ${error.response.status}`;
            }
        }

        return Promise.resolve(error);
    }
);

function getFormData(formData) {
    let data = new FormData();

    Object.keys(formData).forEach(k => {
        data.append(k, formData[k]);
    });

    return data;
}

function getProcessEventData(nativeEvent) {
    const totalBytesWritten = nativeEvent.loaded;
    const totalBytesExpectedToWrite = nativeEvent.total;
    const progress = Math.floor(totalBytesWritten / totalBytesExpectedToWrite * 100);
    return {
        progress,
        totalBytesWritten,
        totalBytesExpectedToWrite
    };
}

/**
 * 网络请求
 *
 * @param {String} url 接口地址
 * @param {Object} data 请求的参数
 * @param {Object} header 请求的 header
 * @param {String} method HTTP 请求方法
 * @param {String} dataType 返回的数据格式
 * @param {string} responseType 响应的数据类型
 */

function request(options = {}) {
    return new RequestTask(options);
}

/**
 * 上传文件
 * @param {String} url - 接口地址
 * @param {String} filePath 要上传文件资源的File对象（与其他平台小程序不同，需要传file对象）
 * @param {String} name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 * @param {Object} formData HTTP 请求中其他额外的 form data
 */

function uploadFile(options = {}) {
    return new UploadeTask(options);
}

/**
 * 下载文件
 * @param {String} url - 接口地址
 * @param {String} filePath 指定文件下载后存储的路径
 * @param {String} name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 * @param {Object} formData HTTP 请求中其他额外的 form data
 */

function downloadFile(options = {}) {
    return new DownloadTask(options);
}

export default {
    request,
    uploadFile,
    downloadFile
};

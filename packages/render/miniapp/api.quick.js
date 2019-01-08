import { noop } from 'react-core/util';
import request from './quickApis/fetch.js';
import { uploadFile, downloadFile } from './quickApis/request.js';
import {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    clearStorageSync
} from './quickApis/storage.js';
import { getSavedFileInfo, getSavedFileList, removeSavedFile, saveFile } from './quickApis/file.js';
import { setClipboardData, getClipboardData } from './quickApis/clipboard.js';
import { getNetworkType, onNetworkStatusChange } from './quickApis/network.js';
import { getSystemInfo } from './quickApis/device.js';
import { chooseImage } from './quickApis/media.js';
import { createShortcut } from './quickApis/system.js';
import { runFunction, _getApp } from './utils';
import { showToast } from './quickApis/showToast';

import { createCanvasContext } from './quickApis/canvas.js';

function createRouter(name) {
    return function(obj) {
        const router = require('@system.router');
        const params = {};
        let href = obj ? obj.url || obj.uri || '' : '';
        let uri = href.slice(href.indexOf('/pages') + 1);
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

export var api = {
    // 交互
    showModal(obj) {
    // showCancel 默认值是 true
        obj.showCancel = obj.showCancel === false ? false : true;
        var buttons = [
            {
                text: obj.confirmText,
                color: obj.confirmColor
            }
        ];
        if (obj.showCancel) {
            buttons.push({
                text: obj.cancelText,
                color: obj.cancelColor
            });
        }
        obj.buttons = obj.confirmText ? buttons : [];
        obj.message = obj.content;
        delete obj.content;
        let fn = obj['success'];
        obj['success'] = res => {
            res.confirm = !res.index;
            fn && fn(res);
        };

        /*
        title	String	否	标题
        message	String	否	内容
        buttons	Array	否	按钮的数组，按钮结构：{text:'text',color:'#333333'}，color可选：buttons的第1项为positive button；buttons的第2项（如果有）为negative button；buttons的第3项（如果有）为neutral button。最多支持3个button
        success	Function	否	成功回调
        cancel	Function	否	取消回调
        complete Function	否	执行结束后的回调
        */
        var prompt = require('@system.prompt');
        prompt.showDialog(obj);
    },
    showToast: showToast,
    hideToast: noop,
    showActionSheet(obj) {
        var prompt = require('@system.prompt');
        prompt.showContextMenu(obj);
    },

    showLoading(obj) {
        var prompt = require('@system.prompt');
        obj.message = obj.title;
        obj.duration = 1;
        prompt.showToast(obj);
    },

    hideLoading: noop,
    // 导航
    navigateTo: createRouter('push'),
    redirectTo: createRouter('replace'),
    navigateBack: createRouter('back'),
    // 震动
    vibrateLong() {
        var vibrator = require('@system.vibrator');
        vibrator.vibrate();
    },
    vibrateShort() {
        var vibrator = require('@system.vibrator');
        vibrator.vibrate();
    },

    // 分享(小程序没有这个api)
    share(obj) {
        var share = require('@service.share');
        share.getAvailablePlatforms({
            success: function(data) {
                let shareType = 0;
                if (obj.path && obj.title) {
                    shareType = 0;
                } else if (obj.title) {
                    shareType = 1;
                } else if (obj.imageUrl) {
                    shareType = 2;
                }
                obj.shareType = obj.shareType || shareType;
                obj.targetUrl = obj.path;
                obj.summary = obj.desc;
                obj.imagePath = obj.imageUrl;
                obj.platforms = data.platforms;
                share.share(obj);
            }
        });
    },

    // 上传
    uploadFile,

    // 下载
    downloadFile,
    // 网络请求
    request,
    // 二维码
    scanCode({ success, fail, complete }) {
        const barcode = require('@system.barcode');
        barcode.scan({
            // 小米回调函数参数对象仅提供 result，不含 scanType、charSet 及 path
            success,
            fail,
            cancel: fail,
            complete
        });
    },
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    clearStorageSync,
    getSavedFileInfo,
    getSavedFileList,
    removeSavedFile,
    saveFile,
    setClipboardData,
    getClipboardData,
    // 位置
    getLocation(obj) {
        const geolocation = require('@system.geolocation');
        geolocation.getLocation(obj);
    },
    getNetworkType,
    onNetworkStatusChange,
    getSystemInfo,
    chooseImage,
    setNavigationBarTitle({ title, success, fail, complete }) {
        try {
            let currentPage = _getApp().$$page; //相当于getCurrentPage()
            currentPage.$page.setTitleBar({ text: title });

            runFunction(success);
        } catch (error) {
            runFunction(fail, error);
        } finally {
            runFunction(complete);
        }
    },
    createShortcut,
    createCanvasContext,
    stopPullDownRefresh(obj) {
        obj = obj || {};
        let success = obj.success || noop,
            fail= obj.fail|| noop,
            complete = obj.complete || noop;

        try {
            // 停止刷新没有作用
            // let currentPage = _getApp().$$page; //相当于getCurrentPage()
            // console.log('currentPage', currentPage)
            runFunction(success );
        } catch (error){
            runFunction(fail, error);
        } finally {
            runFunction(complete);
        }
    }
};

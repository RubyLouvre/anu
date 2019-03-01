import { noop } from 'react-core/util';
import { 
    uploadFile, 
    downloadFile,
    request,
} from './request.js';
import {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    clearStorageSync,
    initStorageSync
} from './storage.js';
import { 
    getSavedFileInfo,
    getSavedFileList, 
    removeSavedFile, 
    saveFile } from './file.js';
import { 
    setClipboardData, 
    getClipboardData 
} from './clipboard.js';
import { 
    getNetworkType, 
    onNetworkStatusChange 
} from './network.js';
import { 
    getSystemInfo, 
    getDeviceId 
} from './device.js';
import { chooseImage } from './media.js';
import { createShortcut } from './shortcut.js';
import { runFunction, _getApp } from '../utils';
import { 
    showModal,
    showActionSheet,
    showToast,
    hideToast,
    showLoading,
    hideLoading 
} from './dialog';
import { navigateTo, redirectTo , navigateBack } from './router';
import { vibrateLong, vibrateShort } from './vibrator';
import { share } from './share';

import { createCanvasContext } from './canvas.js';

export var facade = {
    // 交互
    showModal,
    showActionSheet,
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    // 导航
    navigateTo, 
    redirectTo , 
    navigateBack,
    // 震动
    vibrateLong, 
    vibrateShort,

    // 分享(小程序没有这个api)
    share,
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
    //存储
    setStorage,
    getStorage,
    removeStorage,
    initStorageSync,
    clearStorage,
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    clearStorageSync,
    //文件
    getSavedFileInfo,
    getSavedFileList,
    removeSavedFile,
    saveFile,
    //剪切板
    setClipboardData,
    getClipboardData,
    getDeviceId,
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
    },
    createAnimation(obj) {
        obj = obj || {};
        let success = obj.success || noop,
            fail= obj.fail|| noop,
            complete = obj.complete || noop;

        try {
            runFunction(success );
        } catch (error){
            runFunction(fail, error);
        } finally {
            runFunction(complete);
        }
    }

};
export function more(){
    return  {
        initStorageSync,
        share //分享(小程序没有这个api)
    };
} 

import { runCallbacks } from '../utils';
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
import { setNavigationBarTitle } from './title';
import { 
    getSystemInfo, 
    getDeviceId,
    getUserId
} from './device.js';
import { chooseImage } from './media.js';
import { createShortcut, hasInstalled, shortcutInstall } from './shortcut.js';
import {getPushProvider, subscribe, unsubscribe, pushOn, pushOff} from './push.js';
import { 
    showModal,
    showActionSheet,
    showToast,
    showLoading,
   
} from './dialog';
import { navigateTo, redirectTo ,reLaunch, navigateBack, makePhoneCall } from './router';
import { vibrateLong, vibrateShort } from './vibrator';
import { share } from './share';

import { createCanvasContext } from './canvas.js';

import { pay, getProvider, wxpayGetType, wxpay, alipay} from './pay.js';
import {accountGetProvider, accountAuthorize} from './account.js';
function stopPullDownRefresh({success, fail, complete } = {}) {
    // 停止刷新没有作用
    runCallbacks(Number, success, fail, complete );
}
export var facade = {
    // 交互
    showModal,
    showActionSheet,
    showToast,
    // hideToast,
    showLoading,
    // hideLoading,
    // 导航
    navigateTo, 
    redirectTo , 
    switchTab: redirectTo,
    reLaunch,
    navigateBack,
    // 震动
    vibrateLong, 
    vibrateShort,

    // 上传
    uploadFile,
    // 下载
    downloadFile,
    // 网络请求
    request,
    makePhoneCall,
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
    // initStorageSync,
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
    
    // 位置
    getLocation(obj) {
        const geolocation = require('@system.geolocation');
        geolocation.getLocation(obj);
    },
    getNetworkType,
    onNetworkStatusChange,
    getSystemInfo,
    chooseImage,
    //设置标题
    setNavigationBarTitle,
    createCanvasContext,
    stopPullDownRefresh,
    createAnimation: stopPullDownRefresh

};
export function more(){
    return  {
        initStorageSync,
        createShortcut,//快应用专用
        share, //快应用专用
        hasInstalled, //快应用专用
        shortcutInstall,//快应用专用
        getPushProvider, subscribe, unsubscribe, pushOn, pushOff,
        pay, 
        getProvider, 
        wxpayGetType, 
        wxpay, 
        alipay,
        getDeviceId,
        getUserId,
        accountGetProvider, 
        accountAuthorize
    };
} 

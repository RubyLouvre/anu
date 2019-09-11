//import apiData from './index';

export const NOTSUPPORTAPI = [
    // 位置
    'openLocation',
    'chooseLocation',
    // 剪切板
    'getClipboardData',
    // 图片
    'saveImageToPhotosAlbum',
    // 网络
    'getNetworkType',
    'onNetworkStatusChange',
    // iBeacon
    'startBeaconDiscovery',
    'stopBeaconDiscovery',
    'getBeacons',
    'onBeaconUpdate',
    'onBeaconServiceChange',
    // 键盘
    'hideKeyboard',
    // 屏幕
    'setKeepScreenOn',
    'getScreenBrightness',
    'setScreenBrightness '
];
/**
 * canIUse
 * @param {string} api Api名字
 */
/*
function canIUse(api) {
    const apis = Object.keys(apiData).map(k => k);

    return apis.indexOf(api) >= 0 && NOTSUPPORTAPI.indexOf(api) < 0;
}

export default {
    canIUse
};
*/
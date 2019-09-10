// 禁止使用 require() ！
import call from './call';
// import canIUse from './canIUse';
import canvas from './canvas';
import clipboard from './clipboard';
import file from './file';
import images from './images';
import interaction from './interaction';
import location from './location';
import previewImage from './previewImage';
import request from './request';
import scroll from './scroll';
import selectorQuery from './selectorQuery';
import storage from './storage';
import systemInfo from './systemInfo';
import vibrate from './vibrate';
import ws from './ws';
import share from './share';
import notSupport from './notSupport';

const NOTSUPPORTAPI = [
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

const interfaceNameSpaces = {
    call,
    canIUse: function(api) {
        const apis = Object.keys(apiData).map(k => k);
        return apis.indexOf(api) >= 0 && NOTSUPPORTAPI.indexOf(api) < 0;
    },
    canvas,
    clipboard,
    file,
    images,
    interaction,
    location,
    previewImage,
    request,
    scroll,
    selectorQuery,
    storage,
    systemInfo,
    vibrate,
    ws,
    share,
    notSupport
};

function extractApis(interfaceNameSpaces) {
    return Object.keys(interfaceNameSpaces).reduce(function(
        apis,
        interfaceNameSpaceName
    ) {
        return { ...apis, ...interfaceNameSpaces[interfaceNameSpaceName] };
    },
    {});
}

export default extractApis(interfaceNameSpaces);
export var more = function() {
    return extractApis(interfaceNameSpaces);
};


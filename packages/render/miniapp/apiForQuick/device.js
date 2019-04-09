const device = require('@system.device');
const DEFAULT_FONT_SIZE = 14;

function getSystemInfo(options) {
    if (!options) {
        console.error('参数格式错误');//eslint-disable-line
        return;
    }
    const {
        success, fail, complete
    } = options;

    function gotSuccessInfo({
        brand,
        manufacturer,
        model,
        product,
        osType,
        osVersionName,
        osVersionCode,
        platformVersionName,
        platformVersionCode,
        language,
        region,
        screenWidth,
        screenHeight,
        windowWidth,
        windowHeight,
        screenDensity
    }) {

        success && success({
            // 小米未提供
            pixelRatio: screenDensity,  
            brand,
            model,
            screenWidth,
            screenHeight,
            windowWidth,
            windowHeight,
            statusBarHeight: 0,
            language,
            version: platformVersionCode,
            system: osVersionCode,
            platform: platformVersionName,
            fontSizeSetting: DEFAULT_FONT_SIZE,
            SDKVersion: platformVersionCode

        });
    }



    device.getInfo({
        success: gotSuccessInfo,
        fail,
        complete
    });
}

function getDeviceId(options) {
   return device.getDeviceId(options);
}
var cacheBrand
function getBrandSync(){
    if(!cacheBrand && device.getInfoSync){
       return cacheBrand = device.getInfoSync().brand
    }else{
       return cacheBrand
    }
}
export { getSystemInfo ,getDeviceId, getBrandSync};
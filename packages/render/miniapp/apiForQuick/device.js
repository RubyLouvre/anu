const device = require('@system.device');
const DEFAULT_FONT_SIZE = 14;

function getSystemInfo({success, fail, complete}) {
    function gotSuccessInfo(rawObject) {
        let result = {
            fontSizeSetting: DEFAULT_FONT_SIZE,
        }
        for(let name in rawObject){
            result[mapName[name] || name] = rawObject[name]
        }
        success && success(result);
    }

    device.getInfo({
        success: gotSuccessInfo,
        fail,
        complete
    });
}
// https://doc.quickapp.cn/features/system/device.html
/* 快应用
brand	String	设备品牌
manufacturer	String	设备生产商
model	String	设备型号
product	String	设备代号
osType	String	操作系统名称
osVersionName	String	操作系统版本名称
osVersionCode	Integer	操作系统版本号
platformVersionName	String	运行平台版本名称
platformVersionCode	Integer	运行平台版本号
language	String	系统语言
region	String	系统地区
screenWidth	Integer	屏幕宽
screenHeight	Integer	屏幕高
windowWidth 1030+	Integer	可使用窗口宽度
windowHeight 1030+	Integer	可使用窗口高度
statusBarHeight 1030+	Integer	状态栏高度
screenDensity 1040+	Float	设备的屏幕密度
*/
var mapName = {
    platformVersionCode: "version",
    osVersionCode: "system",
    platformVersionName: "platform" ,
    platformVersionCode: "SDKVersion"
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
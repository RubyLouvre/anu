const device = require('@system.device')
const DEFAULT_FONT_SIZE = 14;

function getSystemInfo(options) {
  if (!options) {
    console.error('参数格式错误');
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
    screenHeight
  }) {

    success && success({
      // 小米未提供
      // pixelRatio,
      brand,
      model,
      screenWidth,
      screenHeight,
      windowWidth: screenWidth,
      windowHeight: screenHeight,
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
  })
}

export{ getSystemInfo }
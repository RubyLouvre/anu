/**
 * 获取当前的地理位置、速度。
 * @param {string} type wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
 * @param {String} altitude 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
 */
import { handleSuccess, handleFail } from '../utils';

function getLocation(options = {}) {
  return new Promise(function (resolve, reject) {
    const {
      altitude = false,
      success = () => {},
      fail = () => {},
      complete = () => {}
    } = options;
    // 要求https
    if (!navigator.geolocation) {
      handleFail({errMsg: new Error('无法获取位置')}, fail, complete, reject);
    }
  
    navigator.geolocation.getCurrentPosition(
      position => {
        handleSuccess(position.coords, success, complete, resolve);
      },
      err => {
        handleFail({errMsg: err.message}, fail, complete, reject);
      },
      {
        enableHighAcuracy: altitude === 'true',
        timeout: 5000
      }
    );
  });
}

function openLocation() {
  // TODO 暂时无法实现
}

function chooseLocation() {
  // TODO 暂时无法实现
}

export default {
  getLocation
};

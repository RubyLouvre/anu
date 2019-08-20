import { handleSuccess, handleFail } from '../utils';
/**
 * 长振动 400 iOS不支持
 */
function vibrateLong({ 
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function(resolve, reject) {
    if (navigator.vibrate) {
      navigator.vibrate(400);
      handleSuccess({errMsg: 'vibrateLong success'}, success, complete, resolve);
    } else {
      handleFail({errMsg: '不支持振动api'}, fail, complete, reject);
    }
  });
}

/**
 * 短振动
 */
function vibrateShort({ 
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function(resolve, reject) {
    if (navigator.vibrate) {
      navigator.vibrate(100);
      handleSuccess({errMsg: 'vibrateShort success'}, success, complete, resolve);
    } else {
      handleFail({errMsg: '不支持振动api'}, fail, complete, reject);
    }
  });
}

export default {
  vibrateLong,
  vibrateShort
};

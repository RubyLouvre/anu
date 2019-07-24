import Clipboard from 'clipboard';
import { handleSuccess, handleFail } from '../utils';

/**
 * 获取系统剪贴板的内容
 */
function getClipboardData() {
  // 暂时无法实现
}

/**
 * 设置系统剪贴板的内容
 */
function setClipboardData(options = {}) {
  return new Promise(function(resolve, reject) {
    const {
      data = '',
      success = () => {},
      fail = () => {},
      complete = () => {}
    } = options;
    try {
      const aux = document.createElement('input');
      aux.setAttribute('data-clipboard-text', data);
      new Clipboard(aux);
      aux.click();
      handleSuccess(
        {
          errMsg: 'setClipboardData success',
          data
        },
        success,
        complete,
        resolve
      );
    } catch (e) {
      handleFail(
        {
          errMsg: e
        },
        fail,
        complete,
        reject
      );
    }
  });
}

export default {
    // getClipboardData,
    setClipboardData
};

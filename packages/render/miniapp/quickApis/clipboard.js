const clipboard = require('@system.clipboard');
import { noop } from 'react-core/util';

// 剪切板

//设置系统剪贴板的内容

function setClipboardData({
  data: text,
  success,
  fail,
  complete
}) {
  clipboard.set({
    text,
    success: success || noop,
    fail: fail || noop,
    complete: complete || noop
  })
}

function getClipboardData({
  success,
  fail,
  complete
}) {

  function gotSuccess({text: data}) {
    success({
      data
    })
  }
  clipboard.get({
    success: gotSuccess,
    fail: fail || noop,
    complete: complete || noop
  })
}

export{setClipboardData, getClipboardData}



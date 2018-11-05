var request = require('@system.request');
const HTTP_OK_CODE = 200;

// 上传
function uploadFile({
  url,
  filePath,
  // 小米不支持
  name,
  header,
  // 小米不支持
  formData,
  success,
  fail,
  complete
}) {
 
  var data = [];
  Object.keys(formData).map(key => {
    let value = formData[key];
    let item = {
      value,
      name: key
    };
    data.push(item);
  });
  function successForMi({ code: statusCode, data }) {
    success({
      statusCode,
      data
    });
  }
  request.upload({
    url,
    header,
    data,
    files: [{ uri: filePath, name: name }],
    success: successForMi,
    fail,
    complete
  });
}

// 下载
function downloadFile({ url, header, success, fail, complete }) {

   // 小米回调函数参数形式和微信不一致，故进行兼容
   function downloadSuccess({ uri: tempFilePath }) {
    success({
      statusCode: HTTP_OK_CODE,
      tempFilePath
    });
  }

  // 小米需要通过 token 来监听下载进度
  function downloadTaskStarted({ token }) {
    request.onDownloadComplete({
      token,
      success: downloadSuccess,
      fail,
      complete
    });
  }
  
  request.download({
    url,
    header,
    success: downloadTaskStarted,
    fail,
    complete
  });
}

export {
  uploadFile,
  downloadFile
}
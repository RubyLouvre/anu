const fetch = require('@system.fetch');
const JSON_TYPE_STRING = 'json';

function runFunction(fn, ...args) {
  if (typeof fn == 'function') {
    fn.call(null, ...args);
  }
}
 
 // 网络请求
 function request({
  url,
  data,
  header,
  method,
  dataType = JSON_TYPE_STRING,
  // 小米不支持设置 responseType
  // responseType,
  success,
  fail,
  complete
}) {
  
  function onFetchSuccess({ code: statusCode, data, header: headers }) {
    if (dataType === JSON_TYPE_STRING) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        runFunction(fail, error);
      }
    }

    success({
      statusCode,
      data,
      headers
    });
  }

  fetch.fetch({
    url,
    data,
    header,
    method,
    success: onFetchSuccess,
    fail,
    complete
  });
}

export default request;
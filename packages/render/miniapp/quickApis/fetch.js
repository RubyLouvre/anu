const fetch = require('@system.fetch');
const JSON_TYPE_STRING = 'json';
import { runFunction, apiRunner } from '../utils';

// 网络请求
function requestCallback({
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

function requestPromise({
  url,
  data,
  header,
  method,
  dataType = JSON_TYPE_STRING,
  // 小米不支持设置 responseType
  // responseType,
  complete
}) {
  return new Promise((resolve, reject) => {
    function onFetchSuccess({ code: statusCode, data, header: headers }) {
      if (dataType === JSON_TYPE_STRING) {
        try {
          data = JSON.parse(data);
        } catch (error) {
          reject(error);
        }
      }

      resolve({
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
      fail: error => reject(error),
      complete
    });
  });
}

// export default function request(opt) => apiRunner(opt, requestCallback, requestPromise);


export default function request(opt){
  return apiRunner(opt, requestCallback, requestPromise)
}

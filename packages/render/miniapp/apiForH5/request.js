/* eslint no-console:0 */
import axios from 'axios';
import qs from 'qs';
import { handleSuccess, handleFail } from '../utils';

axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

let cancel,
  promiseArr = {};
const CancelToken = axios.CancelToken;

// axios.interceptors.request.use(
//   config => {
//     //发起请求时，取消掉当前正在进行的相同请求
//     if (promiseArr[config.url]) {
//       promiseArr[config.url]('操作取消');
//       promiseArr[config.url] = cancel;
//     } else {
//       promiseArr[config.url] = cancel;
//     }
//     return config;
//   },
//   err => {
//     console.log('请求超时!');
//     return Promise.resolve(err);
//   }
// );

axios.interceptors.response.use(
  response => {
    return response.status === 200
      ? Promise.resolve(response)
      : Promise.reject(response);
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        default:
          error.message = `未知错误: ${error.response.status}`;
      }
    }

    return Promise.resolve(error);
  }
);

function getFormData(formData) {
  let data = new FormData();

  Object.keys(formData).forEach(k => {
    data.append(k, formData[k]);
  });

  return data;
}

/**
 * 网络请求
 *
 * @param {String} url 接口地址
 * @param {Object} data 请求的参数
 * @param {Object} header 请求的 header
 * @param {String} method HTTP 请求方法
 * @param {String} dataType 返回的数据格式
 * @param {string} responseType 响应的数据类型
 */

function request({
  url = '',
  method = 'get',
  data = {},
  header = {},
  responseType = 'text',
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function(resolve, reject) {
    method = method.toLowerCase();

    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] == null) delete data[key];
    });

    if (method === 'get') data = { params: data };
    if (method === 'post') data = qs.stringify(data);
    axios({
      method,
      url,
      data,
      headers: header,
      responseType,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    })
      .then(res => {
        handleSuccess(res, success, complete, resolve);
      })
      .catch(err => {
        handleFail(err, fail, complete, reject);
      });
  });
}

/**
 * 上传文件
 * @param {String} url - 接口地址
 * @param {String} filePath 要上传文件资源的路径
 * @param {String} name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 * @param {Object} formData HTTP 请求中其他额外的 form data
 */

function uploadFile(
  url = '',
  formData = {},
  header = {},
  // filePath = '',
  // name = '',
  success = () => {},
  fail = () => {},
  complete = () => {}
) {
  return new Promise(function(resolve, reject) {
    axios({
      method: 'post',
      url,
      data: getFormData(formData),
      headers: Object.assign(
        {},
        { 'content-type': 'multipart/form-data' },
        header
      )
    })
      .then(res => {
        handleSuccess(res, success, complete, resolve);
      })
      .catch(err => {
        handleFail(err, fail, complete, reject);
      });
  });
}

/**
 * 下载文件
 * @param {String} url - 接口地址
 * @param {String} filePath 指定文件下载后存储的路径
 * @param {String} name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 * @param {Object} formData HTTP 请求中其他额外的 form data
 */

function downloadFile({
  url = '',
  name = '',
  header = '',
  formData = {},
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function(resolve, reject) {
    const reg = /\.(\w+)$/;
    name += url.match(reg) ? '.' + url.match(reg)[1] : '';

    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      headers: header,
      data: getFormData(formData)
    })
      .then(response => {
        if (response && response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', name);
          document.body.appendChild(link);
          link.click();
          handleSuccess(response, success, complete, resolve);
        } else {
          handleFail(response, fail, complete, reject);
        }
      })
      .catch(err => {
        handleFail(err, fail, complete, reject);
      });
  });
}

export default {
    request,
    uploadFile,
    downloadFile
};

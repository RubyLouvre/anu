
import io from 'socket.io-client';
import { handleSuccess, handleFail } from '../shared/utils/handleCallback';
const Err = 'ws不存在';
let socket = null;
/**
 * 创建一个 WebSocket 连接 只支持单个socket，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
 * @param {String} url 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名。
 * @param {Array} protocols 子协议数组
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 */

function connectSocket({ 
  url = '', 
  protocols, 
  header = {},
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(async function(resolve, reject) {
    try {
      if (socket) {
        await closeSocket();
      }
      socket = io(url, {
        extraHeaders: header
      });
      handleSuccess('socket created!', success, complete, resolve);
    } catch(e) {
      handleFail(e, fail, complete, reject);
    }
  });
}

/**
 * 监听 WebSocket 连接打开事件
 * @param {Function} success 连接打开事件的回调函数
 * @param {Function} fail 连接打开事件的回调函数
 */
function onSocketOpen(callback = () => {}) {
  if (!socket) return callback(Err);

  socket.on('connect', () => callback(socket.id));
}

/**
 * 关闭 WeSocket 连接
 * @param {Number} code 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。
 * @param {String} reason 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 * @param {Function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function closeSocket({
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function (resolve, reject){
    if (!socket) return handleFail(Err, fail, complete, reject);

    socket.close();
    socket = null;
    handleSuccess('socket closed.', success, complete, resolve);
  });
  
}

/**
 * 关闭 WeSocket 连接
 * @param {Object} data 需要发送的内容。
 * @param {Boolean} isBuffer 如果需要发送二进制数据，需要将入参数据经 base64 编码成 String 后赋值 data，同时将此字段设置为true，否则如果是普通的文本内容 String，不需要设置此字段
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 * @param {Function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
 */
function sendSocketMessage({
  data,
  success = () => {},
  fail = () => {},
  complete = () => {}
} = {}) {
  return new Promise(function (resolve, reject){
    if (!socket) return handleFail(Err, fail, complete, reject);

    socket.send(data, res => {
      handleSuccess(res, success, complete, resolve);
    });
  });
}

/**
 * 监听WebSocket 接受到服务器的消息事件
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 */
function onSocketMessage(callback = () => {}) {
  if (!socket) return callback(Err);

  socket.on('message', res => callback(res));
}

/**
 * 监听WebSocket 错误事件
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 */
function onSocketError(callback = () => {}) {
  if (!socket) return callback(Err);

  socket.on('error', res => callback(res));
}

/**
 * 监听WebSocket 连接关闭事件
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 */
function onSocketClose(callback = () => {}) {
  if (!socket) return callback(Err);

  socket.on('disconnect', res => callback(res));
}

export default {
  connectSocket,
  onSocketOpen,
  closeSocket,
  sendSocketMessage,
  onSocketMessage,
  onSocketError,
  onSocketClose
};

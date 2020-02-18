import io from 'socket.io-client';
import { handleSuccess, handleFail } from '../utils';
const Err = 'ws不存在';
/**
 * 创建一个 WebSocket 连接 只支持单个socket，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
 * @param {String} url 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名。
 * @param {Array} protocols 子协议数组
 * @param {Object} header HTTP 请求 Header，Header 中不能设置 Referer
 */
const sockets = [];
const MAX_SOCKET = 5;

class SocketTask {
    constructor({
        url = '',
        protocols,
        header = {},
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        if (sockets.length >= MAX_SOCKET) {
            handleFail(`当前最大socket连接数不能超过${MAX_SOCKET}`, fail, complete);
            return null;
        }
        this._socket = io(url, {
            transportOptions: {
                polling: {
                    extraHeaders: header
                }
            },
            protocols
        });
        handleSuccess('websocket connect success!', success, complete);
        sockets.push(this._socket);
    }
    send({
        data = {},
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        if (typeof data !== 'object') {
            throw new Error('type error!');
        }
        const args = Object.keys(data).map(key => data[key]);
        this._socket.send(args);
        handleSuccess('message send success!', success, complete);
    }
    close({
        code = 1000,
        reason = '',
        success = () => {},
        fail = () => {},
        complete = () => {}
    }) {
        this._socket.close();
        handleSuccess(`${code}: socket closed.${reason ? ('reason: ' + reason) : ''}`, success, complete);
    }
    onOpen(callback) {
        this._socket.on('connect', callback);
    }
    onClose(callback) {
        this._socket.on('disconnect', callback);
    }
    onError(callback) {
        this._socket.on('error', callback);
    }
    onMessage(callback) {
        this._socket.on('message', callback);
    }
}

function connectSocket(options = {}) {
    return new SocketTask(options);
}

/**
 * 监听 WebSocket 连接打开事件
 * @param {Function} success 连接打开事件的回调函数
 * @param {Function} fail 连接打开事件的回调函数
 */
function onSocketOpen(callback = () => {}) {
    if (!sockets.length) return callback(Err);

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
    if (!sockets.length) return handleFail(Err, fail, complete);
    while (sockets.length) {
        const socket = sockets.pop();
        socket.close();
    }
    handleSuccess('socket closed.', success, complete);
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
    if (!sockets.length) return handleFail(Err, fail, complete);
    sockets.forEach(socket => {
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
    if (!sockets.length) return callback(Err);
    sockets.forEach(socket => {
        socket.on('message', res => callback(res));
    });
}

/**
 * 监听WebSocket 错误事件
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 */
function onSocketError(callback = () => {}) {
    if (!sockets.length) return callback(Err);
    sockets.forEach(socket => {
        socket.on('error', res => callback(res));
    });
}

/**
 * 监听WebSocket 连接关闭事件
 * @param {Function} success 接口调用成功的回调函数
 * @param {Function} fail 接口调用失败的回调函数
 */
function onSocketClose(callback = () => {}) {
    if (!sockets.length) return callback(Err);
    sockets.forEach(socket => {
        socket.on('disconnect', res => callback(res));
    });
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

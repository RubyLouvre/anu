const ERROR_MESSAGE = '不支持 localStorage !';
import { handleSuccess, handleFail } from '../utils';

function isSupportStorage() {
    if (!window.localStorage) {
        // eslint-disable-next-line no-console
        console.log(ERROR_MESSAGE);
        return false;
    }
    return true;
}

/**
 * 将数据储存在浏览器中指定的 key 中，会覆盖掉原来该 key 对应的内容
 * @method setStorage
 * @param  {String}   key  缓存中指定的 key
 * @param  {Object/String}   data 需要存储的内容
 */
function setStorage({
    key,
    data,
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupportStorage()) {
            handleFail({ errMsg: ERROR_MESSAGE }, fail, complete, reject);
        } else {
            localStorage.setItem(key, JSON.stringify(data));
            handleSuccess({ key, data }, success, complete, resolve);
        }
    });
}

/**
 * setStorage 的同步版本
 * @method setStorageSync
 * @param  {String}   key  缓存中指定的 key
 * @param  {Object/String}   data 需要存储的内容
 */
function setStorageSync(key, data) {
    if (!isSupportStorage()) {
        return;
    }
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 获取缓存数据
 * @method getStorage
 * @param  {String}   key 缓存中指定的 key
 */
function getStorage({
    key,
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupportStorage()) {
            handleFail({ errMsg: ERROR_MESSAGE }, fail, complete, reject);
        } else {
            handleSuccess(
                { data: JSON.parse(localStorage.getItem(key)) },
                success,
                complete,
                resolve
            );
        }
    });
}

/**
 * getStorage 的同步版本
 * @method getStorageSync
 * @param  {String}         key 缓存中指定的 key
 * @return {Object/String}  key 对应的数据
 */
function getStorageSync(key) {
    if (!isSupportStorage()) {
        return;
    }
    return JSON.parse(localStorage.getItem(key));
}

/**
 * 从缓存中移除指定 key
 * @method removeStorage
 * @param  {String}      key 缓存中指定的 key
 */
function removeStorage({
    key,
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupportStorage()) {
            handleFail({ errMsg: ERROR_MESSAGE }, fail, complete, reject);
        } else {
            localStorage.removeItem(key);
            handleSuccess(null, success, complete, resolve);
        }
    });
}

/**
 * removeStorage 的同步版本
 * @method removeStorageSync
 * @param  {String}          key 缓存中指定的 key
 */
function removeStorageSync(key) {
    if (!isSupportStorage()) {
        return;
    }
    localStorage.removeItem(key);
}

/**
 * 清空缓存数据
 * @method clearStorage
 */
function clearStorage({
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupportStorage()) {
            handleFail({ errMsg: ERROR_MESSAGE }, fail, complete, reject);
        } else {
            localStorage.clear();
            handleSuccess(null, success, complete, resolve);
        }
    });
}

/**
 * clearStorage 的同步版本
 * @method clearStorageSync
 */
function clearStorageSync() {
    if (!isSupportStorage()) {
        return;
    }
    localStorage.clear();
}

// 返回 10KB 大小的字符串
function get10KBStr() {
    let str = '0123456789';
    function add(s) {
        s += str;
        if (s.length === 10240) {
            str = s;
            return;
        }
        add(s);
    }
    add(str);
    return str;
}

let LIMIT_SIZE_CACHE = -1;
// 获取 localStorage 剩余容量 KB
function getStorageUnusedSize(cb) {
    if (LIMIT_SIZE_CACHE !== -1) {
        cb(LIMIT_SIZE_CACHE);
    } else {
        const _10KBStr = get10KBStr();
        let sum = _10KBStr;
        const id = setInterval(function() {
            sum += _10KBStr;
            try {
                localStorage.removeItem('test');
                localStorage.setItem('test', sum);
            } catch (e) {
                LIMIT_SIZE_CACHE = sum.length / 1024;
                cb(LIMIT_SIZE_CACHE);
                clearInterval(id);
            }
        }, 1);
    }
}
// 获取 localStorage 使用容量 KB
// 有个奇怪的问题，localStorage.setItem('length', 100)
// localStorage.valueOf() 或 Object.keys(localStorage) 里并没有 length
// 只能使用 localStorage.getItem('length')获取到
function getStorageUsedSize() {
    const values = Object.values(localStorage.valueOf());
    return values.reduce((size, value) => value.length, 0) / 1024;
}

/**
 * getStorageInfo 的同步版本
 * @method getStorageInfoSync
 * @param  {Boolean}          [needLimitSize=false] 是否需要 storage 限制的空间大小
 * @return {Object}                                 keys，currentSize，limitSize
 */
async function getStorageInfoSync(needLimitSize = false) {
    const result = await getStorageInfo({ needLimitSize });
    return result;
}

/**
 * 获取当前 storage 的相关信息
 * 由于 limitSize 采用的是不断向 storage 添加直至添满来得到的，耗费性能和时间(只在第一次，之后使用缓存值)，所以需要的时候传入 needLimitSize 为 true
 * 第一次要等待 10多秒。。。
 * @method getStorageInfo
 * @param  {Boolean}       needLimitSize 是否需要 storage 限制的空间大小
 */
function getStorageInfo({
    needLimitSize = false,
    success = () => {},
    fail = () => {},
    complete = () => {}
} = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupportStorage()) {
            handleFail({ errMsg: ERROR_MESSAGE }, fail, complete, reject);
            return;
        }
        const result = {
            keys: Object.keys(localStorage),
            currentSize: getStorageUsedSize()
        };
        if (needLimitSize) {
            getStorageUnusedSize(unUsedSize => {
                handleSuccess(
                    {
                        ...result,
                        limitSize: result.currentSize + unUsedSize
                    },
                    success,
                    complete,
                    resolve
                );
            });
        } else {
            handleSuccess(result, success, complete, resolve);
        }
    });
}

export default {
    setStorage,
    setStorageSync,
    getStorage,
    getStorageSync,
    removeStorage,
    removeStorageSync,
    clearStorage,
    clearStorageSync,
    getStorageInfo,
    getStorageInfoSync
};

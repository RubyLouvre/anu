const storage = require('@system.storage');
import { runFunction } from '../utils';

function setStorage({ key, data, success, fail, complete }) {
  let value = data;
  if (typeof value === 'object') {
    try {
      value = JSON.stringify(value);
    } catch (error) {
      runFunction(fail, error);
    }
  }

  storage.set({ key, value, success, fail, complete });
}

function getStorage({ key, success, fail, complete }) {
  function dataObj(data) {
    try {
      data = JSON.parse(data);
    } catch (e) {}

    success({
      data
    });
  }

  storage.get({ key, success: dataObj, fail, complete });
}

function removeStorage(obj) {
  storage.delete(obj);
}

function clearStorage(obj) {
  storage.clear(obj);
}
let storageCache = {};

function setStorageSync(key, value) {
  setStorage({
    key: key,
    data: value
  });
  return storageCache[key] = value;
}

function getStoragePromise(key) {
  return new Promise((resolve, rejects) => {
    getStorage({
      key: key,
      success: res => {
        resolve(res.data);
      },
      fail: () => {
        rejects(null);
      }
    });
  });
}

async function getStorageSync(key) {
  let value = storageCache[key];

  // 这样做不对的
  if (!value) {
    value = await getStoragePromise(key);
  }

  return value;
}

function removeStorageSync(key) {
  delete storageCache[key];
  removeStorage({key: key})
}

function clearStorageSync() {
  storageCache = {};
  clearStorage({})
}

export {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  clearStorageSync
};

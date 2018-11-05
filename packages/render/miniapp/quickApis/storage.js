const storage = require('@system.storage');
function runFunction(fn, ...args) {
  if (typeof fn == 'function') {
    fn.call(null, ...args);
  }
}

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
   return storageCache[key] = value
}

function getStorageSync(key) {
  return storageCache[key]
}

function removeStorageSync(key) {
  delete storageCache[key]
}

function clearStorageSync(key) {
  storageCache = {}
}


export { setStorage, getStorage, removeStorage, clearStorage, setStorageSync, getStorageSync, removeStorageSync,clearStorageSync  };

# 快应用下模拟同步Stroage APi

快应用没有**strorageXxxSync**，它们需要一些巧妙的方法进行模拟。但即使这样，我们也需要你在打开每个页面上初始化一下这个方法。


ReactQuick.js中的实现
```javascript
const storage = require('@system.storage')
import { noop } from 'react-core/util'

function saveParse (str) {
  try {
    return JSON.parse(str)
  } catch (err) {
    // eslint-disable-line
  }
  return str
}

function setStorage ({ key, data, success, fail = noop, complete }) {
  let value = data
  if (typeof value === 'object') {
    try {
      value = JSON.stringify(value)
    } catch (error) {
      return fail(error)
    }
  }

  storage.set({ key, value, success, fail, complete})
}

function getStorage ({ key, success, fail, complete }) {
  function dataObj (data) {
    success({
      data: saveParse(data)
    })
  }
  storage.get({ key, success: dataObj, fail, complete})
}

function removeStorage (obj) {
  storage.delete(obj)
}

function clearStorage (obj) {
  storage.clear(obj)
}

var initStorage = false
export function initStorageSync (storageCache) {
  if (typeof ReactQuick !== 'object') {
    return
  }
  var apis = ReactQuick.api; // eslint-disable-line
  var n = storage.length
  var j = 0
  for (var i = 0; i < n; i++) {
    storage.key({
      index: i,
      success: function (key) {
        storage.get({
          key: key,
          success: function (value) {
            storageCache[key] = value
            if (++j == n) {
              console.log('init storage success')
            }
          }
        })
      }
    })
  }
  apis.setStorageSync = function (key, value) {
    setStorage({
      key: key,
      data: value
    })
    return storageCache[key] = value
  }

  apis.getStorageSync = function (key) {
    return saveParse(storageCache[key])
  }

  apis.removeStorageSync = function (key) {
    delete storageCache[key]
    removeStorage({key: key})
  }
  apis.clearStorageSync = function () {
    for (var i in storageCache) {
      delete storageCache[i]
    }
    clearStorage({})
  }
}
function warnToInitStorage () {
  if (!initStorage) {
    console.log('还没有初始化storageSync'); // eslint-disable-line
  }
}
export var setStorageSync = warnToInitStorage
export var getStorageSync = warnToInitStorage
export var removeStorageSync = warnToInitStorage
export var clearStorageSync = warnToInitStorage

export { setStorage, getStorage, removeStorage, clearStorage }
```

app.js这样初始化它， 因为快应用是一个多页应用，不是SPA，只有globalData中的数据在每次页面打开时不会清空，
globalData.__storage作为一个缓存可以加快我们读写的速度。
```javascript
    globalData = {
	    ufo: 'ufo'
        __storage: {} 
	};
	onGlobalLoad() {
	    if (process.env.ANU_ENV === 'quick') {
	        React.api.initStorageSync(this.globalData.__storage);
	    }
	}
```
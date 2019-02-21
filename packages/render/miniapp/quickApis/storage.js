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
// let storageCache = {};

// function setStorageSync(key, value) {
//   setStorage({
//     key: key,
//     data: value
//   });
//   return storageCache[key] = value;
// }

// function getStoragePromise(key) {
//   return new Promise((resolve, rejects) => {
//     getStorage({
//       key: key,
//       success: res => {
//         resolve(res.data);
//       },
//       fail: () => {
//         rejects(null);
//       }
//     });
//   });
// }

// async function getStorageSync(key) {
//   let value = storageCache[key];

//   // 这样做不对的
//   if (!value) {
//     value = await getStoragePromise(key);
//   }

//   return value;
// }

// function removeStorageSync(key) {
//   delete storageCache[key];
//   removeStorage({key: key})
// }

// function clearStorageSync() {
//   storageCache = {};
//   clearStorage({})
// }

var initStorage = false;
export function initStorageSync( storageCache){
    if(typeof ReactQuick !== 'object'){
        console.log('meiyouu')
        return 
    }
    var apis = ReactQuick.api;
    var n = storage.length;
    var j =0
    for (var i = 0; i < n; i++){
        storage.key({
            index:i,
            success: function(key){
                storage.get({ 
                    key: key,
                    success: function(value){
                        storageCache[key] = value;
                        if(j++ == n) {
                            console.log('init success')
                        }
                    } 
                });
            }
        });
    }
    apis.setStorageSync = function(key, value) {
        setStorage({
            key: key,
            data: value
        });
        return storageCache[key] = value;
    };
    
    apis.getStorageSync = function(key) {
        return storageCache[key];
    };
    
    apis.removeStorageSync = function(key) {
        delete storageCache[key];
        removeStorage({key: key});
    };
    apis.clearStorageSync =  function() {
        for(var i in storageCache ){
            delete storageCache[i]
        }
        clearStorage({});
    };
}
function warnToInitStorage(){
    if (!initStorage){
        console.log('还没有初始化storageSync');
    }
}
export  var setStorageSync = warnToInitStorage
export var  getStorageSync = warnToInitStorage
export var  removeStorageSync= warnToInitStorage
 export var  clearStorageSync=  warnToInitStorage

export {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
};



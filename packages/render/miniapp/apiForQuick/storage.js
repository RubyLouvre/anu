const storage = require('@system.storage');
import { noop } from 'react-core/util';

function saveParse (str) {
    try {
        return JSON.parse(str);
    } catch (err) {
    // eslint-disable-line
    }
    return str;
}

function setStorage ({ key, data, success, fail = noop, complete }) {
    let value = data;
    if (typeof value === 'object') {
        try {
            value = JSON.stringify(value);
        } catch (error) {
            return fail(error);
        }
    }

    storage.set({ key, value, success, fail, complete});
}

function getStorage ({ key, success = noop, complete }) {
    storage.get({ 
        key, 
        success: function(data){
            success({
                data: saveParse(data)
            });
        }, 
        fail:function(){
            success({});
       }, complete});
}

function removeStorage (obj) {
    storage.delete(obj);
}

function clearStorage (obj) {
    storage.clear(obj);
}

var initStorage = false;
export function initStorageSync (storageCache) {
    if (typeof ReactQuick !== 'object') {
        return;
    }
  var apis = ReactQuick.api; // eslint-disable-line
    var n = storage.length;
    var j = 0;
    for (var i = 0; i < n; i++) {
        storage.key({
            index: i,
            success: function (key) {
                storage.get({
                    key: key,
                    success: function (value) {
                        storageCache[key] = value;
                        if (++j == n) {
                            console.log('init storage success');//eslint-disable-line
                        }
                    }
                });
            }
        });
    }
    apis.setStorageSync = function (key, value) {
        setStorage({
            key: key,
            data: value
        });
        return storageCache[key] = value;
    };

    apis.getStorageSync = function (key) {
        return saveParse(storageCache[key]);
    };

    apis.removeStorageSync = function (key) {
        delete storageCache[key];
        removeStorage({key: key});
    };
    apis.clearStorageSync = function () {
        for (var i in storageCache) {
            delete storageCache[i];
        }
        clearStorage({});
    };
}
function warnToInitStorage () {
    if (!initStorage) {
       console.log('还没有初始化storageSync'); // eslint-disable-line
    }
}
export var setStorageSync = warnToInitStorage;
export var getStorageSync = warnToInitStorage;
export var removeStorageSync = warnToInitStorage;
export var clearStorageSync = warnToInitStorage;

export { setStorage, getStorage, removeStorage, clearStorage };

export var buApis = function(api) {
    return {
        //获取当前地理位置
        getLocation: function (a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        //获取本地缓存数据
        getStorage: function(a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        //异步获取当前 storage 的相关信息。
        getStorageInfo: function(a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        //从本地缓存中异步移除指定 key。
        removeStorage: function(a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        // 清理本地数据缓存。
        clearStorage: function(a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        // 从本地相册选择图片或使用相机拍照。
        chooseImage: function(a) {
            a.success = a.success || function() {};
            return api.openLocation.apply(api, arguments);
        },
        // 预览图片。
        previewImage: function(a) {
            a.current = a.urls[a.current || 0];
            return api.previewImage.apply(api, arguments);
        }
    };
};

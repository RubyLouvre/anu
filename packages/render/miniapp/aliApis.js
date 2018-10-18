export var aliApis = function(api) {
  return {
    // 交互
    showModal: function _(a) {
      a.cancelButtonText = a.cancelText;
      a.confirmButtonText = a.confirmText;
      return api.confirm(a);
    },
    showActionSheet: function _(a) {
      a.items = a.itemList;
      return api.showActionSheet(a);
    },
    showToast: function _(a) {
      a.content = a.title;
      a.type = a.icon;
      return api.showToast(a);
    },
    showLoading: function _(a) {
      a.content = a.title;
      return api.showLoading(a);
    },
    // 导航类
    setNavigationBarTitle: function _(a) {
      return api.setNavigationBar(a);
    },
    setNavigationBarColor: function _(a) {
      return api.setNavigationBar(a);
    },
    // 图片保存到本地
    saveImageToPhotosAlbum: function _(a) {
      a.url = a.filePath;
      return api.saveImage.apply(api, arguments);
    },

    // 图片预览
    previewImage: function _(a) {
      let index = a.urls.indexOf(a.current || a.urls[0]);
      a.current = index;
      return api.previewImage.apply(api, arguments);
    },

    // 文件
    getFileInfo: function _(a) {
      a.apFilePath = a.filePath;
      return api.getFileInfo.apply(api, arguments);
    },
    getSavedFileInfo: function _(a) {
      a.apFilePath = a.filePath;
      return api.getSavedFileInfo.apply(api, arguments);
    },
    removeSavedFile: function _(a) {
      a.apFilePath = a.filePath;
      return api.removeSavedFile.apply(api, arguments);
    },
    saveFile: function _(a) {
      a.apFilePath = a.tempFilePath;
      let fn = a['success'];
      a['success'] = res => {
        res.savedFilePath = res.apFilePath;
        fn && fn(res);
      };
      return api.saveFile.apply(api, arguments);
    },
    // 位置
    openLocation: function _(a) {
      a.latitude = a.latitude + '';
      a.longitude = a.longitude + '';
      return api.openLocation.apply(api, arguments);
    },

    // 数据缓存
    getStorageSync: function _(a) {
      var k = {};
      k.key = a;
      arguments[0] = k;
      let res = api.getStorageSync.apply(api, arguments);
      return res.data || '';
    },
    setStorageSync: function _(a1, a2) {
      var k = {};
      k.key = a1;
      k.data = a2;
      arguments[0] = k;
      api.setStorageSync.apply(api, arguments);
    },
    // 上传
    uploadFile: function _(a) {
      a.fileName = a.name;
      return api.uploadFile.apply(api, arguments);
    },
    // 下载
    downloadFile: function _(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.tempFilePath = res.apFilePath;
        fn && fn(res);
      };
      return api.downloadFile.apply(api, arguments);
    },
    // 图片
    chooseImage: function _(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.tempFilePaths = res.apFilePaths;
        fn && fn(res);
      };
      return api.chooseImage.apply(api, arguments);
    },
    // 剪切板
    getClipboardData: function _(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.data = res.text;
        fn && fn(res);
      };
      return api.getClipboard.apply(api, arguments);
    },
    setClipboardData: function _(a) {
      a.text = a.data;
      return api.setClipboard.apply(api, arguments);
    },
    // 打电话
    makePhoneCall: function _(a) {
      a.number = a.phoneNumber;
      return api.makePhoneCall.apply(api, arguments);
    },

    // 扫码
    scanCode: function _(a) {
      a.hideAlbum = a.onlyFromCamera;
      a.type = (a.scanType && a.scanType[0].slice(0, -4)) || 'qr';
      let fn = a['success'];
      a['success'] = res => {
        res.result = res.code;
        fn && fn(res);
      };

      return api.scan.apply(api, arguments);
    },

    // 屏幕亮度
    setScreenBrightness: function _(a) {
      a.brightness = a.value;
      return api.setScreenBrightness.apply(api, arguments);
    }
  };
};

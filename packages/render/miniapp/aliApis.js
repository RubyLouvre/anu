export var aliApis = function(api) {
  return {
    // 交互
    showModal: function(a) {
      a.cancelButtonText = a.cancelText;
      a.confirmButtonText = a.confirmText;
      return api.confirm.apply(api, arguments);
    },
    showActionSheet: function(a) {
      a.items = a.itemList;
      return api.showActionSheet.apply(api, arguments);
    },
    showActionSheet: function(a) {
      a.content = a.title;
      a.type = a.icon;
      return api.showActionSheet.apply(api, arguments);
    },
    showLoading: function(a) {
      a.content = a.title;
      return api.showLoading.apply(api, arguments);
    },
    // 导航类
    setNavigationBarTitle: function(a) {
      a.image = null;
      a.backgroundColor = null;
      a.borderBottomColor = null;
      a.reset = null;
      return api.setNavigationBar.apply(api, arguments);
    },
    setNavigationBarColor: function(a) {
      a.image = null;
      a.title = null;
      a.borderBottomColor = null;
      a.reset = null;
      return api.setNavigationBar.apply(api, arguments);
    },
    // 图片保存到本地
    saveImageToPhotosAlbum: function(a) {
      a.url = a.filePath;
      return api.saveImage.apply(api, arguments);
    },

    // 文件
    getFileInfo: function(a) {
      a.apFilePath = a.filePath;
      return api.getFileInfo.apply(api, arguments);
    },
    getSavedFileInfo: function(a) {
      a.apFilePath = a.filePath;
      return api.getSavedFileInfo.apply(api, arguments);
    },
    removeSavedFile: function(a) {
      a.apFilePath = a.filePath;
      return api.removeSavedFile.apply(api, arguments);
    },
    saveFile: function(a) {
      a.apFilePath = a.tempFilePath;
      let fn = a['success'];
      a['success'] = res => {
        res.savedFilePath = res.apFilePath;
        fn && fn(res);
      };
      return api.saveFile.apply(api, arguments);
    },
    // 位置
    openLocation: function(a) {
      a.latitude = a.latitude + '';
      a.longitude = a.longitude + '';
      return api.openLocation.apply(api, arguments);
    },
    // 上传
    uploadFile: function(a) {
      a.fileName = a.name;
      return api.uploadFile.apply(api, arguments);
    },
    // 下载
    downloadFile: function(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.tempFilePath = res.apFilePath;
        fn && fn(res);
      };
      return api.downloadFile.apply(api, arguments);
    },
    // 图片
    chooseImage: function(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.tempFilePaths = res.apFilePaths;
        fn && fn(res);
      };
      return api.chooseImage.apply(api, arguments);
    },
    // 剪切板
    getClipboardData: function(a) {
      let fn = a['success'];
      a['success'] = res => {
        res.data = res.text;
        fn && fn(res);
      };
      return api.getClipboard.apply(api, arguments);
    },
    setClipboardData: function(a) {
      a.text = a.data;
      return api.setClipboard.apply(api, arguments);
    },
    // 打电话
    makePhoneCall: function(a) {
      a.number = a.phoneNumber;
      return api.makePhoneCall.apply(api, arguments);
    },

    // 屏幕亮度
    setScreenBrightness: function(a) {
      a.brightness = a.value;
      return api.setScreenBrightness.apply(api, arguments);
    }
  };
};

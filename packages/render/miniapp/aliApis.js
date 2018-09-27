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

    showLoading: function() {
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
      a.apFilePath = a.filePath;
      return api.saveFile.apply(api, arguments);
    }
  };
};

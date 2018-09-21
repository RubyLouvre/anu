export var aliApis = function(api) {
  return {
    showModal: function() {
      const { cancelText, confirmText } = arguments[0];
      arguments[0].cancelButtonText = cancelText;
      arguments[0].confirmButtonText = confirmText;
      return api.confirm.apply(api, arguments);
    },

    showActionSheet: function() {
      const { itemList } = arguments[0];
      arguments[0].items = itemList;
      return api.showActionSheet.apply(api, arguments);
    },
    showActionSheet: function() {
      const { title, icon } = arguments[0];
      arguments[0].content = title;
      arguments[0].type = icon;
      return api.showActionSheet.apply(api, arguments);
    },

    showLoading: function() {
      const { title } = arguments[0];
      arguments[0].content = title;
      return api.showLoading.apply(api, arguments);
    }
  };
};

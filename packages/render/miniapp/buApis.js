export var buApis = function(api) {
    return {
        showActionSheet: function (options) {
            var { success, complete } = options;
            success && (options.success = function (res = {}) {
                success.call(api, { index: res.tapIndex });
            });
            complete && (options.complete = function (res = {}) {
                complete.call(api, { index: res.tapIndex });
            });
            return api.showActionSheet.call(api, options);
        }
    };
};

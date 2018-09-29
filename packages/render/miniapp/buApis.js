export var buApis = function(api) {
    return {
        showActionSheet: function(a) {
            var { success, complete } = a;
            success && (a.success = function (res = {}) {
                success.call(api, { index: res.tapIndex });
            });
            complete && (a.complete = function (res = {}) {
                complete.call(api, { index: res.tapIndex });
            });
            return api.showActionSheet.apply(api, arguments);
        }
    };
};

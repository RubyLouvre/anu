export var buApis = function(api) {
    return {
        // 界面交互
        showActionSheet: function _(a) {
            var success = a['success'],
                complete = a['complete'];
            a['success'] = res => {
                success && success({ index: res.tapIndex });
            };
            a['complete'] = res => {
                complete && complete({ index: res.tapIndex });
            };
            return api.showActionSheet.apply(api, arguments);
        },
        // websocket
        connectSocket: function _(a) {
            a.protocolsArray = a.protocols;
            return api.connectSocket.apply(api, arguments);
        }
    };
};

import { noop } from 'react-core/util';

export var more = function(api) {
    return {
        // 界面交互
        showActionSheet: function _(a) {
            var success = a.success,
                complete = a.complete;
            a.success = res => {
                success && success({ index: res.tapIndex });
            };
            a.complete = res => {
                complete && complete({ index: res.tapIndex });
            };
            return api.showActionSheet.apply(api, arguments);
        },
        // websocket
        connectSocket: function _(a) {
            a.protocolsArray = a.protocols;
            return api.connectSocket.apply(api, arguments);
        },
        showLoading: function _(a) {
            a = a || {};
            a.title =  a.title || '加载中...';
            return api.showLoading(a);
        },
        setMetaDescription: function _(a) {
            let defailt = {
                content: '',
                success: noop,
                fail: noop,
                complete: noop
            };
            let options = Object.assign(defailt, a);
            return api.setMetaDescription && api.setMetaDescription(options);
        },
        setMetaKeywords: function _(a) {
            let defailt = {
                content: '',
                success: noop,
                fail: noop,
                complete: noop
            };
            let options = Object.assign(defailt, a);
            return api.setMetaKeywords && api.setMetaKeywords(options);
        },
        setDocumentTitle: function _(a) {
            let defailt = {
                title: ''
            };
            let options = Object.assign(defailt, a);
            return api.setDocumentTitle && api.setDocumentTitle(options);
        }
    };
};

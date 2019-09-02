import { handleSuccess, handleFail } from "../utils";

/**
 * 设置系统剪贴板的内容
 * https://w3c.github.io/clipboard-apis/#dom-clipboard-writetext
 */
function setClipboardData({ data, success, fail, complete }) {
    return navigator.clipboard
        .writeText(data)
        .then(function() {
            var ok = {
                errMsg: "setClipboardData success",
                data
            };
            handleSuccess(ok, success, complete);
        })
        .catch(function(e) {
            var ng = { data: null, errMsg: e };
            handleFail(ng, fail, complete);
        });
}

function getClipboardData({ success, fail, complete }) {
   return navigator.clipboard
        .readText()
        .then(function(data) {
            var ok = {
                errMsg: "getClipboardData success",
                data
            };
            handleSuccess(ok, success, complete);
        })
        .catch(function(e) {
            var ng = { data: null, errMsg: e };
            handleFail(ng, fail, complete);
        });
}

export default {
    getClipboardData,
    setClipboardData
};

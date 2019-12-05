import { handleSuccess, handleFail } from "../utils";

/**
 * 设置系统剪贴板的内容 https://有, http://没这个API
 * https://w3c.github.io/clipboard-apis/#dom-clipboard-writetext
 */
function coolieMethod(input, success, fail, complete, method, msg) {
    try{
    return navigator.clipboard
        [method](input)
        .then(function(data) {
            var ok = {
                errMsg: msg,
                data: data
            };
            handleSuccess(ok, success, complete);
        })
        .catch(function(e) {
            var ng = { data: null, errMsg: e };
            handleFail(ng, fail, complete);
        });
    }catch(e){
      return  Promise.reject({
        data: null, errMsg: e
      }).catch(function(reason){
         handleFail(reason, fail, complete);
      })
    }
}
function setClipboardData({data, success, fail, complete }){
    return coolieMethod(data, success, fail, complete, "writeText", 'setClipboardData:ok' )
}
function getClipboardData({success, fail, complete }){
    return coolieMethod(null, success, fail, complete, "readText", 'getClipboardData:ok' )
}


export default {
    getClipboardData,
    setClipboardData
};

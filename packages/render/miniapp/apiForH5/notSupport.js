function notSupport(name) {
    return function() {
        // eslint-disable-next-line no-console
        console.warn(`Web 端暂不支持 ${name}`);
    };
}

export default {
    scanCode: notSupport('scanCode'),
    getFileInfo: notSupport('getFileInfo'),
    getSavedFileInfo: notSupport('getSavedFileInfo'),
    getSavedFileList: notSupport('getSavedFileList'),
    removeSavedFile: notSupport('removeSavedFile'),
    saveFile: notSupport('saveFile'),
    getClipboardData: notSupport('getClipboardData'),
    getNetworkType: notSupport('getNetworkType'),
    createShortcut: notSupport('createShortcut'),
    // temp
    // showModal: notSupport('showModal'),
    // showToast: notSupport('showToast'),
    // hideToast: notSupport('hideToast'),
    // showLoading: notSupport('showLoading'),
    // hideLoading: notSupport('hideLoading'),
    // // showActionSheet: notSupport('showActionSheet'),
    // previewImage: notSupport('previewImage'),
    // share: notSupport('share')
};

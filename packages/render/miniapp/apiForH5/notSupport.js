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
};

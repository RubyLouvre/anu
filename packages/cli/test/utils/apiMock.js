function runInAsync(options, res) {
    setTimeout(function() {
        if (res.errMsg.indexOf(':ok') >= 0 && typeof options.success === 'function') {
            options.success(res);
            options.complete && options.complete(res);
            return;
        }

        if (res.errMsg.indexOf(':fail') >= 0 && typeof options.fail === 'function') {
            options.fail(res);
            options.complete && options.complete(res);
        }

    }, 0);
}


function runSetStorageAsync(options, res) {
    setTimeout(function() {
        if (res.errMsg.indexOf(':ok') >= 0 && typeof options.success === 'function') {
            options.success('setStorage:ok');
            options.complete && options.complete('setStorage:ok');
        }

        if (res.errMsg.indexOf(':fail') >= 0 && typeof options.fail === 'function') {
            options.fail('setStorage:fail');
            options.complete && options.complete('setStorage:fail');
        }
        

    }, 0);
}

function runGetStorageAsyncSuc(options) {
    setTimeout(function() {
        let ret = {
            errMsg: 'getStorage:ok',
            data: 'a=1&b=2&c=3'
        };
        options.success(ret);
        options.complete && options.complete(ret);
    }, 0);
}

function runGetStorageAsyncFail(options) {
    setTimeout(function() {
        let ret = {
            errMsg: 'getStorage:fail data not found'
        };
        options.fail(ret);
        options.complete && options.complete(ret);

    }, 0);
}


function runRemoveStorageAsyncSuc(options) {
    setTimeout(function() {
        let ret = {
            errMsg: 'removeStorage:ok'
        };
        options.success(ret);
        options.complete && options.complete(ret);
    }, 0);
}


function runClearStorageAsyncSuc(options) {
    setTimeout(function() {
        let ret = {
            errMsg: 'clearStorage:ok'
        };
        options.success(ret);
        options.complete && options.complete(ret);

    }, 0);
}


const wx = {
    request(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    uploadFile(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    downloadFile(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    setStorage(opts) {
        runSetStorageAsync(opts, opts.mock && opts.mock() || {});
    },
    getStorage(opts) {
        if (/:ok/.test(opts.key)) {
            runGetStorageAsyncSuc(opts);
        }
        if (/:fail/.test(opts.key)) {
            runGetStorageAsyncFail(opts);
        }
    },
    removeStorage(opts) {
        runRemoveStorageAsyncSuc(opts);
    },
    clearStorage(opts) {
        runClearStorageAsyncSuc(opts);
    },
    login(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    checkSession(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    authorize(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    getUserInfo(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    requestPayment(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    saveFile(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    getFileInfo(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    getSavedFileList(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    getSavedFileInfo(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    removeSavedFile(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    },
    openDocument(opts) {
        runInAsync(opts, opts.mock && opts.mock() || {});
    }
};

if (typeof global !== undefined) {
    global.wx = wx;
}

module.exports = {
    wx
};
const file = require('@system.file');
const SUCCESS_MESSAGE = 'ok';
import { noop } from 'react-core/util';

// 获取本地文件的文件信息
function getSavedFileInfo({
    filePath: uri,
    success = noop,
    fail = noop,
    complete = noop
}) {
    function gotFile({ length, lastModifiedTime}) {
        success({
            errMsg: SUCCESS_MESSAGE,
            size: length,
            createTime: lastModifiedTime
        });
    }


    file.get({
        uri,
        success: gotFile,
        fail,
        complete
    });
}

// 获取指定目录下的文件列表

function getSavedFileList({
    uri,
    success = noop,
    fail = noop,
    complete = noop
}) {
    if (!uri) {
        fail(new Error('小米需要指定目录'));
    }

    function gotFileList(fileList) {

        let newFileList = fileList.map(item => {
            return {
                fileList: item.uri,
                size: item.length,
                createTime: item.lastModifiedTime
            };
        });

        success({
            fileList: newFileList,
            errMsg: SUCCESS_MESSAGE
        });

    }


    file.list ({
        uri,
        success: gotFileList,
        fail,
        complete
    });
}

function removeSavedFile({
    filePath: uri,
    success = noop,
    fail = noop,
    complete = noop
}){
    file.delete ({
        uri,
        success,
        fail,
        complete
    });
}

function saveFile({
    tempFilePath: srcUri,
    destinationFilePath: dstUri,
    success = noop,
    fail = noop,
    complete = noop
}) {
    if (!dstUri) {
        fail(new Error('小米需要指定需要指定目标路径'));
    }

    function gotSuccess(uri) {
        success({
            savedFilePath: uri
        });
    }

    file.move({
        srcUri,
        dstUri,
        success: gotSuccess,
        fail,
        complete
    });


}

export { getSavedFileInfo, getSavedFileList, removeSavedFile, saveFile};
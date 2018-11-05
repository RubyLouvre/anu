const file = require('@system.file');
const SUCCESS_MESSAGE = 'ok';

function runFunction(fn, ...args) {
  if (typeof fn == 'function') {
    fn.call(null, ...args);
  }
}

// 获取本地文件的文件信息
function getSavedFileInfo({
  filePath: uri,
  success,
  fail,
  complete
}) {
  function gotFile({ length, lastModifiedTime}) {
    success({
      errMsg: SUCCESS_MESSAGE,
      size: length,
      createTime: lastModifiedTime
      
    })
  }


  file.get({
    uri,
    success: gotFile,
    fail,
    complete
  })
}

// 获取指定目录下的文件列表

function getSavedFileList({
  uri,
  success,
  fali,
  complete
}) {
 if(!uri) {
  runFunction(fail, new Error('小米需要指定目录'));
 }

  function gotFileList(fileList) {

    let newFileList = fileList.map(item => {
      return {
        fileList: item.uri,
        size: item.length,
        createTime: item.lastModifiedTime
      }
    })

    success({
      fileList: newFileList,
      errMsg: SUCCESS_MESSAGE
    })

  }


  file.list ({
    uri,
    success: gotFileList,
    fali,
    complete
  })
}

function removeSavedFile({
  filePath: uri,
  success,
  fail,
  complete
}){


  file.delete ({
    uri,
    success,
    fail,
    complete
  })
}

function saveFile({
  tempFilePath: srcUri,
  destinationFilePath: dstUri,
  success,
  fail,
  complete
}) {
  if(!dstUri) {
    runFunction(fail, new Error('小米需要指定需要指定目标路径'));
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
  })


}

export{ getSavedFileInfo, getSavedFileList, removeSavedFile, saveFile}

import { noop } from 'react-core/util';


function getFilePromise(file, path, fail){
    return new Promise(function(resolve){
        file.get({
            uri: path,
            success: function({
                uri,
                length
            }){
                resolve({
                    path: uri,
                    size: length
                })
            },
            fail
        })
    })
    
}

//从本地相册选择图片或使用相机拍照。
export function chooseImage({
    count = 1,
    sourceType = ['album', 'camera'],
    // sizeType,
    success,
    fail = noop,
    complete = noop
}) {
    const media = require('@system.media');
    const file = require('@system.file');
    if( count > 1  && sourceType.indexOf('album') !=-1 ){
        if(!media.pickImages){ //快应用PC上的IDE是1030，只有手机上的调试器才能改变版本，
            //每次更改版本，需要先手动移除手机上的快应用预览版，然后在快应用调试器的右上角菜单选择安装
           return fail(new Error('当前快应用版本小于1040，不支持选多张图片'));
       }
       return media.pickImages({ //1040的API
            success: function ({ uris, files }) {
                const tempFilePaths = uris
                if(!files){ //1060才支持files数组
                    var promises = []
                    for(let i = 0; i < tempFilePaths.length; i++){
                        promises.push(  getFilePromise(file, uris[i], fail ) )
                    }
                    Promise.all(promises).then(function(tempFiles){
                        success({
                            tempFiles,
                            tempFilePaths
                        })
                    })
                    return
                }
                success({
                    tempFilePaths,
                    tempFiles: files
                });
            },
            fail,
            complete
        })
    }
   

    // 除了 sourceType 为 ['camera'] 时为拍摄图片
    // 其余情况均为从相册选择
    const pick = sourceType.length === 1 && sourceType[0] === 'camera' ?
        media.takePhoto : media.pickImage;
    pick({
        success: function({uri}){
            return  getFilePromise(file, uri, fail ).then(function(data){
                const tempFilePaths = [data.path];
                const tempFiles = [data];
                success({
                    tempFilePaths,
                    tempFiles
                });
            })
        },
        fail,
        complete,
        cancel: fail
    });
}


export function previewImage({
    urls = [],
    current = urls[0] || '',
    // sizeType,
    success,
    fail = noop,
    complete = noop
}) {
    const media = require('@system.media');
    if(!media.previewImage){
        console.log("快应用引擎请升级到1040")
        return 
     }
    media.previewImage({
        current,
        uris: urls,
        success,
        fail,
        complete
    });
}

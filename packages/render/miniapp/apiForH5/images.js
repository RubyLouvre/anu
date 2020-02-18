/**
 * 选择图片
 * @param {Array} urls 要预览的图片链接列表
 * @param {String} current 当前显示图片的链接, urls 的第一张
 */
import { handleSuccess, handleFail } from '../utils';

// TODO 需要确定要不要传给服务器
function chooseImage({ 
    count = 9,
    sizeType = ['original', 'compressed'],
    sourceType = ['album', 'camera'],
    success = function() {},
    fail = function() {},
    complete = function() {},
} = {}) {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.multiple = true;
    tempInput.onchange = function(e) {
        const files = e.path[0].files;
        handleSuccess({
            tempFiles: files
        }, success, complete);
    };
    tempInput.click();
}

/**
 * 保存图片到系统相册
 * @param {String} filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
 */
function saveImageToPhotosAlbum(filePath) {
    // 暂时实现不了
    console.log(filePath);
}

/**
 * 获取图片信息
 * @param {String} src 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
 */
function getImageInfo(options = {}) {
    const img = new Image();
    const {
        src,
        success = () => {},
        fail = () => {},
        complete = () => {}
    } = options;
    img.src = src;
    let result = {
        width: 1,
        height: 1,
        path: '',
        orientation: '',
        type: ''
    };

    return new Promise((resolve, reject) => {
        try {
            if (!src) {
                handleFail(
                    {
                        errMsg: 'getImageInfo 参数错误'
                    },
                    fail,
                    complete,
                    reject
                );
                return;
            }
            if (img.complete) {
                result.width = img.width;
                result.height = img.height;
                result.path = img.src;
                handleSuccess(result, success, complete, resolve);
            } else {
                img.onload = () => {
                    result.width = img.width;
                    result.height = img.height;
                    result.path = img.src;
                    handleSuccess(result, success, complete, resolve);
                };
            }
        } catch (e) {
            handleFail(
                {
                    errMsg: e
                },
                fail,
                complete,
                reject
            );
        }
    });
}

export default {
    chooseImage,
    saveImageToPhotosAlbum,
    getImageInfo
};

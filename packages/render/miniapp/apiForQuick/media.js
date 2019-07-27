
import { noop } from 'react-core/util';

//从本地相册选择图片或使用相机拍照。
export function chooseImage({
    count = 1,
    sourceType = [],
    // sizeType,
    success,
    fail = noop,
    complete = noop
}) {
    if (count > 1) {
        return fail(new Error('快应用选择图片的数量不能大于1'))
    }

    function imagePicked({ uri: path }) {
        const file = require('@system.file');
        // 从临时文件获取图片大小
        file.get({
            uri: path,
            success: function({ length: size }) {
                const tempFilePaths = [path];
                const tempFiles = [{ path, size }];

                success({
                    tempFilePaths,
                    tempFiles
                });
            },
            fail
        });
    }
    const media = require('@system.media');
    // 除了 sourceType 为 ['camera'] 时为拍摄图片
    // 其余情况均为从相册选择
    const pick = sourceType.length === 1 && sourceType[0] === 'camera' ? 
        media.takePhoto : media.pickImage;
    pick({
        success: imagePicked,
        fail,
        complete,
        cancel: fail
    });
}

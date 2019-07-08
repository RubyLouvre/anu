let config = require('../../config/config');
const traverse = require('@babel/traverse').default;
/**
 * 用于搜集快应用 titlebar 显示隐藏配置
 */
module.exports = function(){
    return {
        visitor: {
            ObjectProperty(astPath, state){
                if (config['buildType'] !== 'quick' || astPath.node.key.name !== 'navigationBarTitleText') return;
                let fileId = state.file.opts.filename;
                let node = astPath.node;
                if (node.value.value === '') {
                    //config.quick.disabledTitleBarPages.push(fileId)
                    config['quick']['disabledTitleBarPages'].add(fileId);
                }
            }
        }
    };
};
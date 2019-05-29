let config = require('../config');
const traverse = require('@babel/traverse').default;
/**
 * 用于搜集快应用 titlebar 显示隐藏配置
 */
module.exports = function(){
    return {
        visitor: {
            ClassDeclaration(astPath, state){
                if (config['buildType'] !== 'quick') return;
                let fileId = state.file.opts.filename;
                
                traverse(
                    astPath.node, 
                    {
                        ObjectProperty(astPath){
                            let node = astPath.node;
                            if (node.key.name !== 'navigationBarTitleText') return;
                            if (node.value.value === '') {
                                //config.quick.disabledTitleBarPages.push(fileId)
                                config[config['buildType']]['disabledTitleBarPages'].add(fileId);
                            }
                        },
                    },
                    astPath.scope
                );
            }
        }
    };
};
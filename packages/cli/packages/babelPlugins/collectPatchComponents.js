let config = require('../config');
/**
 * patchComponents用于搜集文件中的patch components
 * {
 *     patchComponents: ['button', 'radio'],
 *     jsxPatchNode: {
 *       [fileId]: ['button']
 *     }
 * }
 */
module.exports = ()=>{
    return {
        visitor: {
            JSXOpeningElement: function(astPath){
                let fileId =  this.file.parserOpts.sourceFileName;
                let nodeName = astPath.node.name.name;
                let platConfig = config[config.buildType];
                let patchComponents = platConfig.patchComponents || [];
                
                if ( !patchComponents.includes(nodeName) ) return;

                //做一些初始化工作
                platConfig.jsxPatchNode = platConfig.jsxPatchNode || {};
                platConfig.jsxPatchNode[fileId] = platConfig.jsxPatchNode[fileId] || [];

                //防止重复添加
                if (platConfig.jsxPatchNode[fileId].includes(nodeName)) return;
                platConfig.jsxPatchNode[fileId].push(nodeName);
                
            }
        }
    };
};
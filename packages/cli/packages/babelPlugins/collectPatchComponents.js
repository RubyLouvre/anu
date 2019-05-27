let config = require('../config');
const path = require('path');
const cwd = process.cwd();
const utils = require('../utils/index');
/**
 * patchComponents用于搜集文件中的patch components
 * {
 *     patchComponents: {'button':1, 'radio':1},
 *     patchPages?: {
 *       [pagePath]: {
 *          button: true
 *      }
 *     }
 * }
 */

function getPatchComponentPath(name) {
    return path.resolve(cwd, `./node_modules/schnee-ui/components/${name}/index.js`);
}

module.exports = ()=>{
    return {
        visitor: {
            JSXOpeningElement: function(astPath, state){
                // [babel 6 to 7] 通过 state 来获取文件的绝对路径 fileId =  state.filename
                let pagePath =  state.filename;
                let nodeName = astPath.node.name.name;
                let platConfig = config[config.buildType];
                let patchComponents = platConfig.patchComponents 

                
                if ( !patchComponents[nodeName] ){
                    return;
                } 
                // 添加依赖的补丁组件, 比如快应用navigator --> x-navigator -> XNavigator
                const patchComponentPath = getPatchComponentPath(  utils.parseCamel('x-'+nodeName)); 
                config.patchComponents[nodeName] = config.patchComponents[nodeName] || patchComponentPath;
                // 需要引入补丁组件的页面
                var pagesNeedPatchComponents =  platConfig.patchPages || (platConfig.patchPages = {});
                // 引入补丁组件的当前页面
                var currentPage = pagesNeedPatchComponents[pagePath] || (pagesNeedPatchComponents[pagePath] = {});
                currentPage[nodeName] = true;
                
            }
        }
    };
};
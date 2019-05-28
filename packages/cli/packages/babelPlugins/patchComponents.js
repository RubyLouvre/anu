let config = require('../../config/config');
const path = require('path');
const cwd = process.cwd();
const utils = require('../utils/index');
const pkgName = 'schnee-ui';
const nodeResolve = require('resolve');

let installFlag = false;
let patchSchneeUi = false;

function needInstall( pkgName ){
    try {
        nodeResolve.sync(pkgName, { 
            basedir: process.cwd(),
            moduleDirectory: ''
        });
        return false;
    } catch (err) {
        return true;
    }
}

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
    return path.join(cwd, `./node_modules/schnee-ui/components/${name}/index.js`);
}

module.exports = ()=>{
    return {
        visitor: {
            JSXOpeningElement: function(astPath, state){
                // [babel 6 to 7] 通过 state 来获取文件的绝对路径 fileId =  state.filename
                let fileId =  utils.fixWinPath(state.filename);
                                  
                let nodeName = astPath.node.name.name;
                let platConfig = config[config.buildType];
                let patchComponents = platConfig.patchComponents || [];
                const modules = utils.getAnu(state);
                if ( !patchComponents[nodeName] ) return;
                // 添加依赖的补丁组件
                const patchComponentPath = getPatchComponentPath('X' + utils.parseCamel(nodeName));
                
                //做一些初始化工作
                platConfig.jsxPatchNode = platConfig.jsxPatchNode || {};
                platConfig.jsxPatchNode[fileId] = platConfig.jsxPatchNode[fileId] || [];
                //防止重复添加
                if (platConfig.jsxPatchNode[fileId].includes(nodeName)) return;
                platConfig.jsxPatchNode[fileId].push(nodeName);

                modules.extraModules.push(patchComponentPath);

                patchSchneeUi = true;
                // 需要引入补丁组件的页面
                var pagesNeedPatchComponents =  platConfig.patchPages || (platConfig.patchPages = {});
                // 引入补丁组件的当前页面
                var currentPage = pagesNeedPatchComponents[fileId] || (pagesNeedPatchComponents[fileId] = {});
                currentPage[nodeName] = true;
            }
        },
        post: function(){
            if ( patchSchneeUi && !installFlag && needInstall(pkgName) ) {
                utils.installer(pkgName);
                installFlag = true;
            }
        }
    };
};
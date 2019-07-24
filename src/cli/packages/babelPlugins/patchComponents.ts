import config from '../../config/config';
import * as path from 'path';
import utils from '../utils/index';
import nodeResolve from 'resolve';
import * as t from '@babel/types';
import { NodePath, PluginObj } from '@babel/core';
const cwd = process.cwd();
const pkgName = 'schnee-ui';

let installFlag = false;
let patchSchneeUi = false;

function needInstall( pkgName: string ): boolean{
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

function getPatchComponentPath(name: string) {
    return path.join(cwd, `./node_modules/schnee-ui/components/${name}/index.js`);
}

module.exports = (): PluginObj => {
    return {
        visitor: {
            JSXOpeningElement: function(astPath: NodePath<t.JSXOpeningElement>, state: any){
               
                let pagePath = utils.fixWinPath(state.filename);
                // tsc提示：没有考虑到<A.B></A.B>这种组件情况
                let nodeName = (astPath.node.name as t.JSXIdentifier).name;
                let platConfig = config[config.buildType];
                let patchComponents = platConfig.patchComponents;

                if ( !patchComponents[nodeName] ){
                    return;
                } 
                
                patchSchneeUi = true;

                const modules = utils.getAnu(state);

                // 添加依赖的补丁组件, 比如快应用navigator --> x-navigator -> XNavigator
                const patchComponentPath = getPatchComponentPath(  utils.parseCamel('x-'+nodeName)); 

                //将补丁组件加入编译队列
                modules.extraModules.push(patchComponentPath);
                
                //加入import依赖，后续便于插入import语句
                modules.importComponents[utils.parseCamel('x-'+nodeName)] = {
                    source: patchComponentPath,
                    sourcePath: pagePath
                };

                config.patchComponents[nodeName] = config.patchComponents[nodeName] || patchComponentPath;
                // 需要引入补丁组件的页面
                var pagesNeedPatchComponents =  platConfig.patchPages || (platConfig.patchPages = {});
                // 引入补丁组件的当前页面
                var currentPage = pagesNeedPatchComponents[pagePath] || (pagesNeedPatchComponents[pagePath] = {});
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
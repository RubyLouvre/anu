import { PluginObj } from '@babel/core';
import visitor from './miniappVisitor';
import config from '../../config/config';
import utils from '../utils';
let quickFiles = require('../quickHelpers/quickFiles');
let reg = utils.getComponentOrAppOrPageReg();

let miniAppPlugin = function(): PluginObj{
    return {
        visitor: visitor,
        manipulateOptions(opts) {
            //解析每个文件前执行一次
            var modules: any = (opts.anu = {
               // className: "",//组件的名字
               // parentName: "",//组件的父类的名字
                thisMethods: [],
                staticMethods: [],
                thisProperties: [],//bable7中好像没有用了
                config: {}, //用于生成对象
                importComponents: {}, //import xxx form path进来的组件
                usedComponents: {}, //在<wxml/>中使用<import src="path">的组件
                customComponents: [], //定义在page.json中usingComponents对象的自定义组件
                extraModules: [], // 用于webpack分析依赖，将babel中删除的依赖关系暂存
                queue: []
            });
            
            let filePath = opts.filename.replace(/\\/g, '/');
            modules.sourcePath = filePath;
            modules.current = filePath.replace(process.cwd().replace(/\\/g, '/'), '');
            if (
                /\/components\//.test(filePath)                
            ) {
                modules.componentType = 'Component';
            } else if (/\/pages\//.test(filePath)) {
                modules.componentType = 'Page';
            } else if (/app\.js$/.test(filePath)) {
                modules.componentType = 'App';
            }
            //如果是快应用
            if (config.buildType === 'quick' && modules.componentType) {
                var obj = quickFiles[modules.sourcePath];
                if (!obj) {
                    obj = quickFiles[modules.sourcePath] = {};
                }
                obj.type = modules.componentType;
            }
        }
    };
};


module.exports = (filePath: string)=>{
    return reg.test(filePath) ? [miniAppPlugin] : [];
};
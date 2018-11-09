let syntaxClassProperties = require('babel-plugin-syntax-class-properties');
let visitor = require('./miniappVisitor');
let config = require('./config');
let quickFiles = require('./quickFiles');
let utils = require('./utils/index');

module.exports = function miniappPlugin() {
    return {
        inherits: syntaxClassProperties,
        visitor: visitor,
        manipulateOptions(opts) {
            //解析每个文件前执行一次
            var modules = (opts.anu = {
                thisMethods: [],
                staticMethods: [],
                thisProperties: [],
                config: {}, //用于生成对象
                importComponents: {}, //import xxx form path进来的组件
                usedComponents: {}, //在<wxml/>中使用<import src="path">的组件
                customComponents: [] //定义在page.json中usingComponents对象的自定义组件
            });

            let resolvedSourcePath = utils.resolvePatchComponentPath(opts.filename); //patchComponent路径要经过处理
            modules.sourcePath =  resolvedSourcePath;

            modules.current = resolvedSourcePath.replace(process.cwd(), '');
            if (/\/(components|patchComponents)\//.test(resolvedSourcePath)) {
                modules.componentType = 'Component';
            } else if (/\/pages\//.test(resolvedSourcePath)) {
                modules.componentType = 'Page';
            } else if (/app\.js$/.test(resolvedSourcePath)) {
                modules.componentType = 'App';
            }
            //如果是快应用
            if (config.buildType === 'quick' && modules.componentType) {
                var obj = quickFiles[resolvedSourcePath];
                if (!obj) {
                    obj = quickFiles[resolvedSourcePath] = {};
                }
                obj.type = modules.componentType;
            }
        }
    };
};

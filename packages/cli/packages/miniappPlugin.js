let syntaxClassProperties = require('babel-plugin-syntax-class-properties');
let visitor = require('./miniappVisitor');
let config = require('./config');
let quickFiles = require('./quickFiles');

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
            modules.sourcePath = opts.filename;

            modules.current = opts.filename.replace(process.cwd(), '');
            if (/\/components\//.test(opts.filename)) {
                modules.componentType = 'Component';
            } else if (/\/pages\//.test(opts.filename)) {
                modules.componentType = 'Page';
            } else if (/app\.js$/.test(opts.filename)) {
                modules.componentType = 'App';
            }
            //如果是快应用
            if (config.buildType === 'quick' && modules.componentType) {
                var obj = quickFiles[opts.filename];
                if (!obj) {
                    obj = quickFiles[opts.filename] = {};
                }
                obj.type = modules.componentType;
            }
        }
    };
};

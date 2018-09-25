let syntaxClassProperties = require('babel-plugin-syntax-class-properties');
let babel = require('babel-core');
let queue = require('./queue');
let utils = require('./utils');
let path = require('path');
let visitor = require('./miniappPlugin');
let cwd = process.cwd();
const config = require('./config');
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function miniappPlugin() {
   
    return {
        inherits: syntaxClassProperties,
        visitor: visitor,
        manipulateOptions(opts) {
            //解析每个文件前执行一次
            var modules = (opts.anu = {
                thisMethods: [],
                staticMethods: [],
                thisProperties: [],
                importComponents: {}, //import xxx form path进来的组件
                usedComponents: {},   //在<wxml/>中使用<import src="path">的组件
                customComponents: []  //定义在page.json中usingComponents对象的自定义组件
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
        }
    };
}

function getDistPath(filePath){
    let { name, dir } = path.parse(filePath);
    let relativePath = path.relative( path.join(cwd, 'src'), dir);
    let distDir = path.join(cwd, 'dist', relativePath);
    let ext = config[config['buildType']].jsExt; //获取构建的文件后缀名
    let distFilePath = path.join(distDir, `${name}.${ext}` );
    return distFilePath;
}

//var resolveP  = require('babel-plugin-module-resolver');
var log = console.log;
function transform(sourcePath, resolvedIds) {
    
    let result = babel.transformFileSync(sourcePath, {
        babelrc: false,
        plugins: [
            'syntax-jsx',
            'transform-decorators-legacy',
            'transform-object-rest-spread',
            'transform-async-to-generator',
            'transform-es2015-template-literals',
            miniappPlugin,
            ['module-resolver', {
                'root':  './',  //从项目根路径搜索
                // 'alias': {
                //     '@react' : './src/ReactWX.js',
                //     '@components': './src/components',
                //     ...d
                    
                    
                // },
                resolvePath(moduleName){
                    var aliasMap = utils.colletAlias(sourcePath, resolvedIds);
                    //某些模块中不存在任何依赖
                    if(aliasMap[moduleName]){
                        return aliasMap[moduleName];
                    }
                }
            }],
            // [
            //     'transform-es2015-modules-commonjs',
            //     {
            //        // loose: true
            //     }
            // ]
           // 'transform-es2015-modules-commonjs'
        ]
    });


    // result = babel.transform(result.code, {
    //     babelrc: false,
    //     plugins: ['transform-es2015-modules-commonjs']
    // });
    queue.push({
        code: result.code,
        type: 'js',
        path: getDistPath(sourcePath)
        
    });
}

module.exports = {
    transform,
    miniappPlugin
};

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md

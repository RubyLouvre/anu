let syntaxClassProperties = require('babel-plugin-syntax-class-properties');
let babel = require('babel-core');
let queue = require('./queue');
let utils = require('./utils');
let fs = require('fs');
let nodeResolve = require('resolve');
let path = require('path');
let chalk = require('chalk');
let visitor = require('./miniappPlugin');
let config = require('./config');

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
                usedComponents: {}, //在<wxml/>中使用<import src="path">的组件
                customComponents: [] //定义在page.json中usingComponents对象的自定义组件
            });
            modules.sourcePath =  path.resolve(opts.filename);
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




function transform(sourcePath, resolvedIds) {
    let customAliasMap = utils.updateCustomAlias(sourcePath, resolvedIds);
    let npmAliasMap = utils.updateNpmAlias(sourcePath, resolvedIds);
    //pages|app|components需经过miniappPlugin处理
    let miniAppPluginsInjectConfig = utils.getComponentOrAppOrPageReg().test(sourcePath) ? [miniappPlugin] : [];
    babel.transformFile(
        sourcePath,
        {
            babelrc: false,
            plugins: [
                'syntax-jsx',
                'transform-decorators-legacy',
                'transform-object-rest-spread',
                'transform-async-to-generator',
                'transform-es2015-template-literals',
                ...miniAppPluginsInjectConfig,
                [
                    'module-resolver',
                    {
                        resolvePath(moduleName) {
                            //针对async/await语法做特殊处理
                            if (
                                /regenerator-runtime\/runtime/.test(moduleName)
                            ) {
                                let regeneratorRuntimePath = '';
                                try {
                                    regeneratorRuntimePath = nodeResolve.sync('regenerator-runtime/runtime', {basedir: process.cwd()});
                                } catch (err) {
                                    // eslint-disable-next-line
                                    console.log(
                                        'Error: ' + sourcePath + '\n' +
                                        'Msg: ' + chalk.red('async/await语法缺少依赖 regenerator-runtime ,请安装')
                                    );
                                    process.exit(1);
                                }
                                
                                queue.push({
                                    code: fs.readFileSync(regeneratorRuntimePath, 'utf-8'),
                                    path:  utils.replacePath(regeneratorRuntimePath, '/node_modules/', '/dist/npm/'),
                                    type: 'npm'
                                });

                                //获取依赖的相对路径
                                Object.assign(
                                    npmAliasMap,
                                    utils.updateNpmAlias(sourcePath, {
                                        'regenerator-runtime/runtime': regeneratorRuntimePath
                                    })
                                );
                            }
                        
                            let value = '';
                            if (customAliasMap[moduleName]) {
                                value = customAliasMap[moduleName];
                            } else if (npmAliasMap[moduleName]) {
                                //某些模块中可能不存在任何配置依赖, 搜集的alias则为空object.
                                value = npmAliasMap[moduleName];
                            }

                            //require('xxx.js') => require('./xxx.js');
                            if (/^\w/.test(value)) {
                                value = `./${value}`;
                            }
                            
                            if (utils.isWin()) {
                                value = value.replace(/\\/g, '/');
                            }
                            return value;
                        }
                    }
                ]
            ]
        },
        (err, result) => {
            if (err) throw err;

            //babel6无transform异步方法
            let babelPlugins = [
                [
                    //process.env.ANU_ENV
                    'transform-inline-environment-variables',
                    {
                        env: {
                            ANU_ENV: config['buildType'],
                            ANU_PROCESS_ENV: process.env.ANU_PROCESS_ENV
                        }
                    }
                ],
                'minify-dead-code-elimination'
            ];

            if (config.buildType === 'wx') {
                //支付宝小程序默认支持es6 module
                babelPlugins.push('transform-es2015-modules-commonjs');
            }
            
            setImmediate(()=>{
                result = babel.transform(result.code, {
                    babelrc: false,
                    plugins: babelPlugins
                });
                result.code = result.code.replace(/\\?(?:\\\\u)([\da-f]{4})/ig, (a, b) => unescape(`%u${b}`));
                queue.push({
                    code: result.code,
                    type: 'js',
                    path: utils.replacePath(sourcePath, '/src/', '/dist/')
                });
            });
            
        }
    );
}

module.exports = {
    transform,
    miniappPlugin
};

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
/*!
 * 生成js文件, ux文件
 */
let babel = require('babel-core');
let queue = require('./queue');
let utils = require('./utils');
let fs = require('fs');
let nodeResolve = require('resolve');
let path = require('path');
let cwd = process.cwd();
let config = require('./config');
let quickFiles = require('./quickFiles');
let miniappPlugin = require('./miniappPlugin');

function getDistPath(filePath) {
    let { name, dir } = path.parse(filePath);
    let relativePath = path.relative(path.join(cwd, 'src'), dir);
    let distDir = path.join(cwd, 'dist', relativePath);
    let ext = config[config['buildType']].jsExt; //获取构建的文件后缀名
    let distFilePath = path.join(distDir, `${name}.${ext}`);
    return distFilePath;
}

function transform(sourcePath, resolvedIds) {
    let customAliasMap = utils.updateCustomAlias(sourcePath, resolvedIds);
    let npmAliasMap = utils.updateNpmAlias(sourcePath, resolvedIds);
    //pages|app|components需经过miniappPlugin处理
    let miniAppPluginsInjectConfig = utils
        .getComponentOrAppOrPageReg()
        .test(sourcePath)
        ? [miniappPlugin]
        : [];
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
                                let npmFile = nodeResolve.sync(moduleName, {
                                    basedir: cwd,
                                    moduleDirectory: path.join(
                                        cwd,
                                        'node_modules'
                                    )
                                });
                                Object.assign(
                                    npmAliasMap,
                                    utils.updateNpmAlias(sourcePath, {
                                        'regenerator-runtime/runtime': npmFile
                                    })
                                );
                                queue.push({
                                    code: fs.readFileSync(npmFile, 'utf-8'),
                                    path: npmFile.replace(
                                        /\/node_modules\//,
                                        '/dist/npm/'
                                    ),
                                    type: 'npm'
                                });
                                utils.emit('build');
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
                            return value;
                        }
                    }
                ]
            ]
        },
        function(err, result) {
            if (err) throw err;

            //babel6无transform异步方法
            setTimeout(() => {
                let babelPlugins = [
                    [
                        //process.env.ANU_ENV
                        'transform-inline-environment-variables',
                        {
                            env: {
                                ANU_ENV: config['buildType']
                            }
                        }
                    ],
                    'minify-dead-code-elimination'
                ];

                if (config.buildType === 'wx') {
                    //支付宝小程序默认支持es6 module
                    babelPlugins.push('transform-es2015-modules-commonjs');
                }

                result = babel.transform(result.code, {
                    babelrc: false,
                    plugins: babelPlugins
                });
                //生成JS文件
                var uxFile = quickFiles[sourcePath];
                if (config.buildType == 'quick' && uxFile) {
                    var ux = `
${uxFile.template || ''}
<script>
${result.code}
</script>
`;
                    var using = uxFile.config && uxFile.config.usingComponents;
                    if (using){
                        var importTag = '';
                        for (var i in using){
                            importTag += `<import name="${i}" src="${using[i].slice(0,-6)}"></import>\n`;
                        }
                        ux = importTag+ux.trim();
                    }
                    if (uxFile.cssType) {
                        ux += `
<style type="${uxFile.cssType}">
${uxFile.cssCode}
</style>`;
                    }
                    queue.push({
                        code: ux,
                        type: 'ux',
                        path: getDistPath(sourcePath)
                    });
                } else {
                    queue.push({
                        code: result.code,
                        type: 'js',
                        path: getDistPath(sourcePath)
                    });
                }

                utils.emit('build');
            }, 4);
        }
    );
}

module.exports = transform;

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md

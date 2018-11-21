/* eslint no-console: 0 */

const chalk = require('chalk');
const path = require('path');
const rollup = require('rollup');
const rbabel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs'); 
const alias = require('rollup-plugin-alias');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const glob = require('glob');
const utils = require('./utils');
const crypto = require('crypto');
const config = require('./config');
const quickFiles = require('./quickFiles');
const miniTransform = require('./miniappTransform');
const styleTransform = require('./styleTransform');
const resolveNpm = require('./resolveNpm');
const generate = require('./generate');
let cwd = process.cwd();
let inputPath = path.join(cwd,  config.sourceDir);
let entry = path.join(inputPath, 'app.js');
let cache = {};
let needUpdate = (id, code, fn) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(code)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        fn();
    }
};

const isNpm = path => {
    return /\/node_modules\//.test(path);
};
const isStyle = path => {
    return /\.(?:less|scss|sass)$/.test(path);
};
const isJs = path => {
    return /\.js$/.test(path);
};
const isJson = path => {
    return /\.json$/.test(path);
};
const getFileType = (id)=>{
    if ( isNpm(id) ) {
        return 'npm';
    } else if (isStyle(id)){
        return 'css';
    } else if (isJs(id)) {
        return 'js';
    } else if (isJson(id)){
        return 'json';
    }

};

//跳过rollup对样式内容解析
let ignoreStyleParsePlugin = ()=>{
    return {
        transform: function(code, id){
            let styleExtList = ['.css', '.less', '.scss', '.sass'];
            let ext = path.extname(id);
            if (styleExtList.includes(ext)) return false;
        }
    };
};

//监听打包资源
utils.on('build', ()=>{
    generate();
});

class Parser {
    constructor(entry) {
        this.entry = entry;
        this.jsFiles = [];
        this.styleFiles = [];
        this.npmFiles = [];
        this.customAliasConfig = Object.assign(
            { resolve: ['.js','.css', '.scss', '.sass', '.less'] },
            utils.getCustomAliasConfig()
        );
        this.inputConfig = {
            input: this.entry,
            treeshake: false,
            plugins: [
                alias(this.customAliasConfig), //搜集依赖时候，能找到对应的alias配置路径
                resolve({
                    jail: path.join(cwd), //从项目根目录中搜索npm模块, 防止向父级查找
                    preferBuiltins: false,
                    customResolveOptions: {
                        moduleDirectory: [
                            path.join(cwd, 'node_modules'),
                        ]
                    }
                }),
                ignoreStyleParsePlugin(),
                commonjs({
                    include: [
                        path.join(cwd, 'node_modules/**')
                    ]
                }),
                rbabel({
                    babelrc: false,
                    only: ['**/*.js'],
                    presets: [require('babel-preset-react')],
                    plugins: [
                        require('babel-plugin-transform-class-properties'),
                        require('babel-plugin-transform-object-rest-spread')
                    ]
                })
            ],
            onwarn: warning => {
                //warning.importer 缺失依赖文件路径
                //warning.source   依赖的模块名
                if (warning.code === 'UNRESOLVED_IMPORT') {
                    if (this.customAliasConfig[warning.source.split(path.sep)[0]]) return;
                    console.log(chalk.red(`缺少模块: ${warning.source}, 请检查`));
                }
            }
            
        };

        //监听是否有patchComponent解析
        utils.on('compliePatch', (data)=>{
            let id =  path.join(data.href, 'index.js');
            this.inputConfig.input = id;
            this.parse();
        });
        
    }
    async parse() {
        let bundle = await rollup.rollup(this.inputConfig);
        bundle.modules.forEach(item => {
            const id = item.id;
            if (/commonjsHelpers/.test(id)) return;
            this.moduleMap()[getFileType(id)](item);
        });
        this.transform();
        this.copyAssets();
        this.copyProjectConfig();
    }
    moduleMap() {
        return {
            npm: (data)=>{
                this.npmFiles.push({
                    id: data.id,
                    originalCode: data.originalCode
                });
            },
            css: (data)=>{
                if (config.buildType == 'quick'){
                    //如果是快应用，那么不会生成独立的样式文件，而是合并到同名的 ux 文件中
                    var jsName = data.id.replace(/\.\w+$/, '.js');
                    if (fs.pathExistsSync(jsName)) {
                        var cssExt = path.extname(data.id).slice(1);
                        quickFiles[ utils.resolvePatchComponentPath(jsName) ] = {
                            cssPath: data.id,
                            cssType: cssExt === 'scss' ?  'sass' : cssExt
                        };
                    }
                    return;
                }

                this.styleFiles.push({
                    id: data.id,
                    originalCode: data.originalCode
                });
            },
            js: (data)=>{
                this.jsFiles.push({
                    id: data.id,
                    originalCode: data.originalCode,
                    resolvedIds: this.filterNpmModule(data.resolvedIds) //处理路径alias配置
                });
            }
        };
    }
    filterNpmModule(resolvedIds) {
        //判定路径是否以字母开头
        let result = {};
        Object.keys(resolvedIds).forEach(key => {
            if (utils.isNpm(key)) {
                result[key] = resolvedIds[key];
            }
        });
        return result;
    }
    transform() {
        this.updateJsQueue(this.jsFiles);
        this.updateStyleQueue(this.styleFiles);
        this.updateNpmQueue(this.npmFiles);
    }
    checkComponentsInPages(id) {
        let flag = false;
        let pathAray = utils.isWin() ? id.split('\\') :  id.split('/'); //分割目录
        let componentsPos = pathAray.indexOf('components');
        let pagesPos = pathAray.indexOf('pages');
        if (componentsPos != -1 && pagesPos!=-1 && componentsPos > pagesPos ) {
            flag = true;
        }
        return flag;
    }
    updateJsQueue(jsFiles) {
        while (jsFiles.length) {
            let { id, originalCode, resolvedIds } = jsFiles.shift();
            if (this.checkComponentsInPages(id)) {
                // eslint-disable-next-line
                console.log(
                    chalk.red(
                        JSON.stringify(
                            {
                                path: id,
                                msg: 'components目录不能存在于pages目录下, 请检查'
                            },
                            null,
                            4
                        )
                    )
                );
            }
            needUpdate(id, originalCode, function(){
                miniTransform(id, resolvedIds, originalCode);
            });
        }
    }
    updateStyleQueue(styleFiles) {
        while (styleFiles.length) {
            let data = styleFiles.shift();
            let { id, originalCode } = data; 
            needUpdate(id, originalCode, function(){
                styleTransform({
                    id: id,
                    originalCode: originalCode
                });   
            });
        }
    }
    updateNpmQueue(npmFiles) {
        while (npmFiles.length) {
            let item = npmFiles.shift();
            // rollup 处理 commonjs 模块时候，会在 id 加上 commonjs-proxy: 前缀
            if (/commonjs-proxy:/.test(item.id)) item.id = item.id.split(':')[1];
            needUpdate(item.id, item.originalCode, function(){
                resolveNpm(item);
            });
        }
    }
    copyAssets() {
        const dir = 'assets';
        const inputDir = path.join(inputPath, dir);
        //拷贝assets下非js, css, sass, scss, less文件
        glob(inputDir + '/**', {nodir: true}, (err, files)=>{
            if (err) {
                console.log(err);
                return;
            }
            files.forEach((filePath)=>{
                if ( /\.(js|scss|sass|less|css)$/.test(filePath) ) return;
                filePath = path.resolve(filePath);
                let dist  = utils.updatePath(
                    filePath, 
                    config.sourceDir, 
                    config.buildType === 'quick' ? 'src' : config.buildDir
                );
                
                fs.ensureFileSync(dist);
                fs.copyFile(filePath, dist, (err)=>{
                    if (err ) {
                        console.log(err);
                    }
                });
            });
        });

    }
    copyProjectConfig() {
        //copy project.config.json
        if ( ['ali', 'bu', 'quick'].includes( config.buildType) ) return;
        let fileName = 'project.config.json';
        let dist = path.join(cwd, config.buildDir, fileName);
        let src = path.join(cwd, config.sourceDir, fileName);
        fs.ensureFileSync(dist);
        fs.copyFile( src, dist, (err)=>{
            if (err) {
                console.log(err);
            }
        });
    }
    watching() {
        let watchDir = path.dirname(this.entry);
        let watchConfig = {
            ignored: /\.DS_Store|\.gitignore|\.git/,
            awaitWriteFinish: {
                stabilityThreshold: 700,
                pollInterval: 100
            }
        };
        const watcher = chokidar
            .watch(watchDir, watchConfig)
            .on('change', (file)=>{
                console.log(
                    `\n更新: ${chalk.yellow(path.relative(cwd, file))}`
                );
                this.inputConfig.input = file;
                this.parse();
                
            });
        watcher.on('error', error => {
            console.error('Watcher failure', error);
            process.exit(1);
        });
    }
}

async function build(arg) {
    await utils.asyncReact();  //同步react
    if (config['buildType'] === 'quick') {
        //快应用mege package.json 以及 生成秘钥
        utils.initQuickAppConfig();
    }
    let spinner = utils.spinner(chalk.green('正在分析依赖...')).start();
    let parser = new Parser(entry);
    await parser.parse();
    spinner.succeed(chalk.green('依赖分析成功'));
    if (arg === 'watch') parser.watching();
}

module.exports = build;
const chalk = require('chalk');
const path = require('path');
const rollup = require('rollup');
const rbabel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rollupLess = require('rollup-plugin-less');
const rollupSass = require('rollup-plugin-sass');
const alias = require('rollup-plugin-alias');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const utils = require('./utils');
// eslint-disable-next-line
const isComponentOrAppOrPage = new RegExp( utils.sepForRegex  + '(?:pages|app|components)'  );
const crypto = require('crypto');
const miniTransform = require('./miniTransform');
const styleTransform = require('./styleTransform');
const resolveNpm = require('./resolveNpm');
const generate = require('./generate');
const config = require('./config');
let cwd = process.cwd();
let inputPath = path.join(cwd, 'src');
let entry = path.join(inputPath, 'app.js');
let cache = {};

// eslint-disable-next-line
let libNames = (()=>{
    var list = [];
    Object.keys(config).forEach((key)=>{
        let libName = config[key]['libName'];
        if (libName){
            list.push(libName);
        }
    });
    return list;
})();


let needUpdate = (id, code)=>{
    let sha1 = crypto.createHash('sha1').update(code).digest('hex');
    return new Promise((resolve, reject)=>{
        if (!cache[id] || cache[id] != sha1){
            cache[id] = sha1;
            resolve(1);
        } else {
            reject(0);
        }
        
    });
    
};



const isNpm = (path)=>{
    return /\/node_modules\//.test(path);
};
const isStyle = (path)=>{
    return /\.(?:less|scss|sass)$/.test(path);
};

const isJs = (path)=>{
    return /\.js$/.test(path);
};

//const missNpmModule = [];

// function getExecutedOrder(list) {
//     let ret = [];
//     let loaded = {};
//     let fakeUrl = Math.random() + '.js';
//     let allDeps = {};

//     function sortOrder(list, parent) {
//         let needCheck = 0, delayFiles = [], again = false;
//         let n = list.length;
//         for (let i = 0; i < n; i++) {
//             let el = list[i];
//             if (!el) {//i--变成undefined
//                 continue;
//             }
//             if (typeof el != 'object') {
//                 if (allDeps[el]) { //如果它是字符串，变成｛id, deps｝
//                     el = allDeps[el]; //转换成对象
//                 } else {
//                     if (el.slice(-3) !== '.js') {//如果是.less, .scss
//                         needCheck++;
//                         ret.push(el);
//                         loaded[el] = true;
//                         list.splice(i, 1);
//                         i--;
//                         continue;
//                     } else {
//                         again = true;
//                         continue;
//                     }
//                 }
//             } else {
//                 allDeps[el.id] = el;
//             }
//             if (loaded[el.id]) {
//                 needCheck++;
//                 loaded[el.id] = true;
//                 list.splice(i, 1);
//                 i--;
//             } else {
//                 if (el.deps.length) {
//                     delayFiles.push(el);
//                 } else {
//                     //如果没有依赖
//                     if (el.id !== fakeUrl && !loaded[el.id]) {
//                         loaded[el.id] = true;
//                         ret.push(el.id);
//                     }
//                     list.splice(i, 1);
//                     i--;
//                     needCheck++;
//                 }
//             }
//         }
//         if (again) { //保存所有数字都能从allDeps拿到数据
//             sortOrder(list, parent);
//         }
//         if (needCheck === n) {
//             if (parent.id !== fakeUrl && !loaded[parent.id]) {
//                 loaded[parent.id] = true;
//                 ret.push(parent.id);
//             }
//         }
//         if (needCheck && delayFiles.length) {
//             delayFiles.forEach(function (el) {
//                 sortOrder(el.deps, el);
//             });
//         }
//         if (needCheck && list.length) {
//             sortOrder(list, parent);
//         }
//     }
//     sortOrder(list, { id: fakeUrl });
//     if (list.length){
//         // eslint-disable-next-line
//         console.warn('发生循环依赖，导致无法解析，请查看以下文件', list);
//     }
//     return ret;
// }
utils.asyncReact();
class Parser {
    constructor(entry) {
        this.entry = entry;
        this.isWatching = false;
        this.jsFiles = [];
        this.styleFiles = [];
        this.npmFiles = [];
        this.customAliasConfig = utils.getCustomAliasConfig();
        this.inputConfig = {
            input: this.entry,
            plugins: [
                alias( this.customAliasConfig ),  //搜集依赖时候，能找到对应的alias配置路径
                resolve({
                    jail: path.join(cwd), //从项目根目录中搜索npm模块, 防止向父级查找
                    customResolveOptions: {
                        moduleDirectory: path.join(cwd, 'node_modules')
                    }
                }),
                commonjs({
                    include: 'node_modules/**'
                }),
                rollupLess({
                    output: function(code) {
                        return code;
                    }
                }),
                rollupSass({
                    output: function(code) {
                        return code;
                    }
                }),
                rbabel({
                    babelrc: false,
                    runtimeHelpers: true,
                    presets: ['react'],
                    externalHelpers: false,
                    plugins: [
                        'transform-class-properties',
                        'transform-object-rest-spread',
                        'transform-es2015-template-literals',
                    ]
                })
            ],
            onwarn: (warning)=>{
                
                //warning.importer 缺失依赖文件路径
                //warning.source   依赖的模块名
                if (warning.code === 'UNRESOLVED_IMPORT'){
                    if (this.customAliasConfig[warning.source.split('/')[0]]) return;
                    // eslint-disable-next-line
                    console.log(chalk.red(`缺少${warning.source}, 请检查`));
                }
            }
        };
    }
    async parse() {
        const bundle = await rollup.rollup(this.inputConfig);
        bundle.modules.forEach((item)=> {
            const id = item.id;
            if (/commonjsHelpers/.test(id)){
                return;
            } 
            if (isNpm(id)){
                this.npmFiles.push({
                    id: id,
                    originalCode: item.originalCode
                });
                return;
            }
            if (isStyle(id)){
                this.styleFiles.push({
                    id: id,
                    originalCode: item.originalCode
                });
                return;
            }

            if (isJs(id)){
                this.jsFiles.push({
                    id: id,
                    originalCode: item.originalCode,
                    resolvedIds: this.filterNpmModule(item.resolvedIds) //处理路径alias配置
                });
            }

           
        });
      
        this.transform();
        this.copyAssets();
        generate();
    }
    filterNpmModule(resolvedIds){
        let result = {};
        Object.keys(resolvedIds).forEach((key)=>{
            if (utils.isNpm(key)){
                result[key] = resolvedIds[key];
            }
        });
        return result;
    }
    transform(){
        this.updateJsQueue(this.jsFiles);
        this.updateStyleQueue(this.styleFiles);
        this.updateNpmQueue(this.npmFiles);
    }
    updateJsQueue(jsFiles){
        while (jsFiles.length){
            let {id, originalCode, resolvedIds} = jsFiles.shift();
            needUpdate(id, originalCode)
                .then(()=>{
                    miniTransform.transform(id, resolvedIds);
                })
                .catch(()=>{
                
                });
        }
    }
    updateStyleQueue(styleFiles){
        while (styleFiles.length){
            let {id, originalCode} = styleFiles.shift();
            needUpdate(id, originalCode)
                .then(()=>{
                    styleTransform(id);
                })
                .catch(()=>{

                });
        }
      
    }
    updateNpmQueue(npmFiles){
        while (npmFiles.length){
            let item = npmFiles.shift();
            //rollup处理commonjs模块时候，会在id加上commonjs-proxy:前缀
            if (/commonjs-proxy:/.test(item.id)){
                item.id = item.id.split(':')[1];
                item.moduleType = 'cjs';
            } else {
                item.moduleType = 'es';
            }
            //处理所有npm模块中其他依赖
            needUpdate(item.id, item.originalCode)
                .then(()=>{
                    resolveNpm(item);
                })
                .catch(()=>{
                
                });
            
        }
       
    }
    copyAssets(){
        //to do 差异化copy
        const dir = 'assets';
        const inputDir = path.join(inputPath, dir);
        const distDir = path.join(path.join(cwd, 'dist'), dir);
        if (!fs.pathExistsSync(inputDir)) return;
        fs.ensureDirSync(distDir);
        fs.copy(
            inputDir,
            distDir,
            (err)=>{
                if (err){
                    // eslint-disable-next-line
                    console.error(err);
                } 
            }
        );
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
        this.isWatching = true;
        const watcher = chokidar
            .watch(watchDir, watchConfig)
            .on('all', (event, file) => {
                if (event === 'change') {
                    // eslint-disable-next-line
                    console.log(
                        `\nupdated: ${chalk.yellow(path.relative(cwd, file))}\n`
                    );
                    this.inputConfig.input = file;
                    this.parse();

                }
            });

        watcher.on('error', error => {
            // eslint-disable-next-line
            console.error('Watcher failure', error);
            process.exit(1);
        });
    }
}

// eslint-disable-next-line
async function build(arg, buildType) {
    if (arg === 'watch'){
        // eslint-disable-next-line
        console.log(chalk.green('watching files...'));
    } else if (arg === 'build'){
        // eslint-disable-next-line
        console.log(chalk.green('compile files...'));
    } else {
        // eslint-disable-next-line
    }
    
    const parser = new Parser(entry);
    await parser.parse();
    if (arg === 'watch') {
        parser.watching();
    }
}

module.exports = build;

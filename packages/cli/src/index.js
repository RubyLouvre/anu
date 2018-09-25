const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const rollup = require('rollup');
const rbabel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const rollupLess = require('rollup-plugin-less');
const rollupSass = require('rollup-plugin-sass');
const alias = require('rollup-plugin-alias');
const chokidar = require('chokidar');
const spawn = require('cross-spawn');
const utils = require('./utils');
const isComponentOrAppOrPage = new RegExp( utils.sepForRegex  + '(?:pages|app|components)'  );
const less = require('less');
const miniTransform = require('./miniTransform');
const styleTransform = require('./styleTransform');
const resolveNpm = require('./resolveNpm');
const generate = require('./generate');
const queue = require('./queue');
const config = require('./config');
let cwd = process.cwd();
let inputPath = path.join(cwd, 'src');
let outputPath = path.join(cwd, 'dist');
let entry = path.join(inputPath, 'app.js');
const log = console.log;

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


const isLib = filePath => {
    let name = path.parse(filePath).name;
    return libNames.includes(name.toUpperCase());
};
const isCss = ext => {
    const defileStyle = ['.less', '.scss', '.css'];
    return defileStyle.includes(ext);
};

const isNpmModules = (path)=>{
    return /\/node_modules\//.test(path);
};
const isStyle = (path)=>{
    return /\.(?:less|scss|sass)$/.test(path);
};

const isJs = (path)=>{
    return /\.js$/.test(path);
};

function getExecutedOrder(list) {
    let ret = [];
    let loaded = {};
    let fakeUrl = Math.random() + '.js';
    let allDeps = {};

    function sortOrder(list, parent) {
        let needCheck = 0, delayFiles = [], again = false;
        let n = list.length;
        for (let i = 0; i < n; i++) {
            let el = list[i];
            if (!el) {//i--变成undefined
                continue;
            }
            if (typeof el != 'object') {
                if (allDeps[el]) { //如果它是字符串，变成｛id, deps｝
                    el = allDeps[el]; //转换成对象
                } else {
                    if (el.slice(-3) !== '.js') {//如果是.less, .scss
                        needCheck++;
                        ret.push(el);
                        loaded[el] = true;
                        list.splice(i, 1);
                        i--;
                        continue;
                    } else {
                        again = true;
                        continue;
                    }
                }
            } else {
                allDeps[el.id] = el;
            }
            if (loaded[el.id]) {
                needCheck++;
                loaded[el.id] = true;
                list.splice(i, 1);
                i--;
            } else {
                if (el.deps.length) {
                    delayFiles.push(el);
                } else {
                    //如果没有依赖
                    if (el.id !== fakeUrl && !loaded[el.id]) {
                        loaded[el.id] = true;
                        ret.push(el.id);
                    }
                    list.splice(i, 1);
                    i--;
                    needCheck++;
                }
            }
        }
        if (again) { //保存所有数字都能从allDeps拿到数据
            sortOrder(list, parent);
        }
        if (needCheck === n) {
            if (parent.id !== fakeUrl && !loaded[parent.id]) {
                loaded[parent.id] = true;
                ret.push(parent.id);
            }
        }
        if (needCheck && delayFiles.length) {
            delayFiles.forEach(function (el) {
                sortOrder(el.deps, el);
            });
        }
        if (needCheck && list.length) {
            sortOrder(list, parent);
        }
    }
    sortOrder(list, { id: fakeUrl });
    if (list.length){
        // eslint-disable-next-line
        console.warn('发生循环依赖，导致无法解析，请查看以下文件', list);
    }
    return ret;
}

class Parser {
    constructor(entry) {
        this.entry = entry;
        this.isWatching = false;
        this.jsFiles = [];
        this.styleFiles = [];
        this.npmFiles = [];
        this.libFiles = [];
        this.inputConfig = {
            input: this.entry,
            plugins: [
                alias( utils.getAlias() ),
                resolve({
                    //从项目node_modules目录中搜索npm模块
                    jail: path.join(cwd, 'node_modules')
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
                if (warning.code === 'UNRESOLVED_IMPORT'){

                    
                    // console.log( chalk.red(`缺少依赖: ${warning.source}, 正在自动安装中, 请稍候`) );
                    // utils.installer(warning.source, ()=>{
                    //     //依赖安装成功
                    //     //npmSrc = npmResolve.sync(name, {basedir: path.join(cwd, 'node_modules')} );
                    // });
                }
            }
        };
    }
    async parse() {
        console.log('before--');
        const bundle = await rollup.rollup(this.inputConfig);
        console.log('after--');
        const self = this;
        bundle.modules.forEach(function(item) {
            const id = item.id;
            
            if (/commonjsHelpers/.test(id)){
                return;
            } 

            if (isLib(id)){
                this.libFiles.push(id);
                return;
            }

            if (isNpmModules(id)){
                //npm中会涉及到ast处理路径
                self.npmFiles.push({
                    id: id,
                    originalCode: item.originalCode
                });
                return;
            }
           
            if (isStyle(id)){
                self.styleFiles.push(id);
                return;
            }

            if (isJs(id)){
                
                

                self.jsFiles.push({
                    id: item.id,
                    code: item.originalCode,
                    resolvedIds: item.resolvedIds
                });
            }

            // files.push({
            //     id: id,
            //     deps: item.dependencies
            // });
        });
      
       
        //let sorted = getExecutedOrder(files);
        // let sorted = files;

        //console.log(queue.length);
        //console.log('before');
        await this.transform();
        // console.log('after');
        //console.log(queue.length);
        generate();
        
       
    }
    transform(){
        this.updateStyleQueue(this.styleFiles);
        this.updateJsQueue(this.jsFiles);
        this.updateNpmQueue(this.npmFiles);
    }
    updateJsQueue(files){
        files.forEach((file)=>{
            let {id, resolvedIds, code} = file;
            miniTransform.transform(id, code,  resolvedIds);
        });
    }
    updateStyleQueue(styleFiles){
        styleFiles.forEach((filePath)=>{
            styleTransform(filePath, styleFiles);
        });
        // for(let i = 0; i < styleFiles.length; i++){
        //     styleTransform(styleFiles[i], styleFiles);
        // }
    }
    updateNpmQueue(npmFiles){
        
        npmFiles.forEach((item)=>{
            //rollup处理commonjs模块时候，会在id加上commonjs-proxy:前缀
            if (/commonjs-proxy\:/.test(item.id)){
                item.id = item.id.split(':')[1];
            } 
            resolveNpm(item);
        });
    }
    // needBuild(dist, code){
    //     if (!this.isWatching) return true;
    //     //https://github.com/rollup/rollup-watch/blob/80c921eb8e4854622b31c6ba81c88281897f92d1/src/index.js#L19
    //     return fs.readFileSync(dist, 'utf-8') != code;
    // }
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

async function build(arg, buildType) {
    if (arg === 'start'){
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
    if (arg === 'start') {
        parser.watching();
    }
}

module.exports = build;

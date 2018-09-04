//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const rollup = require('rollup');
const rbabel = require('rollup-plugin-babel');
//const resolve = require("rollup-plugin-node-resolve");
const commonjs = require('rollup-plugin-commonjs');
const rollupLess = require('rollup-plugin-less');
const rollupSass = require('rollup-plugin-sass');
const alias = require('rollup-plugin-alias');
const chokidar = require('chokidar');
// const uglifyJS = require('uglify-js').minify;
// const cssmin = require('cssmin');
const utils = require('./utils');
const isComponentOrAppOrPage = new RegExp( utils.sepForRegex  + '(?:pages|app|components)'  );
const less = require('less');
const jsTransform = require('./jsTransform');
const helpers = require('./helpers');
const queue = require('./queue');
let cwd = process.cwd();
let inputPath = path.join(cwd, 'src');
let outputPath = path.join(cwd, 'dist');
let entry = path.join(inputPath, 'app.js');
const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);

if (nodejsVersion < 8) {
    // eslint-disable-next-line
    console.log(
        `当前nodejs版本为 ${chalk.red(process.version)}, 请保证 >= ${chalk.bold(
            '7'
        )}`
    );
}

const isLib = name => {
    return name.toUpperCase() === 'REACTWX';
};
const isJs = ext => {
    return ext === '.js';
};
const isCss = ext => {
    const defileStyle = ['.less', '.scss', '.css'];
    return defileStyle.includes(ext);
};

const getAlias = () => {
    let aliasField = require(path.join(cwd, 'package.json')).mpreact.alias;
    let aliasConfig = {};
    for (let key in aliasField) {
        aliasConfig[key] = path.resolve(cwd, aliasField[key]);
    }
    return aliasConfig;
};

const print = (prefix, msg) => {
    // eslint-disable-next-line
    console.log(chalk.green(`${prefix} ${msg}`));
};
function getExecutedOrder(list) {
    var ret = [];
    var loaded = {};
    var fakeUrl = Math.random();
    var allDeps = {};

    function sortOrder(list, parent, flag) {
        var needCheck = 0, arr = [], again = false;
        for (var i = 0, n = list.length; i < n; i++) {
            var el = list[i];
            if (!el) {
                continue;
            }
            if (typeof el == 'number') {
                if (allDeps[el]) {
                    el = allDeps[el]; //转换成对象
                } else {
                    again = true;
                    continue;
                }
            } else {
                allDeps[el.id] = el;
            }

            if (loaded[el.id]) {
                needCheck++;
                list.splice(i, 1);
                i--;
            } else {
                if (el.deps.length) {
                    arr.push(el);
                    // sortOrder(el.deps, el);
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
            //如果存在依赖
        }
        if (again){ //保存所有数字都能从allDeps拿到数据
            sortOrder(list, parent, true);
        }
        if (flag){
            return;
        }
        if (needCheck === n) {
            if (parent.id !== fakeUrl && !loaded[parent.id]) {
                loaded[parent.id] = true;
                ret.push(parent.id);
            }
        }
       
        if (needCheck && arr.length) {
            arr.forEach(function (el) {
                sortOrder(el.deps, el);
            });
        }
        if (needCheck &&  list.length){
            sortOrder(list, parent);
        }
    }

    sortOrder(list, { id: fakeUrl });

    return ret;
}
class Parser {
    constructor(entry) {
        this.entry = entry;
        this.isWatching = false;
        this.inputConfig = {
            input: this.entry,
            plugins: [
                // resolve({
                //     extensions: ['.js', 'jsx']
                // }),
                alias(getAlias()),
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
                    exclude: ['node_modules/**'],
                    presets: ['react'],
                    externalHelpers: false,
                    plugins: [
                        'transform-class-properties',
                        'transform-object-rest-spread'
                    ]
                })
            ],
            onwarn: (warning)=>{
                if (warning.code === 'UNRESOLVED_IMPORT'){
                    return;
                }
            }
        };
    }
    async parse() {
        const bundle = await rollup.rollup(this.inputConfig);
        const files = [], cssFiles = [];
        bundle.modules.forEach(function(item) {
            const id = item.id;
            if (/commonjsHelpers|node_modules/.test(id)){
                return;
            } 
            if (/\.(?:less|scss)$/.test(id)){
                cssFiles.push(id);
                return;
            }
            files.push({
                id: id,
                deps: item.dependencies
            });
        });
        let sorted =  getExecutedOrder(files);
        this.startCodeGen(sorted);
    }
    startCodeGen() {
        /*  let dependencies = files.sort(function(path) {
            if (path.indexOf('components') > 0) {
                return 1; //确保组件最后执行
            }
            return 0;
        });

        dependencies.forEach(path => {
            this.codegen(path);
        });
*/
        this.generateProjectConfig();
        this.generateAssets();
        
    }
    
    generateLib(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            let dist = file.replace('src', 'dist');
            if (isLib(name) && isJs(ext)) {
                let result = helpers.moduleToCjs.byPath(file);
                let code = result.code;
                fs.ensureFileSync(dist);
                
                if (!this.needBuild(dist, result.code)) return;
                code = this.uglify(code, 'js');
                fs.writeFile(dist, code, err => {
                    if (err){
                        reject(err);
                        print('build fail:', path.relative(cwd, dist));
                    } else {
                        resolve();
                        print('build success:', path.relative(cwd, dist));
                    }
                    
                });
            }
        });
    }
    uglify(code, type){
        // eslint-disable-next-line
        let _t = type;

        return code;
        // return code;
        // const methods = {
        //     css: cssmin,
        //     js: uglifyJS
        // };

        // if (!this.isWatching){
        //     let res = methods[type](code);
        //     result =  type === 'js' ? res.code : res;
        // } else {
        //     result = code;
        // }
       
        // return result;
    }
    minifyJson(code){
        let result = '';
        if (!this.isWatching){
            result = JSON.stringify(code);
        } else {
            result = JSON.stringify(code, null, 4);
        }
        return result;
    }
    needBuild(dist, code){
        if (!this.isWatching) return true;
        //https://github.com/rollup/rollup-watch/blob/80c921eb8e4854622b31c6ba81c88281897f92d1/src/index.js#L19
        return fs.readFileSync(dist, 'utf-8') != code;
    }
    async generateBusinessJs(file) {
        let { name, ext } = path.parse(file);
        let dist = file.replace('src', 'dist');
        
        if (isLib(name) || !isJs(ext)) return;
        let code = jsTransform.transform(file);
        if (isComponentOrAppOrPage.test(file)) {
            fs.ensureFileSync(dist);
            if (!this.needBuild(dist, code)) return;
            fs.writeFile(dist, code, err => {
                if (err){
                    // eslint-disable-next-line
                    console.log(err);
                    print('build fail:', path.relative(cwd, dist));
                } else {
                    print('build success:', path.relative(cwd, dist));
                }
                
            });

            //如果自己配置json, 先copy, 再根据config合并重新写入;
            let srcJson = file.replace(/\.js$/, '.json');
            let distJson = dist.replace(/\.js$/, '.json');
            if (fs.existsSync(srcJson)){
                fs.ensureFileSync(distJson);
                fs.copyFileSync(srcJson, distJson);
            }

        }
    }
    generateWxml(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            if (isLib(name) || !isJs(ext)) return;
            while (queue.wxml.length) {
                let data = queue.wxml.shift();
                if (!data) return;
                let dist = data.path;
                if (/pages|components/.test(dist)) {
                    fs.ensureFileSync(dist);
                    let code = data.code;
                    code = this.uglify(code, 'html');
                    fs.writeFile(dist, code || '', err => {
                        if (err){
                            reject(err);
                            print('build fail:', path.relative(cwd, dist));
                        } else {
                            resolve();
                            print('build success:', path.relative(cwd, dist));
                        }
                    });
                }

            }
        });
    }

    generatePageJson(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            if (isLib(name) || !isJs(ext)) return;
            let data = queue.pageConfig.shift();
            if (!data) return;
            let dist = data.path;
            let exitJsonFile = data.sourcePath.replace(/\.js$/, '.json');
            let json = data.code;
            
        
            //合并本地存在的json配置
            if ( fs.pathExistsSync(exitJsonFile) ) {
                try {
                    let localJson = require(exitJsonFile);
                    json = Object.assign( localJson, JSON.parse(data.code) );
                    json = JSON.stringify(json, null, 4);
                } catch (err){
                    // eslint-disable-next-line
                    console.error(err);
                    process.exit(1);
                }
                
            }
            
           
            if (/pages|app|components/.test(dist)) {
                fs.ensureFileSync(dist);
                fs.writeFile(dist, json, err => {
                    if (err){
                        reject(err);
                        print('build fail:', path.relative(cwd, dist));
                    } else {
                        resolve();
                        print('build success:', path.relative(cwd, dist));
                    }
                });
            }
        });
    }

    generateCss(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            let distDir = file.replace('src', 'dist');
            if (!isCss(ext)) return;
            let dist = path.join(path.dirname(distDir), `${name}.wxss`);
            let lessContent = fs.readFileSync(file).toString();
            fs.ensureFileSync(dist);
            if (ext === '.less' || ext === '.css') {
                less.render(lessContent, {})
                    .then(res => {
                        let code = res.css;
                        code = this.uglify(code, 'css');
                        fs.writeFile(dist, code, err => {
                            if (err){
                                reject(err);
                                print('build fail:', path.relative(cwd, dist));
                            } else {
                                resolve();
                                print('build success:', path.relative(cwd, dist));
                            }
                            
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            }

            if (ext === '.scss') {
                const sass = require(path.join(
                    cwd,
                    'node_modules',
                    'node-sass'
                ));
                sass.render(
                    {
                        file: file
                    },
                    (err, res) => {
                        if (err) throw err;
                        let code = res.css.toString();
                        code = this.uglify(code, 'css');
                        fs.writeFile(dist, code, err => {
                            if (err){
                                reject(err);
                                print('build fail:', path.relative(cwd, dist));
                            } else {
                                resolve();
                                print('build success:', path.relative(cwd, dist));
                            }
                        });
                    }
                );
            }
        });
    }

    generateProjectConfig() {
        let fileName = 'project.config.json';
        const dist = path.join(outputPath, fileName);
        if (!this.needBuild(dist, fs.readFileSync(path.join(inputPath, fileName), 'utf-8') )) return;
        const from = path.normalize(
            path.join(inputPath, fileName)
        );
        const to = path.normalize(dist);
        fs.ensureFileSync(to);
        fs.copyFile(from, to, (err)=>{
            if (err){
                print('build fail:', path.relative(cwd, dist));
            } else {
                print('build success:', path.relative(cwd, dist));
            }
           
        });
    }

    generateAssets() {
        //to do 差异化copy
        const dir = 'assets';
        const inputDir = path.join(inputPath, dir);
        const distDir = path.join(outputPath, dir);
        if (!fs.pathExistsSync(inputDir)) return;
        fs.ensureDirSync(distDir);
        fs.copy(
            inputDir,
            distDir,
            (err)=>{
                if (err){
                    // eslint-disable-next-line
                    console.error(err);
                    print('build fail:',  path.relative(cwd, distDir ) );
                } else {
                    print('build success:',  path.relative(cwd, distDir ) );
                }
            }
        );
        
    }

    async codegen(file) {
        await this.generateBusinessJs(file);
        Promise.all([
            this.generateWxml(file),
            this.generateLib(file),
            this.generatePageJson(file),
            this.generateCss(file)
        ])
            .catch(err => {
                if (err) {
                // eslint-disable-next-line
                console.log(chalk.red('ERR_MSG: ' + err));
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

async function build(arg) {
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

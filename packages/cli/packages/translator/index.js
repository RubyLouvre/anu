//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const rollup = require('rollup');
const rbabel =  require('rollup-plugin-babel');
//const resolve = require("rollup-plugin-node-resolve");
const commonjs = require('rollup-plugin-commonjs');
const rollupLess = require('rollup-plugin-less');
const rollupSass = require('rollup-plugin-sass');
const alias = require('rollup-plugin-alias');
const chokidar = require('chokidar');

const less = require('less');
const jsTransform = require('./jsTransform');
const helpers = require('./helpers');
const queue = require('./queue');
let cwd = process.cwd();
let inputPath = path.join(cwd, 'src');
let outputPath = path.join(cwd, 'dist');
let entry = path.join(inputPath, 'app.js');
const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);

if (nodejsVersion < 7) {
    // eslint-disable-next-line
    console.log(
        '当前nodejs版本为 ' +
            chalk.red(process.version) +
            ', 请保证 >= ' +
            chalk.bold('7')
    );
}

const isLib = name => {
    return name.toUpperCase() === 'REACTWX';
};
const isJs = ext => {
    return ext === '.js';
};
const isCss = ext => {
    const defileStyle = ['.less', '.scss'];
    return defileStyle.includes(ext);
};

const getAlias = () => {
    let aliasField = require(path.join(cwd, 'package.json')).mpreact.alias;
    let aliasConfig = {};
    for (let key in aliasField) {
        aliasConfig[key] = path.resolve(cwd, aliasField[key]);
    }
    return aliasConfig || {};
};


const print = (prefix, msg)=>{
    console.log(chalk.green(`${prefix} ${msg}`))
}

class Parser {
    constructor(entry) {
        this.entry = entry;
        this.inputConfig = {
            input: this.entry,
            plugins: [
                // resolve({
                //     extensions: ['.js', 'jsx']
                // }),
                alias(
                    getAlias()
                ),
                commonjs({
                    include: 'node_modules/**'
                }),
                rollupLess({
                    output: function(code){
                        return code
                    }
                }),
                rollupSass({
                    output: function(code){
                        return code
                    }
                }),
                rbabel({
                    babelrc: false,
                    runtimeHelpers: true,
                    exclude: ['node_modules/**'],
                    presets: ['react'],
                    externalHelpers: false,
                    plugins: [ 'transform-class-properties', 'transform-object-rest-spread'],
                })
                
            ]
        }

    }
    async parse() {
        const bundle =  await rollup.rollup(this.inputConfig);
        const files  = bundle.modules.map(function(item){
            if(/commonjsHelpers|node_modules/.test(item.id)) return;
            return item.id;
        });
        this.startCodeGen(files);
    }
    startCodeGen(files) {
       
        let dependencies = files.sort(function(
            path
        ) {
            if (path.indexOf('components') > 0) {
                return 1; //确保组件最后执行
            }
            return 0;
        });

        dependencies.forEach(file => {
            this.codegen(file);
        });

        this.generateProjectConfig();
    }
    generateLib(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            let dist = file.replace('src', 'dist');
            if (isLib(name) && isJs(ext)) {
                let result = helpers.moduleToCjs.byPath(file);
                fs.ensureFileSync(dist);
                fs.writeFile(dist, result.code, err => {
                    err ? reject(err) : resolve();
                    print('build sucess:', path.relative(cwd, dist));
                });
            }
        });
    }

    async generateBusinessJs(file) {
        let { name, ext } = path.parse(file);
        let dist = file.replace('src', 'dist');
        if (isLib(name) || !isJs(ext)) return;
        const code = jsTransform(file);
        if (/\/(?:pages|app|components)/.test(file)) {
            fs.ensureFileSync(dist);
            fs.writeFile(dist, code, err => {
                // eslint-disable-next-line
                if (err) console.log(err);
                print('build sucess:', path.relative(cwd, dist));
            });
        }
    }
    generateWxml(file) {
        return new Promise((resolve, reject) => {
            let { name, ext } = path.parse(file);
            if (isLib(name) || !isJs(ext)) return;
            while ( queue.wxml.length){
                let data = queue.wxml.shift();
                if (!data) return;
                let dist = data.path;
                if (/pages|components/.test(dist)) {
                    fs.ensureFileSync(dist);
                    fs.writeFile(dist, data.code || '', err => {
                        err ? reject(err) : resolve();
                        print('build sucess:', path.relative(cwd, dist));
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
            if (/pages|app|components/.test(dist)) {
                fs.ensureFileSync(dist);
                fs.writeFile(dist, data.code || '', err => {
                    err ? reject(err) : resolve();
                    print('build sucess:', path.relative(cwd, dist));
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
            if (ext === '.less') {
                less.render(lessContent, {})
                    .then(res => {
                        fs.writeFile(dist, res.css, err => {
                            err ? reject(err) : resolve();
                            print('build sucess:', path.relative(cwd, dist));
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
                    (err, result) => {
                        if (err) throw err;
                        fs.writeFile(dist, result.css.toString(), err => {
                            err ? reject(err) : resolve();
                            print('build sucess:', path.relative(cwd, dist));
                        });
                    }
                );
            }
        });
    }

    generateProjectConfig() {
        fs.ensureFileSync(path.join(outputPath, 'project.config.json'));
        fs.copyFile(
            path.join(inputPath, 'project.config.json'),
            path.join(outputPath, 'project.config.json')
        );
    }
    async codegen(file) {
        await this.generateBusinessJs(file);
        Promise.all([
            this.generateWxml(file),
            this.generateLib(file),
            this.generatePageJson(file),
            this.generateCss(file)
        ]).catch(err => {
            if (err) {
                // eslint-disable-next-line
                console.log(chalk.red('ERR_MSG: ' + err));
            }
        });
    }
    watching() {
       let watchDir = path.dirname(this.entry);
       let watchConfig = {
           ignored: /\.DS_Store|\.gitignore|.git/
       }
       const watcher = chokidar
                       .watch(watchDir, watchConfig)
                       .on('all', (event, file)=>{
                           if(event === 'change'){
                              console.log();
                              console.log(`updated: ${chalk.yellow(path.relative(cwd, file))}`);
                              console.log();
                              this.codegen(file);
                           }
                       });

        watcher.on('error', error => {
            console.error('Watcher failure', error);
            process.exit(1);
        });
    }
}

async function build(arg) {
    if (arg !== 'start') {
        // eslint-disable-next-line
        console.log(chalk.green('compile files...'));
    }
    const parser = new Parser(entry);
    await parser.parse();
    if (arg === 'start') {
        // eslint-disable-next-line
        console.log(chalk.green('watching files...'));
        parser.watching();
    }
}

module.exports = build;

//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const less = require('less');
const jsTransform = require("./jsTransform");
const helpers = require('./helpers');
const queue = require('./queue');
let cwd = process.cwd();
let inputPath = path.join(cwd, 'src');
let outputPath = path.join(cwd, 'dist');
let entry = path.join(inputPath, "app.js");
const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);

 if (nodejsVersion < 7) {
     console.log(
        "当前nodejs版本为 " +
       chalk.red(process.version) +
        ", 请保证 >= " +
         chalk.bold("7")
     );
 }


const isLib = (name)=>{
    return name.toUpperCase() === 'REACTWX';
}
const isJs = (ext)=>{
    return ext === '.js';
}
const isCss = (ext)=>{
    const defileStyle = [
        '.less',
        '.scss'
    ];
    return defileStyle.includes(ext)
}

const getAlias = ()=>{
    //webpack分析入口依赖时，若npm无路径，会被当成npm模块
    let aliasField = require( path.join(cwd, 'package.json') ).mpreact.alias;
    let aliasConfig = {};
    for(let key in aliasField){
        aliasConfig[key] = path.resolve(cwd, aliasField[key])
    }
    return aliasConfig || {};
}


class Parser {
    constructor(entry){
        this.entry = entry;
        this.compiler = null;
        this.statsHash = '';
        this.config = {
            entry: path.resolve(this.entry),
            module: {
                loaders: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react'],
                            plugins: [
                                require(
                                    'babel-plugin-transform-class-properties'
                                )
                            ]
                        }
                    }
                ]

            },
            resolve: {
               alias: getAlias()
            }
        }
    }
    async parse(){
       this.compiler = webpack(this.config);
       this.compiler.outputFileSystem = new MemoryFS();
       this.compiler.run((err, stats)=>{
            if(err) throw err;
            this.startCodeGen(stats)
      })

    }
    startCodeGen(stats){
        //webpack watch 可能触发多次 build https://webpack.js.org/api/node/#watching
        if(this.statsHash === stats.hash) return;
        this.statsHash = stats.hash;

        let errors = stats.toJson().errors;
        for(let i = 0; i <  errors.length; i++){
            if(/SyntaxError\:/.test(errors[i])){
                throw errors[i];
            }
        }

        let dependencies = stats.compilation.fileDependencies.sort(function(path){
            if(path.indexOf("components") > 0){
                return 1;//确保组件最后执行
            }
            return 0
        })
       // console.log(dependencies)
       
        dependencies.forEach((file)=>{
            if(!/node_modules/g.test(file)){
                console.log(file, '------file-----');
                this.codegen(file);
            }
        })
        
        this.generateProjectConfig();
    }
    generateLib(file){
        return new Promise((resolve, reject)=>{
            let {name, ext} = path.parse(file);
            let dist = file.replace('src', 'dist');
            if(isLib(name) && isJs(ext)){
                let result = helpers.moduleToCjs.byPath(file);
                fs.ensureFileSync(dist);
                fs.writeFile(dist, result.code, (err)=>{
                    err ? reject(err) : resolve();
                })
            }
        })
    }

    async generateBusinessJs(file){
        let {name, ext} = path.parse(file);
        let dist = file.replace('src', 'dist');
        if( isLib(name) || !isJs(ext) ) return;
        const code = jsTransform(file);
        if (/\/(?:pages|app|components)/.test(file)){
            fs.ensureFileSync(dist);
            fs.writeFile(dist, code, (err)=>{
                if(err) console.log(err);
            });
        }
    }
    generateWxml(file){
        return new Promise((resolve, reject)=>{
            let {name, ext} = path.parse(file);
            if( isLib(name) || !isJs(ext) ) return;
            let data = queue.wxml.shift();
            if(!data) return;
            let dist = data.path;
            if(/pages|components/.test(dist)){
                fs.ensureFileSync(dist);
                fs.writeFile(dist, data.code || '', (err)=>{
                    err ? reject(err) : resolve();
                })  
            }
        })
    }

    generatePageJson(file){
        return new Promise((resolve, reject)=>{
            let {name, ext} = path.parse(file);
            if( isLib(name) || !isJs(ext) ) return;
            let data = queue.pageConfig.shift();
            if(!data) return;
            let dist = data.path;
            if(/pages|app|components/.test(dist)){
                fs.ensureFileSync(dist);
                fs.writeFile(dist, data.code || '', (err)=>{
                    err ? reject(err) : resolve();
                })  
            }
        });

    }
    generateCss(file){
        return new Promise((resolve, reject)=>{
            let { name , ext} = path.parse(file);
            let dist = file.replace('src', 'dist');
            if(!isCss(ext)) return;
            let wxssDist = path.join(path.dirname(dist), `${name}.wxss`);
            let lessContent = fs.readFileSync(file).toString();
            if(ext === '.less'){
                less.render(lessContent, {})
                .then((res)=>{
                    fs.writeFile(wxssDist, res.css, (err)=>{
                        err ? reject(err) : resolve();
                    });
                })
                .catch((err)=>{
                    throw err;
                })
            }

            
            if(ext === '.scss'){
                const sass = require(path.join(cwd, 'node_modules', 'node-sass'));
                sass.render({
                    file: file
                }, (err, result)=>{
                    if(err) throw err;
                    fs.writeFile(wxssDist, result.css.toString(), (err)=>{
                        err ? reject(err) : resolve();
                    });
                })
            }
        })
        
    }
    
    generateProjectConfig(){
        fs.copyFile(
            path.join(inputPath, 'project.config.json'),
            path.join(outputPath, 'project.config.json')
        )
    }
    async codegen(file){
        await this.generateBusinessJs(file);
        Promise.all([
            this.generateWxml(file),
            this.generateLib(file),
            this.generatePageJson(file),
            this.generateCss(file),
        ])
        .catch((err)=>{
            if(err){
                console.log(chalk.red('ERR_MSG: '+ err));
            }
        })
       
    }
    watching(){
        const watching = this.compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
          }, (err, stats) => {
            if(err) throw err;
            this.startCodeGen(stats);
        });
    }
}

async function build(arg){
    if(arg !== 'start'){
        console.log(chalk.green('compile files...'));
    }
    const parser = new Parser(entry);
    await parser.parse();
    if(arg === 'start'){
        console.log();
        console.log(
            chalk.green('watching files...')
        );
        parser.watching();
    }
}

module.exports = build;
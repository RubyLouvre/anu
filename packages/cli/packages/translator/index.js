//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const less = require('less');
const transform = require("./transform");
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


 const log = console.log;

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

//const scriptRunRootPath = path.resolve(__dirname, '..', '..');

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
            plugins: [
               // new webpack.IgnorePlugin()
            ]
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
    async startCodeGen(stats){
        //webpack watch 可能触发多次 build https://webpack.js.org/api/node/#watching
        if(this.statsHash === stats.hash) return;
        this.statsHash = stats.hash;
        let dependencies = stats.compilation.fileDependencies;
        dependencies.forEach((file)=>{
            if(!/node_modules/g.test(file)){
                this.codegen(file);
            }
        })
       
        
      
        
        this.generateProjectConfig();
    }
    async generateLib(file){
        let {name, ext} = path.parse(file);
        let dist = file.replace('src', 'dist');
        if(isLib(name) && isJs(ext)){
            let result = helpers.moduleToCjs.byPath(file);
            fs.ensureFileSync(dist);
            fs.writeFile(dist, result.code, (err)=>{
                 if(err) throw err;
            })
        }
    }
    async generateBusinessJs(file){
        let {name, ext} = path.parse(file);
        let dist = file.replace('src', 'dist');
        if( isLib(name) || !isJs(ext) ) return;
        const code = await transform(file);
            
        if (/\/(?:pages|app|components)/.test(file)){
            fs.ensureFileSync(dist);
            fs.writeFile(dist, code, (err)=>{
                if(err) throw err;
            });
        }
       

    }

    async generateWxml(){
        var data = queue.wxml.shift();
        if(data && /pages|components/.test(data.path)){
            let wxmlDist =  data.path
            fs.ensureFileSync(wxmlDist);
            fs.writeFile(wxmlDist, data.code || '', (err)=>{
                if(err) throw err;
            })    
        }
       
    }

    async generateCss(file){
        let { name , ext}= path.parse(file);
        let dist = file.replace('src', 'dist');
        if(!isCss(ext)) return;
        let wxssDist = path.join(path.dirname(dist), `${name}.wxss`);
        let lessContent = fs.readFileSync(file).toString();
        if(ext === '.less'){
            less.render(lessContent, {})
            .then((res)=>{
                fs.writeFile(wxssDist, res.css, (err)=>{
                    if(err) throw err;
                });
            })
            .catch((err)=>{
                console.log(err)
            })
        }

        
        if(ext === '.scss'){
            const sass = require(path.join(cwd, 'node_modules', 'node-sass'));
            sass.render({
                file: file
            }, (err, result)=>{
                if(err) throw err;
                fs.writeFile(wxssDist, result.css.toString(), (err)=>{
                    if(err) throw err;
                });
            })
        }
        
    }
    async generatePageJson(){
        var data = queue.pageConfig.shift();
        if(data && /pages|app|components/.test(data.path)){
            let jsonDist = data.path;
            fs.ensureFileSync(jsonDist);
            fs.writeFile(jsonDist, data.code || '', (err)=>{
                if(err) throw err;
            })  
        }

    }
    generateProjectConfig(){
        fs.copyFile(
            path.join(inputPath, 'project.config.json'),
            path.join(outputPath, 'project.config.json')
        )
    }
    async codegen(file){
        await this.generateLib(file);
        await this.generateBusinessJs(file);
        await this.generateCss(file);
        await this.generatePageJson()
        await this.generateWxml();
       
    }
    watching(){
        //to do 优化
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
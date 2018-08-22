//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const less = require('less');
const transform = require("./transform");
const helpers = require('./helpers');
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

//const scriptRunRootPath = path.resolve(__dirname, '..', '..');

class Parser {
    constructor(entry){
        this.entry = entry;
        this.compiler = null;
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
    startCodeGen(stats){
        let dependencies = stats.compilation.fileDependencies;
        dependencies.forEach((file)=>{
            if(!/node_modules/g.test(file)){
                this.codegen(file);
            }
        })
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
        const output = await transform(file);
        if (/Page|App|Component/.test(output.componentType) && /\.js$/.test(file) ){
            fs.ensureFileSync(dist);
            fs.writeFile(dist, output.js, (err)=>{
                if(err) throw err;
            });
        }

        //generate wxml
        if(/Page|Component/.test(output.componentType)){
            let wxmlDist = path.join(path.dirname(dist), `${name}.wxml`);
            fs.ensureFileSync(wxmlDist);
            fs.writeFile(wxmlDist, output.wxml || '', (err)=>{
                if(err) throw err;
            })       
        }

        //generate page config json
        if (/Page|App|Component/.test(output.componentType) ){
            let jsonDist = path.join(path.dirname(dist), `${name}.json`);
            fs.ensureFileSync(jsonDist);
            fs.writeFile(jsonDist, output.pageJsonConfig, (err)=>{
                if(err) throw err;
            });
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
    generateProjectConfig(){
        fs.copyFile(
            path.join(inputPath, 'project.config.json'),
            path.join(outputPath, 'project.config.json')
        )
    }
    async codegen(file){
        await this.generateLib(file);
        await this.generateBusinessJs(file);
        await this.generateCss(file)
        await this.generateProjectConfig()
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
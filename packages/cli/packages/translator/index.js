//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7

const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const rBabel = require("rollup-plugin-babel");
const commonjs = require('rollup-plugin-commonjs');


const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const transform = require("./transform");
const modules = require("./modules");
const less = require('rollup-plugin-less');
const sass = require('node-sass');
const chokidar = require('chokidar');
let cwd = process.cwd();
let entryFolder = path.join(cwd, 'src');
let projectPath = entryFolder;
const sourceDirPath = path.join(cwd, 'src');
const outputDirPath = path.resolve(projectPath, '../dist');
const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);



if (nodejsVersion < 7) {
    console.log(
        "当前nodejs版本为 " +
        chalk.red(process.version) +
        ", 请保证 >= " +
        chalk.bold("7")
    );
}

const ignoreStyles = function() {
    return {
        visitor: {
            ImportDeclaration: {
                enter(path, {
                    opts
                }) {
                    const source = path.node.source.value;
                    if (/\.(less|scss)/.test(source)) {
                        path.remove();
                    }
                }
            }
        }
    };
};
class Parser {
    constructor(tPath) {
        this.path = tPath;
        this.outputs = [];
        this.inputOptions = {
            input: path.resolve(this.path),
            plugins: [
                less({
                    output: function(code, file){
                      let dist = file.replace('src', 'dist')
                                     .replace('less', 'wxss')
                      fs.ensureFileSync(dist);
                      fs.writeFileSync(dist, code, 'utf-8');
                      return code;
                    }
                }),
                resolve(),
                commonjs({
                    include: 'node_modules/**'
                }),
                rBabel({
                    exclude: ["node_modules/**"],
                    babelrc: false,
                    runtimeHelpers: true,
                    presets: ["react"],
                    plugins: [
                        "transform-object-rest-spread",
                        "transform-class-properties",
                       // ignoreStyles
                    ]
                })
                
            ]
        };
        this.output = outputDirPath;
    }

    async parse() {
        const bundle = await rollup.rollup(this.inputOptions);
        
        const modules = bundle.modules.reduce(function(
            collect, {
                id,
                dependencies,
                originalCode,
                code
            }
        ) {
            if(/\.(scss)$/.test(id)){
                sass.render({
                    file: id
                }, (err, result)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    let dist = id.replace('src', 'dist')
                                 .replace('scss', 'wxss')
                    fs.ensureFileSync(dist);
                    fs.writeFileSync(
                        dist,
                        result.css.toString(),
                        'utf-8'
                    );
                });
            }

            //忽略 rollupPluginBabelHelpers
            if (!/rollup|less|scss/.test(id)) {
                collect.push({
                    id: id,
                    code: originalCode,
                    babeled: code,
                    dependencies: dependencies.filter(d => {
                        if (!/rollup/.test(d)) return d;
                    })
                });
            }
            return collect;
        }, []);
        const promises = modules.map(m => {
            /**
             * TypeError [ERR_INVALID_ARG_VALUE]: The argument 'path' must be a string or Uint8Array without null bytes. Received 'path/anu/build/\u0000commonjsHelpers'
             * 总报这个错误，咱未查找到原因，暂时先屏蔽
             */

            if(!/commonjsHelpers/g.test(m.id)){
                return this.codegen.call(this, m.id, m.dependencies, m.code, m.babeled);
            }
            
        });
        await Promise.all(promises)
       
        //拷贝project.config.json
        const filePath = path.resolve(sourceDirPath, "project.config.json");
        if (fs.existsSync(filePath)) {
            fs.copyFile(filePath, path.join(this.output)  + "/project.config.json", () => {});
        }
    }

    async codegen(id, dependencies, code, babeled) {

        if(/node_modules/g.test(id)) return; //不写入npm资源。

        //生成文件
        let sourcePath = id;
        let baseDir = /reactWX/i.test(id) ? cwd : sourceDirPath;
        let srcPath = id.replace(baseDir, '');
        let destPath = path.join(this.output, srcPath);

        if(/reactWX/i.test(destPath)){
            let filename = path.basename(destPath);
            destPath = path.join(path.dirname(destPath), '..',  filename)
        }

        await fs.ensureFile(path.resolve(destPath));
        const output = transform(code, sourcePath);
        const basePath = destPath.replace(".js", "");

    
        
        //生成ReactWX
        if(/reactWX/i.test(destPath)){
            fs.writeFile(destPath, output.js, () => {});
            delete output.js
            this.outputs.push(output)
        }

        


        //生成JS与JSON
        if (/Page|App|Component/.test(output.componentType)) {
            fs.writeFile(destPath, output.js , () => {});
            delete output.js
            output.jsonPath = basePath + ".json"
            this.outputs.push(output)
            
        }
        //生成wxml与wxss
        if (/Page|Component/.test(output.componentType)) {
           fs.writeFile(basePath + ".wxml", output.wxml || "", () => {});
           // fs.writeFile(basePath + ".wxss", output.wxss||"", () => {});
        }
    }
    watch(dir) {

        const watcher = chokidar.watch(dir, {
            awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 200
            }
        });
       
        watcher.on('change', async (filePath)=>{
            console.warn(`文件变化: ${filePath} 重新编译`);
            if (/.js|.jsx/.test(filePath)) {
                //暂时不编译css
                Object.assign(
                    this.outputOptions || {},
                    {
                        input: filePath
                    }
                );
            }
            await this.parse();
            console.log();
            console.log(
                chalk.green('构建完毕')
            );
            console.log();
            
        })


    }
}

async function build(arg) {
    try {
        const parser = new Parser(path.join(projectPath, "app.js"));
        await parser.parse();
        // 暂时关闭watch方便开发
        if(arg === 'start'){
            console.log();
            console.log(
                chalk.green('watching files...')
            );
            parser.watch('./src')
        }
    } catch (e) {
        console.log(chalk.red(e));
        console.log(e);
    }
}


module.exports = build;
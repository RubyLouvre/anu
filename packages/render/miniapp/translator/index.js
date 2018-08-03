//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7

const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const rBabel = require("rollup-plugin-babel");
const commonjs = require('rollup-plugin-commonjs');


const chalk = require("chalk");
const path = require("path");
const wt = require("wt");
const fs = require("fs-extra");
const transform = require("./transform");
const modules = require("./modules");

let cwd = process.cwd();
let entryFolder = path.join(cwd, 'src', 'mi');
let projectPath = entryFolder;
const sourceDirPath = path.join(cwd, 'src');
const outputDirPath = path.resolve(projectPath, '../../build');

const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);

var log = console.log;
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
                    if (/.css/.test(source)) {
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
        this.outputs = []
        this.inputOptions = {
            input: path.resolve(this.path),
            plugins: [
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
                        ignoreStyles
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
            //忽略 rollupPluginBabelHelpers
            if (!/rollup/.test(id)) {
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
        await this.processJSON();
     
        //拷贝project.config.json
        const filePath = path.resolve(sourceDirPath, 'mi', "project.config.json");


        if (fs.existsSync(filePath)) {
            
            fs.copyFile(filePath, path.join(this.output, 'mi')  + "/project.config.json", () => {});
        }
    }
    async processJSON() {
        this.outputs.forEach(function(el) {
           // console.log(el.type)
          
        })
    }
    async codegen(id, dependencies, code, babeled) {

        if(/node_modules/g.test(id)) return; //不写入npm资源。

        //生成文件
        let sourcePath = id;
        let baseDir = /reactWX/i.test(id) ? cwd : sourceDirPath;
        let srcPath = id.replace(baseDir, '');
        let destPath = path.join(this.output, srcPath);

        if(/reactWX/i.test(destPath)){
            destPath = destPath.replace('dist', 'mi');
        }
        
        await fs.ensureFile(path.resolve(destPath));
        const output = transform(code, sourcePath);
        const srcBasePath = id.replace(".js", "");
        const basePath = destPath.replace(".js", "");

        

        
        //生成ReactWX
        if(/reactWX/i.test(destPath)){
            fs.writeFile(destPath, output.js, () => {});
            delete output.js
            this.outputs.push(output)
        }

        

        //生成JS与JSON
        if (/Page|App|Component/.test(output.componentType)) {
            fs.writeFile(destPath, output.js, () => {});
            delete output.js
            output.jsonPath = basePath + ".json"
            this.outputs.push(output)
            
        }
        //生成wxml与wxss
        if (/Page|Component/.test(output.componentType)) {
           
            fs.writeFile(basePath + ".wxml", output.wxml || "", () => {});
            fs.writeFile(basePath + ".wxss", output.wxss||"", () => {});
        }
    }

    watch(dir) {
        const watcher = wt.watch([dir]);
        watcher.on("all", info => {
            console.warn(`文件变化: ${info.path} 重新编译`);
            const p = info.path;
            if (/.js|.jsx/.test(p)) {
                //暂时不编译css
                this.outputOptions = { ...this.outputOptions,
                    input: p
                };
            }
            this.parse();
        });
    }
}

async function build() {
    try {
        const parser = new Parser(path.join(projectPath, "app.js"));
        await parser.parse();
        // 暂时关闭watch方便开发
        // parser.watch('./src')
    } catch (e) {
        console.log(chalk.red(e));
        console.log(e);
    }
}

build();
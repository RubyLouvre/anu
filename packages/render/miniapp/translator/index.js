//由于运行于nodejs环境，只能用require组织模块，并保证nodejs版本大于7

const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const rBabel = require("rollup-plugin-babel");
const chalk = require("chalk");
const path = require("path");
const wt = require("wt");
const fs = require("fs-extra");
const transform = require("./transform").transform;

let entryFolder = path.resolve(__dirname, "../example");
//const projectPath = process.cwd();
let projectPath = entryFolder;
const sourceDirPath = path.join(projectPath, "src");
const outputDirPath = path.join(projectPath, "build");
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
        enter(path, { opts }) {
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
    this.inputOptions = {
      input: path.resolve(this.path),
      plugins: [
        resolve(),
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
      collect,
      { id, dependencies, originalCode, code }
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
    },
    []);
    const promises = modules.map(m => {
      this.codegen.call(this, m.id, m.dependencies, m.code, m.babeled);
    });

    await Promise.all(promises);
    //拷贝project.config.json
    const filePath = path.resolve(sourceDirPath, "project.config.json");
    if (fs.existsSync(filePath)) {
      fs.copyFile(filePath, this.output + "/project.config.json", () => {});
    }
  }

  async codegen(id, dependencies, code, babeled) {
    //生成文件
    let sourcePath = id;
    let srcPath = id.replace(sourceDirPath, "");
    if (/node_modules/.test(srcPath)) {
      srcPath = srcPath.replace(path.resolve("node_modules"), "");
      srcPath = `nodeModules${srcPath}`;
    }
    const destPath = path.join(this.output, srcPath);
    //类库
    if (/wechat\.js/.test(destPath)) return;
    await fs.ensureFile(path.resolve(destPath));
    const output = transform(code, sourcePath, destPath, dependencies);
    const srcBasePath = id.replace(".js", "");
    const basePath = destPath.replace(".js", "");
    //生成JS与JSON
    if (/Page|App|Component/.test(output.type)) {
      fs.writeFile(destPath, output.js, () => {});
      fs.writeFile(basePath + ".json", JSON.stringify(output.json), () => {});
    }
    //生成wxml与wxss
    if (/Page|Component/.test(output.type)) {
      fs.writeFile(basePath + ".wxml", output.wxml, () => {});
      fs.writeFile(basePath + ".wxss", output.wxss, () => {});
    }
  }

  watch(dir) {
    const watcher = wt.watch([dir]);
    watcher.on("all", info => {
      console.warn(`文件变化: ${info.path} 重新编译`);
      const p = info.path;
      if (/.js|.jsx/.test(p)) {
        //暂时不编译css
        this.outputOptions = { ...this.outputOptions, input: p };
      }
      this.parse();
    });
  }
}

async function build() {
  try {
    const parser = new Parser(path.join(projectPath, "src/app.js"));
    await parser.parse();
    // 暂时关闭watch方便开发
    // parser.watch('./src')
  } catch (e) {
    console.log(chalk.redBright(e));
    console.log(e);
  }
}

build();

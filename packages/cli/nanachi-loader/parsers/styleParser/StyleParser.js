const path = require('path');
const postcss = require('postcss');
const utils = require('../../../packages/utils/index');
const fs = require('fs');
const quickFiles = require('../../../packages/quickFiles');

const sourcePath = path.resolve(process.cwd(), 'source');

class StyleParser {
    constructor({
        code,
        map,
        meta,
        filepath,
        platform,
        type
    }) {
        this.code = code || fs.readFileSync(filepath, 'utf-8');
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.type = type;
        this.platform = platform;
        if (/node_modules\/schnee-ui/.test(filepath)) {
            this.relativePath = path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        } else {
            this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        }
        this._postcssPlugins = [];
        this._postcssOptions = {};
        this.parsedCode = '';
        this.extraModules = [];
    }
    
    async parse() {
        const res = await new Promise((resolve, reject) => {
            postcss(this._postcssPlugins).process(this.code, this._postcssOptions).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
        const deps = utils.getDeps(res.messages);
        if (deps) {
            this.extraModules = deps.map(d => d.file);
        }
        this.parsedCode = res.css;
        return res;
    }
    getExtraFiles() {
        if (this.platform === 'quick') {
            const find = Object.keys(quickFiles).find(file => quickFiles[file].cssPath === this.filepath);
            if (find) {
                return [{
                    type: 'ux',
                    path: path.relative(sourcePath, find),
                    code: this.getUxCode(find)
                }];
            }
        }
        return [{
            type: 'css',
            path: this.relativePath,
            code: this.parsedCode,
        }];
    }
    getExportCode() {
        let res = `module.exports=${JSON.stringify(this.parsedCode)};`;
        this.extraModules.forEach(module => {
            res = `import '${module}';\n` + res;
        });
        return res;
    }
    getUxCode(path) {
        const obj = quickFiles[path];
        obj.cssCode = this.parsedCode ? `<style>\n${this.parsedCode}\n</style>` : '';
        return obj.header + '\n' + obj.jsCode + '\n' + obj.cssCode;
    }
}

module.exports = StyleParser;
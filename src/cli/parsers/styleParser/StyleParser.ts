import * as path from 'path';
import postcss from 'postcss';
import * as fs from 'fs';
import { StyleParserOptions } from './StyleParserFactory';
import webpack = require('webpack');
const utils = require('../../packages/utils/index');

class StyleParser {
    public map: any;
    public meta: any;
    public ast: any;
    public filepath: string;
    public code: string;
    public parsedCode: string;
    public platform: string;
    public type: string;
    public componentType: string;
    public relativePath: string;
    public extraModules: Array<string>;
    public loaderContext: webpack.loader.LoaderContext | {};
    protected _postcssPlugins: Array<any>;
    protected _postcssOptions: postcss.ProcessOptions;
    constructor({
        code,
        map,
        meta,
        filepath,
        platform,
        type,
        loaderContext
    }: StyleParserOptions) {
        this.code = code || fs.readFileSync(filepath, 'utf-8');
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.type = type;
        this.platform = platform;
        this.relativePath = this.getRelativePath(filepath);
        this._postcssPlugins = [
            require('stylelint')({
                configFile: require.resolve(`../../config/stylelint/.stylelint-${this.platform}.config.js`)
            }),
            require('../../packages/postcssPlugins/postCssPluginReport')
        ];
        this._postcssOptions = {};
        this.parsedCode = '';
        this.extraModules = [];
        this.loaderContext = loaderContext || {}; // loader中的this
    }
    getRelativePath(filepath: string) {
        if (/node_modules[\\\/]schnee-ui/.test(filepath)) {
            return path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        } else {
            return path.relative(path.resolve(process.cwd(), 'source'), filepath);
        }
    }
    async parse() {
        const res: postcss.Result = await new Promise((resolve, reject) => {
            postcss(this._postcssPlugins).process(this.code, this._postcssOptions).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
        const deps = utils.getDeps(res.messages);
        if (deps) {
            this.extraModules = deps.map((d: any) => d.file);
        }
        this.parsedCode = res.css;
        return res;
    }
    getExtraFiles() {
        return [{
            type: 'css',
            path: this.relativePath,
            code: this.parsedCode,
        }];
    }
    getExportCode() {
        let res = `module.exports=${JSON.stringify(this.parsedCode)};`;
        if (this.platform !== 'h5') {
            this.extraModules.forEach(module => {
                // windows 补丁
                module = module.replace(/\\/g, '\\\\');
                res = `import '${module}';\n` + res;
            });
        }
        return res;
    }
}

export default StyleParser;
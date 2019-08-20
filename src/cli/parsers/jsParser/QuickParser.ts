import * as path from 'path';
import JavascriptParser from'./JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
const mergeUx = require('../../packages/quickHelpers/mergeUx');
const quickFiles = require('../../packages/quickHelpers/quickFiles');
const utils = require('../../packages/utils/index');
const isStyle = (path: string) => {
    return /\.(?:less|scss|sass|css)$/.test(path);
};
const thePathHasCommon = /\bcommon\b/;

class QuickParser extends JavascriptParser {
    constructor(props: parserOptions) {
        super(props);
        this.filterCommonFile = thePathHasCommon.test(this.filepath) ? []: require('../../packages/babelPlugins/transformMiniApp')(this.filepath);
        this._babelPlugin = {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                [require('@babel/plugin-proposal-decorators'), { legacy: true }],
                [
                    require('@babel/plugin-proposal-class-properties'),
                    { loose: true }
                ],
                require('@babel/plugin-proposal-object-rest-spread'),
                [
                    //重要,import { Xbutton } from 'schnee-ui' //按需引入
                    require('babel-plugin-import').default,
                    {
                        libraryName: 'schnee-ui',
                        libraryDirectory: 'components',
                        camel2DashComponentName: false
                    }
                ],
                require('@babel/plugin-syntax-jsx'),
                require('../../packages/babelPlugins/collectDependencies'),
                require('../../packages/babelPlugins/collectTitleBarConfig'),
                require('../../packages/babelPlugins/patchComponents'),
                ...require('../../packages/babelPlugins/transformEnv'),
                [ require('@babel/plugin-transform-template-literals'), { loose: true }],
                require('../../packages/babelPlugins/transformIfImport'),
                ...this.filterCommonFile,
                ...require('../../packages/babelPlugins/patchAsyncAwait'),
            ]
        };
    }
    async parse() {
        const result = await super.parse();
        // 解析快应用依赖的样式文件
        let cssPath = this.extraModules.filter((fileId)=>{
            return isStyle(fileId);
        })[0];
        if (cssPath) {
            cssPath = path.resolve(path.dirname(this.filepath), cssPath);
            Object.assign(quickFiles[utils.fixWinPath(this.filepath)], { // \ => / windows补丁
                cssPath
            });
        }
        this.queues = result.options.anu && result.options.anu.queue || this.queues;

        // 合并ux文件
        const uxRes = await mergeUx({
            sourcePath: this.filepath,
            result,
            relativePath: this.relativePath
        }, this.queues);
        if (uxRes.type === 'ux') {
            this.queues.push({
                type: uxRes.type,
                path: this.relativePath,
                code: this.getUxCode(),
            });
        } else {
            this.queues.push({
                type: uxRes.type,
                path: this.relativePath,
                code: uxRes.code,
                ast: this.ast,
            });
        }
        return result;
    }
    getUxCode() {
        const obj = quickFiles[utils.fixWinPath(this.filepath)];
        let code = obj.header + '\n' + obj.jsCode;
        if (obj.cssPath) {
            let relativePath = path.relative( path.dirname(this.filepath),  obj.cssPath);
            relativePath = /^\w/.test(relativePath) ? './' + relativePath: relativePath;
            relativePath = relativePath
            .replace(/\\/g, '/')
            .replace(/\.(scss|sass|less)$/, '.css');
            code += `\n<style>\n@import '${relativePath}';\n</style>`
        }
        return code
    }
    
}

export default QuickParser;
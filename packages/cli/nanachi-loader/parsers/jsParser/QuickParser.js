const JavascriptParser = require('./JavascriptParser');
const mergeUx = require('../../../packages/quickHelpers/mergeUx');
const quickFiles = require('../../../packages/quickHelpers/quickFiles');
const path = require('path');
const utils = require('../../../packages/utils/index');

const isStyle = path => {
    return /\.(?:less|scss|sass|css)$/.test(path);
};

class QuickParser extends JavascriptParser {
    constructor(props) {
        super(props);
        this._babelPlugin = {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                [require('@babel/plugin-proposal-decorators'), { legacy: true }],
                /**
                 * [babel 6 to 7] 
                 * v6 default config: ["plugin", { "loose": true }]
                 * v7 default config: ["plugin"]
                 */
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
                require('../../../packages/babelPlugins/syntaxValidate'),
                require('../../../packages/babelPlugins/collectDependencies'),
                require('../../../packages/babelPlugins/collectTitleBarConfig'),
                //require('../../../packages/babelPlugins/collectWebViewPage'),
                require('../../../packages/babelPlugins/patchComponents'),
                ...require('../../../packages/babelPlugins/transformEnv'),
                [ require('@babel/plugin-transform-template-literals'), { loose: true }],
                ...require('../../../packages/babelPlugins/transformMiniApp')(this.filepath),
                ...require('../../../packages/babelPlugins/patchAsyncAwait'),
                require('../../../packages/babelPlugins/transformIfImport'),
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
        // 解析别名
        result.code = this.resolveAlias();

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
            });
        }
        

    }
    getUxCode() {
        const obj = quickFiles[utils.fixWinPath(this.filepath)];
        return obj.header + '\n' + obj.jsCode + '\n' + obj.cssCode;
    }
    
}

module.exports = QuickParser;
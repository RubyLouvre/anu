const JavascriptParser = require('./JavascriptParser');
const mergeUx = require('../../../packages/quickHelpers/mergeUx');
const quickFiles = require('../../../packages/quickFiles');
const StyleParserFactory = require('../styleParser/StyleParserFactory');
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
                require('../../../packages/babelPlugins/collectWebViewPage'),
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
            const extname = path.extname(cssPath).replace(/^\./, '');
            const styleParser = StyleParserFactory.create({
                type: extname === 'scss' ? 'sass' : extname,
                filepath: cssPath,
                platform: this.platform
            });
            const cssRes = await styleParser.parse();
            // 快应用移除一级样式依赖
            this.extraModules = this.extraModules.filter((fileId)=>{
                return !isStyle(fileId);
            });
            // 将样式文件中的依赖添加到extraModules中
            const deps = utils.getDeps(cssRes.messages);
            if (deps) {
                this.extraModules = this.extraModules.concat(deps.map(d => d.file));
            }
           
            Object.assign(quickFiles[this.filepath], {
                cssRes
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
        this.queues.push({
            type: uxRes.type,
            path: this.relativePath,
            code: uxRes.code,
            extraModules: this.extraModules
        });

    }
    
}

module.exports = QuickParser;
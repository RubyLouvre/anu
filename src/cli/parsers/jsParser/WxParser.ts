import JavascriptParser, { BabelRes } from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
const thePathHasCommon = /\bcommon\b/;

class WxParser extends JavascriptParser{
    constructor(props: parserOptions) {
        super(props);
        this.filterCommonFile = thePathHasCommon.test(this.filepath) ? []: require('../../packages/babelPlugins/transformMiniApp')(this.filepath)
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
        const res = await super.parse();
        this.queues = res.options.anu && res.options.anu.queue || this.queues;
        this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
        this.queues.push({
            type: 'js',
            path: this.relativePath,
            code: res.code,
            ast: this.ast,
            extraModules: this.extraModules
        });
        return res;
    }
}

export default WxParser;
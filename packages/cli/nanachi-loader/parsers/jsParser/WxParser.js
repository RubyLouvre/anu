const JavascriptParser = require('./JavascriptParser');

class WxParser extends JavascriptParser{
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
                require('../../../packages/babelPlugins/collectTitleBarConfig'),
                require('../../../packages/babelPlugins/collectWebViewPage'),
                require('../../../packages/babelPlugins/collectDependencies'),
                [ require('@babel/plugin-transform-template-literals'), { loose: true }],
                ...require('../../../packages/babelPlugins/transformMiniApp')(this.filepath),
                ...require('../../../packages/babelPlugins/transformEnv'),
                ...require('../../../packages/babelPlugins/patchAsyncAwait'),
                require('../../../packages/babelPlugins/transformIfImport'),
                // require('../../../packages/babelPlugins/trasnformAlias')( {sourcePath: this.filepath, platform: this.platform } )
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
            code: this.resolveAlias(res.code),
            extraModules: this.extraModules
        });
    }
}

module.exports = WxParser;
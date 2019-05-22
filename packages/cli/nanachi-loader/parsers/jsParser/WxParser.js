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
                //require('@babel/plugin-proposal-object-rest-spread'),
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
                require('@babel/plugin-syntax-dynamic-import'),
                require('../../../packages/babelPlugins/collectDependencies'),
                require('../../../packages/babelPlugins/collectTitleBarConfig'),
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
    }
}

module.exports = WxParser;
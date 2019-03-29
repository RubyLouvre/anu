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
                require('../../../cli/packages/babelPlugins/collectTitleBarConfig'),
                require('../../../cli/packages/babelPlugins/collectWebViewPage'),
                require('../../../cli/packages/babelPlugins/collectPatchComponents'),
                require('../../../cli/packages/babelPlugins/collectDependencies'),
                // ...require('../../../cli/packages/babelPlugins/validateJsx')(this.collectError),
                [require('@babel/plugin-transform-template-literals'), { loose: true }],
                ...require('../../../cli/packages/babelPlugins/transformMiniApp')(this.filepath),
                ...require('../../../cli/packages/babelPlugins/transformEnv'),
                ...require('../../../cli/packages/babelPlugins/injectRegeneratorRuntime'),
                require('../../../cli/packages/babelPlugins/transformIfImport'),
                require('../../../cli/packages/babelPlugins/trasnformAlias')( {sourcePath: this.filepath } )
            ]
        };
    }
}

module.exports = WxParser;
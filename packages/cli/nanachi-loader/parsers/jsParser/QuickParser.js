const JavascriptParser = require('./JavascriptParser');
const mergeUx = require('../../../packages/quickHelpers/mergeUx');

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
                require('../../../packages/babelPlugins/collectTitleBarConfig'),
                require('../../../packages/babelPlugins/collectWebViewPage'),
                require('../../../packages/babelPlugins/collectPatchComponents'),
                require('../../../packages/babelPlugins/collectDependencies'),
                // ...require('../../../packages/babelPlugins/validateJsx')(this.collectError),
                [require('@babel/plugin-transform-template-literals'), { loose: true }],
                ...require('../../../packages/babelPlugins/transformMiniApp')(this.filepath),
                ...require('../../../packages/babelPlugins/transformEnv'),
                ...require('../../../packages/babelPlugins/injectRegeneratorRuntime'),
                require('../../../packages/babelPlugins/transformIfImport'),
                require('../../../packages/babelPlugins/trasnformAlias')( {sourcePath: this.filepath, platform: this.platform } )
            ]
        };
    }
    async parse() {
        const result = await super.parse();
        const uxRes = await mergeUx({
            sourcePath: this.filepath,
            result
        });
        result.options.anu.queue.push({
            type: 'ux',
            path: this.relativePath,
            code: uxRes.code,
            extraModules: result.options.anu.extraModules
        });
    }
}

module.exports = QuickParser;
const JavascriptParser = require('./JavascriptParser');

class H5Parser extends JavascriptParser{
    constructor(props) {
        super(props);
        this._babelPlugin = {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
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
                require('@babel/plugin-syntax-jsx')
            ]
        };
        if (this.componentType === 'App') {
            this._babelPlugin.plugins.push(require('../../../packages/babelPlugins/transformH5App'));
        }
    }
    async parse() {
        const res = await super.parse();
        // this.queues = res.options.anu && res.options.anu.queue || this.queues;
        // this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
        this.queues.push({
            type: 'js',
            path: this.relativePath,
            code: res.code,
            ast: this.ast,
            extraModules: this.extraModules
        });
    }
    getExportCode() {
        // 只取出import语句，避免webpack解析jsx报错
        return super.getExportCode().replace(/^(?!\s*import).*\n?/gm, '');
    }
}

module.exports = H5Parser;
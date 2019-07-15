import JavascriptParser from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';

class H5Parser extends JavascriptParser{
    constructor(props: parserOptions) {
        super(props);
        this._babelPlugin = {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                [
                    require('@babel/plugin-syntax-class-properties'),
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
                require('../../packages/babelPlugins/transformIfImport'),
                require('../../packages/babelPlugins/h5/transformH5')
            ]
        };
        if (this.componentType === 'App') {
            this._babelPlugin.plugins.push(require('../../packages/babelPlugins/h5/transformH5App'));
        } else if (this.componentType === 'Page') {
            this._babelPlugin.plugins.push(require('../../packages/babelPlugins/h5/transformH5Page'));
        }
    }
    async parse() {
        const res = await super.parse();
        // 只有h5需要处理parsedCode，因为多一次babel.transform会再遍历ast树，损耗编译性能
        this.parsedCode = this.getCodeForWebpack();
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

export default H5Parser;
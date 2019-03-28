const path = require('path');
const babel = require('@babel/core');
const cwd = process.cwd();

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const relativePath = path.relative(path.resolve(this.rootContext, 'source'), this.resourcePath);
    const callback = this.async();
    try {
        // TODO 抽离路径，纯净plugin
        
        if (isReact(this.resourcePath)) {
            // return [{
            //     isDefault: true,
            //     type: 'js',
            //     path: relativePath,
            //     code: code
            // }];
            callback(null, [{
                isDefault: true,
                type: 'js',
                path: relativePath,
                code: code
            }], map, meta);
            return;
        }
        const res = await babel.transformFileAsync(this.resourcePath, {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            // presets: [require('@babel/preset-react')],
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
                require('../../cli/packages/babelPlugins/collectTitleBarConfig'),
                require('../../cli/packages/babelPlugins/collectWebViewPage'),
                require('../../cli/packages/babelPlugins/collectPatchComponents'),
                // ...require('../../cli/packages/babelPlugins/validateJsx')(this.collectError),
                [require('@babel/plugin-transform-template-literals'), { loose: true }],
                ...require('../../cli/packages/babelPlugins/transformMiniApp')(this.resourcePath),
                ...require('../../cli/packages/babelPlugins/transformEnv'),
                ...require('../../cli/packages/babelPlugins/injectRegeneratorRuntime'),
                require('../../cli/packages/babelPlugins/transformIfImport'),
                require('../../cli/packages/babelPlugins/trasnformAlias')( {sourcePath: this.resourcePath } )
            ]
        });
        if (!res.options.anu) {
            res.options.anu = {};
            res.options.anu.queue = [];
        }
        res.options.anu.queue.push({
            isDefault: true,
            type: 'js',
            path: relativePath,
            code: res.code,
            extraModules: res.options.anu.extraModules
        });

        callback(null, res.options.anu.queue, map, meta);
        return;
    
        // return res.options.anu.queue;
    } catch (e) {
        console.log(e);
        callback(e, '', map, meta);
        return;
    }
    
};
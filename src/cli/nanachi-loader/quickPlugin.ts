import webpack = require("webpack");

const config = require('../config/config');
const id = 'QuickPlugin';
const path = require('path');

class QuickPlugin {
    apply(compiler: webpack.Compiler) {
        // 删除webpack打包产物
        compiler.hooks.emit.tap(id, (compilation) => {
            if (config.quick.disabledTitleBarPages.size) {
                const json = JSON.parse(compilation.assets['manifest.json'].source());
                for (var disabledTitleBarPage of config.quick.disabledTitleBarPages) {
                    const relativePath = 
                        path.relative(path.resolve(process.cwd(), 'source'), disabledTitleBarPage)
                            .replace(/\/index\.js$/, '');
                    json.display.pages = json.display.pages || {};
                    json.display.pages[relativePath] = {
                        titleBar: false
                    };
                }
                compilation.assets['manifest.json'].source = function() {
                    return JSON.stringify(json, null, 4);
                };
            }
        });
    }
}

export default QuickPlugin;
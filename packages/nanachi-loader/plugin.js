const path = require('path');
const RuleSet = require('webpack/lib/RuleSet');

const resolveBySource = (function() {
    return function(...args) {
        return path.resolve(...args, './source');
    };
}());

class NanachiWebpackPlugin {
    apply(compiler) {
        const id = 'NanachiWebpackPlugin';
        // const rawRules = compiler.options.module.rules;
        // const { rules } = new RuleSet(rawRules);
        // const filtJsCssRules = (rule) => {
        //     // 过滤以下loader配置
        //     const filtExts = new Set(['js', 'jsx', 'css', 'scss', 'sass', 'less']);
        //     for (const i of filtExts) {
        //         if (rule.resource(`.${i}`)) {
        //             rule.use.unshift({
        //                 loader: require.resolve('./loaders/fileLoader')
        //             });
        //             break;
        //         }
        //     }
        //     return rule;
        // };
        // console.log(compiler.options.module);
        // const sourceDir = resolveBySource(compiler.context);
        // compiler.hooks.make.tap(id, (compilation) => {
        //     compilation.hooks.succeedModule.tap(id, (module) => {
        //         if (module.resource.match(/node_modules/)) {
        //             return;
        //         }
        //         const relativePath = path.relative(sourceDir, module.resource);
        //         // 如果目录定位在dist上级，返回
        //         if (/^\.\./.test(relativePath)) {
        //             return;
        //         }
        //         if (/\.jsx?$/.test(relativePath)) {
        //             compilation.assets[relativePath] = {
        //                 source: () => {
        //                     return module._source._value;
        //                 },
        //                 size: () => {
        //                     return module._source._value.length;
        //                 }
        //             };
        //         }
        //         if (module.nanachiAssets && module.nanachiAssets instanceof Array) {
        //             module.nanachiAssets.forEach((asset) => {
        //                 const { path: filePath , code } = asset;
        //                 const relativePath = path.relative(sourceDir, filePath);
        //                 compilation.assets[relativePath] = {
        //                     source: () => {
        //                         return code;
        //                     },
        //                     size: () => {
        //                         return code.length;
        //                     }
        //                 };
        //             });
        //         }
        //     });
        // });
        // 删除webpack打包产物
        compiler.hooks.emit.tap(id, (compilation) => {
            delete compilation.assets[compiler.options.output.filename];
        });
        
        compiler.hooks.done.tap(id, () => {
            console.log(`编译完成，耗时：${process.uptime()}s`);
        });
    }
}

module.exports = NanachiWebpackPlugin;
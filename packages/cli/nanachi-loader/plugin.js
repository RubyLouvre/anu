const Timer = require('../packages/utils/timer');
const { resetNum, timerLog } = require('./logger/index');
const setWebView = require('../packages/utils/setWebVeiw');
const id = 'NanachiWebpackPlugin';
const pageConfig = require('../packages/h5Helpers/pageConfig');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

class NanachiWebpackPlugin {
    constructor({
        platform = 'wx',
        compress = false,
        beta,
        betaUi
    } = {}) {
        this.timer = new Timer();
        this.nanachiOptions = {
            platform,
            compress,
            beta,
            betaUi
        };
    }
    apply(compiler) {

        compiler.hooks.compilation.tap(id, (compilation) => {
            compilation.hooks.normalModuleLoader.tap(id, (loaderContext) => {
                loaderContext.nanachiOptions = this.nanachiOptions;
            });
        });
        
        // 删除webpack打包产物
        compiler.hooks.emit.tap(id, (compilation) => {
            if (this.nanachiOptions.platform === 'h5') {
                // 生成pageConfig 文件 用于动态加载情况下，读取页面配置信息
                // console.log(generate(t.exportDefaultDeclaration(pageConfig)).code);
                const { code } = generate(t.exportDefaultDeclaration(pageConfig));
                compilation.assets['pageConfig.js'] = {
                    source: function() {
                        return code;
                    },
                    size: function() {
                        return code.length;
                    }
                };
            }
            const reg = new RegExp(compiler.options.output.filename);
            Object.keys(compilation.assets).forEach(key => {
                if (reg.test(key)) {
                    delete compilation.assets[key];
                }
            });
        });

        compiler.hooks.run.tapAsync(id, async (compilation, callback) => {
            this.timer.start();
            resetNum();
            callback();
        });

        compiler.hooks.watchRun.tapAsync(id, async (compilation, callback) => {
            this.timer.start();
            resetNum();
            callback();
        });
        
        compiler.hooks.done.tap(id, () => {

            this.timer.end();
            
            setWebView(compiler.NANACHI && compiler.NANACHI.webviews);

            timerLog(this.timer);
        });
     
    }
}

module.exports = NanachiWebpackPlugin;
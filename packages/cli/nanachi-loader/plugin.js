const path = require('path');
const Timer = require('../packages/utils/timer');
const { resetNum, timerLog } = require('./logger/index');

const id = 'NanachiWebpackPlugin';

class NanachiWebpackPlugin {
    constructor({
        platform
    }) {
        this.timer = new Timer();
        this.nanachiOptions = {
            platform
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
            delete compilation.assets[compiler.options.output.filename];
        });

        compiler.hooks.run.tap(id, () => {
            this.timer.start();
            resetNum();
        });

        compiler.hooks.watchRun.tap(id, () => {
            this.timer.start();
            resetNum();
        });
        
        compiler.hooks.done.tap(id, () => {
            this.timer.end();
            timerLog(this.timer);
        });
        
    }
}

module.exports = NanachiWebpackPlugin;
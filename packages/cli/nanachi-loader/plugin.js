const path = require('path');
const Timer = require('../packages/utils/timer');
const { resetNum, timerLog, errorLog, warningLog } = require('./logger/index');


const errorStack = require('./logger/queue');

const id = 'NanachiWebpackPlugin';

class NanachiWebpackPlugin {
    constructor({
        platform = 'wx',
        compress = false
    } = {}) {
        this.timer = new Timer();
        this.nanachiOptions = {
            platform,
            compress
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

            
            errorStack.warning.forEach(function(warning){
                warningLog(warning);
            });

            if (errorStack.error.length) {
                errorStack.error.forEach(function(error){
                    errorLog(error);
                });
                process.exit(1);
            }

            timerLog(this.timer);
        });
        
    }
}

module.exports = NanachiWebpackPlugin;
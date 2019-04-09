const path = require('path');
const Timer = require('../packages/utils/timer');
const { resetNum, timerLog } = require('./logger/index');
const runBeforeParseTasks = require('../commands/runBeforeParseTasks');
const fs = require('fs-extra');
const cwd = process.cwd();

const id = 'NanachiWebpackPlugin';

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
            delete compilation.assets[compiler.options.output.filename];
        });

        compiler.hooks.run.tapAsync(id, async (compilation, callback) => {
            this.timer.start();
            resetNum();
            await runBeforeParseTasks({
                buildType: this.nanachiOptions.platform,
                beta: this.nanachiOptions.beta,
                betaUi: this.nanachiOptions.betaUi
            });
            callback();
        });

        compiler.hooks.watchRun.tapAsync(id, async (compilation, callback) => {
            this.timer.start();
            resetNum();
            await runBeforeParseTasks({
                buildType: this.nanachiOptions.platform,
                beta: this.nanachiOptions.beta,
                betaUi: this.nanachiOptions.betaUi
            });
            callback();
        });
        
        compiler.hooks.done.tap(id, () => {
            this.timer.end();
            timerLog(this.timer);
            // 删除__npm__目录
            // const npmDir = path.resolve(cwd, 'source/npm');
            // fs.remove(npmDir);
        });
        
    }
}

module.exports = NanachiWebpackPlugin;
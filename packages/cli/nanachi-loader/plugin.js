const path = require('path');
const Timer = require('../packages/utils/timer');

const id = 'NanachiWebpackPlugin';

class NanachiWebpackPlugin {
    constructor() {
        this.timer = new Timer();
    }
    apply(compiler) {
        
        // 删除webpack打包产物
        compiler.hooks.emit.tap(id, (compilation) => {
            delete compilation.assets[compiler.options.output.filename];
        });

        compiler.hooks.run.tap(id, () => {
            this.timer.start();
        });

        compiler.hooks.watchRun.tap(id, () => {
            this.timer.start();
        });
        
        compiler.hooks.done.tap(id, () => {
            this.timer.end();
            console.log(`编译完成，耗时：${this.timer.getProcessTime()}s`);
        });
        
    }
}

module.exports = NanachiWebpackPlugin;
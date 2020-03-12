"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const id = 'ChaikaPlugin';
const cwd = process.cwd();
const fs = require('fs-extra');
class ChaikaPlugin {
    apply(compiler) {
        compiler.hooks.afterCompile.tap(id, (compilation) => {
            compilation.contextDependencies.add(path.join(cwd, '../../source'));
        });
        compiler.hooks.watchRun.tap(id, () => {
            const { watchFileSystem } = compiler;
            const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;
            const changedFile = Object.keys(watcher.mtimes);
            const sourceReg = /\/source\//;
            changedFile.forEach((file) => {
                if (sourceReg.test(file.replace(/\\/g, '/'))) {
                    fs.copy(file, file.replace(sourceReg, '/.CACHE/nanachi/source/'), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    }
}
exports.default = ChaikaPlugin;

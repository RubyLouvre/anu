"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const id = 'ChaikaPlugin';
const cwd = process.cwd();
const fs = require('fs-extra');
class ChaikaPlugin {
    apply(compiler) {
        compiler.hooks.afterCompile.tap(id, (compilation) => {
            compilation.contextDependencies.add(path.join(cwd, 'source'));
        });
        compiler.hooks.invalid.tap(id, (fileName) => {
            const sourceReg = new RegExp(`\\${path.sep}source\\${path.sep}`);
            fs.copy(fileName, fileName.replace(sourceReg, '/.CACHE/nanachi/source/'), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
}
exports.default = ChaikaPlugin;

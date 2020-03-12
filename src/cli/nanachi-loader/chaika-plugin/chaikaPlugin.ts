import webpack = require("webpack");

const path = require('path');
const id = 'ChaikaPlugin';
const cwd = process.cwd();
const fs = require('fs-extra');

class ChaikaPlugin {
    apply(compiler: webpack.Compiler){
       
        //thanks https://github.com/webpack/webpack-dev-server/issues/34#issuecomment-47420992
        compiler.hooks.afterCompile.tap(id, (compilation) => {
            compilation.contextDependencies.add(
                path.join(cwd, '../../source')
            );
        });

        // https://github.com/hashicorp/prebuild-webpack-plugin/blob/master/index.js#L57
        compiler.hooks.watchRun.tap(id, () => {
            const { watchFileSystem } = compiler;
            const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher
            const changedFile = Object.keys(watcher.mtimes)
            const sourceReg = /\/source\//;
            changedFile.forEach((file) => {
                if (sourceReg.test(file.replace(/\\/g, '/'))) {
                    fs.copy(
                        file,
                        file.replace(sourceReg, '/.CACHE/nanachi/source/'),
                        (err: Error)=>{
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                }
            })
        });

        
    }
}

export default ChaikaPlugin;
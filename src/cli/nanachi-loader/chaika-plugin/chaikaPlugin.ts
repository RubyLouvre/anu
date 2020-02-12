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

        //get updated file name
        compiler.hooks.invalid.tap(id, (fileName)=>{
            const sourceReg = /\/source\//;
            fs.copy(
                fileName,
                fileName.replace(sourceReg, '/.CACHE/nanachi/source/'),
                (err: Error)=>{
                    if (err) {
                        console.log(err);
                    }
                }
            );
        });
    }
}

export default ChaikaPlugin;
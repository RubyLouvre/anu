const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const nPath = require('path');
const chalk = require('chalk');
const config = require('./config');
const cwd = process.cwd();

const print = (prefix, msg) => {
    // eslint-disable-next-line
    console.log(chalk.green(`${prefix} ${msg}`));
};


module.exports = ()=>{
    utils.on('build', ()=>{
        while (queue.length){
            let {code, path } = queue.shift();
            if (config['buildType'] === 'quick') {
                //快应用打包到src下
                path = utils.updatePath( path, 'dist' , 'src');
            } else {
                path = utils.updatePath( path, 'dist', config.buildDir);
            }
            if (path[0] != '/'){
                path = '/'+ path;
            }

            fs.ensureFileSync(path);
            fs.writeFile(path, code, err => {
                if (err){
                    print('build fail:', nPath.relative(cwd, path));
                } else {
                    print('build success:', nPath.relative(cwd, path));
                }
            });
        }
    });
   
};
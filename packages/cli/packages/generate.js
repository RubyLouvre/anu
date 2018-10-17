const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const config = require('./config');
const nPath = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const compress = utils.compress();

const print = (prefix, msg) => {
    // eslint-disable-next-line
    console.log(chalk.green(`${prefix} ${msg}`));
};

module.exports = ()=>{
    while (queue.length){
        let {code, path, type } = queue.shift();

        if (type != 'wxml' && config.compress) {
            code = compress[type](code);
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
};
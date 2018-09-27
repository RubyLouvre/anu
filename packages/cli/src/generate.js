const queue = require('./queue');
const fs = require('fs-extra');
const nPath = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const print = (prefix, msg, type) => {
    // eslint-disable-next-line
    console.log(chalk.green(`${prefix} ${msg}`), type);
};

module.exports = ()=>{
    
    while (queue.length){
        let {code, path, type } = queue.shift();
        fs.ensureFileSync(path);
        console.log(path);
        fs.writeFile(path, code, err => {
            if (err){
                print('build fail:', nPath.relative(cwd, path));
            } else {
                print('build success:', nPath.relative(cwd, path), `   ${type}`);
            }
        });
    }
};
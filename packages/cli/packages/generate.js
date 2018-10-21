const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const config = require('./config');
const nPath = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const compress = utils.compress();

const getSize = (code)=>{
    return (Buffer.byteLength(code, 'utf8')/1000).toFixed(1);
};

let sucSize = 0;
module.exports = ()=>{
    while (queue.length){
        let {code, path, type } = queue.shift();
        if (config.compress) {
            code = compress[type](code);
        }
        fs.ensureFileSync(path);
        fs.writeFile(path, code, err => {
            if (err){
                // eslint-disable-next-line
                console.log(chalk.red(`build fail: ${nPath.relative(cwd, path)} `));
            } else {
                sucSize++;
                // eslint-disable-next-line
                console.log(
                    chalk.gray(`[${sucSize}] `) + 
                    chalk.green(`build success: ${nPath.relative(cwd, path)} `) +
                    chalk.gray(`[${getSize(code)}KB]`)
                );
                if (queue.size === sucSize) {
                    queue.size = 0;
                    sucSize = 0;
                    // eslint-disable-next-line
                    utils.spinner('').succeed('构建结束\n');
                }
            }
        });
    }
};
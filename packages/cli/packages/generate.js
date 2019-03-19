/* eslint-disable no-console */
const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const config = require('./config');
const nPath = require('path');
const chalk = require('chalk');
const compress = utils.compress();
const cwd = process.cwd();
const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1000 ? `${Bytes} Bytes` : `${(Bytes/1000).toFixed(1)} Kb`;
};
let index = 0;
module.exports = ()=>{
    while (queue.length){
        let {code, path, type } = queue.shift();
        if (config.compress && compress[type]) {
            code = compress[type](code);
        }
        
        path = utils.resolveDistPath(path);
        fs.ensureFileSync(path);
        try {
            fs.writeFileSync(path, code);
            // console.log(
            //     chalk.gray(`[${index++}] `) + 
            //     chalk.green(`build success: ${nPath.relative(process.cwd(), path)} `) +
            //     chalk.gray(`[${getSize(code)}]`)
            // );
        } catch (err) {
            console.log(err, '\n', chalk.red(`build fail: ${nPath.relative(cwd, path)} `));
        }
    }
};

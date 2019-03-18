/* eslint-disable no-console */
const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const config = require('./config');
const nPath = require('path');
const chalk = require('chalk');
const compress = utils.compress();
const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1000 ? `${Bytes} Bytes` : `${(Bytes/1000).toFixed(1)} Kb`;
};

module.exports = ()=>{
    while (queue.length){
        let {code, path, type } = queue.shift();
        if (config.compress && compress[type]) {
            code = compress[type](code);
        }
        
        path = utils.resolveDistPath(path);
       
        fs.ensureFileSync(path);
        fs.writeFileSync(path, code);
        
        // .then(()=>{
            
        // })
        // .catch((err)=>{
        //     // eslint-disable-next-line
        //     console.log(err, '\n', chalk.red(`build fail: ${nPath.relative(cwd, path)} `));
        // });
    }
};

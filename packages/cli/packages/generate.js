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
        if (config.compress && compress[type]) {
            code = compress[type](code);
        }
        config['buildType'] === 'quick'
            ?  path = utils.updatePath( path, 'dist' , 'src') //快应用打包到src下
            :  path = utils.updatePath( path, 'dist', config.buildDir);
        fs.ensureFileSync(path);
        fs.writeFile(path, code)
            .then(()=>{
                sucSize++;
                // eslint-disable-next-line
                console.log(
                    chalk.gray(`[${sucSize}] `) + 
                    chalk.green(`build success: ${nPath.relative(cwd, path)} `) +
                    chalk.gray(`[${getSize(code)}KB]`)
                );
                if (queue.size !== sucSize) return;
                queue.size = 0;
                sucSize = 0;
                utils.spinner('').succeed('构建结束\n');
            })
            .catch((err)=>{
                // eslint-disable-next-line
                console.log(err, '\n', chalk.red(`build fail: ${nPath.relative(cwd, path)} `));
            });
        
    }
};
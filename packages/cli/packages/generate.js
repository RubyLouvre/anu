/* eslint-disable no-console */
const queue = require('./queue');
const fs = require('fs-extra');
const utils = require('./utils');
const config = require('./config');
const nPath = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const compress = utils.compress();
const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1000 ? `${Bytes} Bytes` : `${(Bytes/1000).toFixed(1)} Kb`;
};
let sucSize = 0;
let timer = null;
// 设置 setTimeout 为1000, 防止构建任务时间较长时, 出现多次打印 构建成功 的问题
const SET_TIMEOUT_TIME = 1000;

module.exports = ()=>{
    while (queue.length){
        let {code, path, type } = queue.shift();
        if (config.compress && compress[type]) {
            code = compress[type](code);
        }
        
        path = utils.resolveDistPath(path);
       
        fs.ensureFileSync(path);
        fs.writeFile(path, code)
            .then(()=>{
                sucSize++;
                // 因为占位符的原因, code可能为空字符串, 此时不打印log
                if (code){
                    console.log(
                        chalk.gray(`[${sucSize}] `) + 
                        chalk.green(`build success: ${nPath.relative(cwd, path)} `) +
                        chalk.gray(`[${getSize(code)}]`)
                    );
                }
                if (!timer){
                    timer = setTimeout(() => {
                        if (queue.size !== sucSize){
                            timer = null;
                            return;
                        }
                        queue.size = 0;
                        sucSize = 0;
                        utils.spinner('').succeed('构建结束\n');
                        if (config.buildType === 'quick'){
                            console.log(chalk.magentaBright('请打开另一个窗口, 安装hap。'), chalk.greenBright('npm i && npm run build'));
                            console.log(chalk.magentaBright('在打开另一个窗口, 安装hap的watch命令。'), chalk.greenBright('npm run server'));
                        }
                        timer = null;
                    }, SET_TIMEOUT_TIME);
                }
            })
            .catch((err)=>{
                // eslint-disable-next-line
                console.log(err, '\n', chalk.red(`build fail: ${nPath.relative(cwd, path)} `));
            });
    }
};

const chalk = require('chalk');
const ora = require('ora');
const { build: buildLog } = require('./queue');
const utils = require('../../packages/utils/index');

let successNum = 0;

const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes/1024).toFixed(1)} Kb`;
};

const successLog = (filepath, code) => {
    // filepath = path.join(filepath);
    const log = chalk`{gray [${++successNum}]} {green 编译完成} ${filepath} {gray [${getSize(code)}]}`;
    buildLog.push(log);
    if ( !utils.isMportalEnv() ) {
        // eslint-disable-next-line
        console.log(log);
    }
};

const timerLog = (timer) => {
    // eslint-disable-next-line
    ora(chalk`{green 项目构建完成，耗时：{inverse.bold ${timer.getProcessTime()}s}}`).succeed();
};

const warningLog = ( {id, msg} ) => {
    // eslint-disable-next-line
    console.log(chalk`{white {yellow.inverse Warning:} {yellow ${msg}} ${id}}`);
};

const errorLog = ( {id, msg} ) => {
    // eslint-disable-next-line
    console.log(chalk`{white {red.inverse Error:} {red ${msg}} ${id}}`);
};

const resetNum = () => {
    successNum = 0;
};

module.exports = {
    successLog,
    resetNum,
    timerLog,
    warningLog,
    errorLog
};

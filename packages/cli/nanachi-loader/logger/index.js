const chalk = require('chalk');
const ora = require('ora');

let successNum = 0;

const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes/1024).toFixed(1)} Kb`;
};

const successLog = (path, code) => {
    // eslint-disable-next-line
    console.log(chalk`{gray [${++successNum}]} {green 编译完成} ${path} {gray [${getSize(code)}]}`);
};

const timerLog = (timer) => {
    // eslint-disable-next-line
    ora(chalk`{green 项目构建完成，耗时：{inverse.bold ${timer.getProcessTime()}s}}`).succeed();
};

const warningLog = ( {id, msg} ) => {
    // eslint-disable-next-line
    console.log(chalk`{white {yellow.inverse Warning:} ${id}\n{yellow ${msg}}}`);
};

const errorLog = ( {id, msg} ) => {
    // eslint-disable-next-line
    console.log(chalk`{white {red.inverse Error:} ${id}\n{red ${msg}}}`);
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

const chalk = require('chalk');

let successNum = 0;

const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes/1024).toFixed(1)} Kb`;
};

const successLog = (path, code) => {
    // eslint-disable-next-line
    console.log(chalk`{green [${++successNum}] 编译完成} ${path} {green [${getSize(code)}]}`);
};

const timerLog = (timer) => {
    // eslint-disable-next-line
    console.log(`编译完成，耗时：${timer.getProcessTime()}s`);
};

const resetNum = () => {
    successNum = 0;
};

module.exports = {
    successLog,
    resetNum,
    timerLog
};

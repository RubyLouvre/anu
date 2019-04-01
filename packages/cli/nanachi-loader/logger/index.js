const chalk = require('chalk');

let successNum = 0;

const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes/1024).toFixed(1)} Kb`;
};

const successLog = (path, code) => {
    console.log(chalk`{green [${++successNum}] 编译完成} ${path} {green [${getSize(code)}]}`);
};

module.exports = {
    successLog
};

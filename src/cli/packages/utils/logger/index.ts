import chalk from 'chalk';
import ora from 'ora';
import { build as buildLog } from './queue';
import Timer from '../timer';
import { Log } from './queue';
const utils = require('../index');

let successNum: number = 0;

export const getSize = (code: string)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes/1024).toFixed(1)} Kb`;
};

export const successLog = (filepath: string, code: string) => {
    // filepath = path.join(filepath);
    const log = chalk`{gray [${(++successNum).toString()}]} {green 编译完成} ${filepath} {gray [${getSize(code)}]}`;
    buildLog.push(log);
    if ( !utils.isMportalEnv() ) {
        // eslint-disable-next-line
        console.log(log);
    }
};

export const timerLog = (timer: Timer) => {
    // eslint-disable-next-line
    ora(chalk`{green 项目构建完成，耗时：{inverse.bold ${timer.getProcessTime()}s}}`).succeed();
};

export const warningLog = ( {id, msg, loc}: Log ) => {
    let result = '';
    result = chalk`{underline ${id}}\n{grey ${loc.line}:${loc.column}}\t{yellow warning}\t${msg}\n`; 
    // eslint-disable-next-line
    console.log(result);
};

export const errorLog = ( {id, msg, loc}: Log ) => {
    let result = '';
    result = chalk`{underline ${id}}\n{grey ${loc.line}:${loc.column}}\t{red error}\t${msg}\n`; 
    // eslint-disable-next-line
    console.log(result);
};

export const resetNum = () => {
    successNum = 0;
};

// module.exports = {
//     successLog,
//     resetNum,
//     timerLog,
//     warningLog,
//     errorLog
// };

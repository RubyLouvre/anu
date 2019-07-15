"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const queue_1 = require("./queue");
const utils = require('../index');
let successNum = 0;
exports.getSize = (code) => {
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1024 ? `${Bytes} Bytes` : `${(Bytes / 1024).toFixed(1)} Kb`;
};
exports.successLog = (filepath, code) => {
    const log = chalk_1.default `{gray [${(++successNum).toString()}]} {green 编译完成} ${filepath} {gray [${exports.getSize(code)}]}`;
    queue_1.build.push(log);
    if (!utils.isMportalEnv()) {
        console.log(log);
    }
};
exports.timerLog = (timer) => {
    ora_1.default(chalk_1.default `{green 项目构建完成，耗时：{inverse.bold ${timer.getProcessTime()}s}}`).succeed();
};
exports.warningLog = ({ id, msg, loc }) => {
    let result = '';
    result = chalk_1.default `{underline ${id}}\n{grey ${loc.line}:${loc.column}}\t{yellow warning}\t${msg}\n`;
    console.log(result);
};
exports.errorLog = ({ id, msg, loc }) => {
    let result = '';
    result = chalk_1.default `{underline ${id}}\n{grey ${loc.line}:${loc.column}}\t{red error}\t${msg}\n`;
    console.log(result);
};
exports.resetNum = () => {
    successNum = 0;
};

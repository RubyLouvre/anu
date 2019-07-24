"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const semver = __importStar(require("semver"));
class CliBuilder {
    constructor() {
        this.__program = new commander_1.Command();
        this.__program.usage('<command> [options]');
    }
    addCommand(commandName, alias, description, options, callback) {
        const cmd = this.__program.command(commandName).description(description);
        if (alias) {
            cmd.alias(alias);
        }
        Object.keys(options).forEach((key) => {
            const optionName = options[key];
            const optionAlias = `${optionName.alias ? '-' + optionName.alias + ' ,' : ''}`;
            cmd.option(`${optionAlias}--${key} [optionName]`, optionName.desc);
        });
        cmd.action(callback);
    }
    set version(version) {
        this.__version = version;
        this.__program.version(this.__version);
    }
    checkNodeVersion(version) {
        if (semver.lt(process.version, version)) {
            console.log(chalk_1.default `nanachi only support {green.bold v8.6.0} or later (current {green.bold ${process.version}}) of Node.js`);
            process.exit(1);
        }
    }
    run() {
        this.__program
            .arguments('<command>')
            .action(() => {
            console.log(chalk_1.default.yellow('无效 nanachi 命令'));
            this.__program.outputHelp();
        });
        this.__program.parse(process.argv);
        if (!process.argv.slice(2).length) {
            this.__program.outputHelp();
        }
    }
}
exports.default = CliBuilder;

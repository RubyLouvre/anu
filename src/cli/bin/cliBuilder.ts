import chalk from 'chalk';
import { Command } from 'commander';
import * as semver from 'semver';
import { CmdOption, CmdMap } from '../consts/buildOptions';

interface CliBuilderInterface {
    addCommand(
        commandName: string,
        aliaName: string | null,
        description: string,
        options: CmdMap,
        callback: (...options: any[]) => void
    ): void;
    run(): void;
    checkNodeVersion(version: string): void;
}

class CliBuilder implements CliBuilderInterface {
    private __version: string;
    private __program: Command;
    constructor() {
        this.__program = new Command();
        this.__program.usage('<command> [options]');
    }
    addCommand(
        commandName: string,
        alias: string | null,
        description: string,
        options: CmdMap,
        callback: (...options: any[]) => void
    ) {
        const cmd = this.__program.command(commandName).description(description);
        if (alias) {
            cmd.alias(alias);
        }
        Object.keys(options).forEach((key: string) => {
            const optionName: CmdOption = options[key];
            const optionAlias = `${optionName.alias ? '-' + optionName.alias + ' ,' : ''}`;
            cmd.option(`${optionAlias}--${key} [optionName]`, optionName.desc);
        });
        cmd.action(callback);
    }
    set version(version: string) {
        this.__version = version;
        this.__program.version(this.__version);
    }
    checkNodeVersion(version: string){
        if (semver.lt(process.version, version)) {
            // eslint-disable-next-line
            console.log(
                chalk`nanachi only support {green.bold v8.6.0} or later (current {green.bold ${
                    process.version
                }}) of Node.js`
            );
            process.exit(1);
        }
    }
    run() {
        this.__program
            .arguments('<command>')
            .action(()=>{
                // eslint-disable-next-line
                console.log(chalk.yellow('无效 nanachi 命令'));
                this.__program.outputHelp();
            });
        this.__program.parse(process.argv);
        if (!process.argv.slice(2).length) {
            this.__program.outputHelp();
        }
    }
}

export default CliBuilder;
#!/usr/bin/env node
'use strict';
const nodejsVersion = Number(process.version.match(/v(\d+)/)[1]);
const chalk = require('chalk');
if (nodejsVersion < 8) {
    // eslint-disable-next-line
    console.log(
        `当前nodejs版本为 ${chalk.red(process.version)}, 请保证 >= ${chalk.bold(
            '7'
        )}`
    );
    process.exit(1);
}
const program = require('commander');
const VERSION = require('../package').version;
const LetUsRoll = require('../packages/index');

program
    .name('mpreact')
    .version(VERSION, '-v, --version')
    .parse(process.argv);

let args = program.args;

/* eslint-disable */
if (typeof args[0] === 'undefined') {
    console.error('请指定项目名称');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-name>')}`
    );
    console.log();
    console.log('例如:');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('mpreact-app')}`
    );
    process.exit(1);
}
LetUsRoll(program.args);

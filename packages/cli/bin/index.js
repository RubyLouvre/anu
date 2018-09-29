#!/usr/bin/env node
'use strict';
if ( Number(process.version.match(/v(\d+)/)[1]) < 8) {
    // eslint-disable-next-line
    console.log( `当前nodejs版本为 ${chalk.red(process.version)}, 请保证 >= ${chalk.bold(7)}`);
    process.exit(1);
}
const chalk = require('chalk');
const config = require('../packages/config');

const program = require('commander');
function getBuildType(args){
    let argList = args[0].split(':');
    let type = argList[1];
    type = !type ? 'wx' : type.toLowerCase();
    return type;
}
program
    .name('mpreact')
    .version(require('../package.json').version, '-v, --version')
    .parse(process.argv);
let args = program.args;


/* eslint-disable */
if (args[0] === 'init' && typeof args[1] === 'undefined') {
    console.error('请指定项目名称');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-name>')}\n`
    );
    console.log('例如:\n');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('mpreact-app')}`
    );
    process.exit(1);
}


let buildType = getBuildType(args);

process.env.ANU_ENV = buildType;

if(!config[buildType]){
    let type = args[0].split(':');
    console.log(
        chalk.red('请检查命令是否正确')
    )
    console.log(chalk.green(`1.微信小程序:        mpreact ${type[0]}`))
    console.log(chalk.green(`2.百度智能小程序:    mpreact ${type[0]}:bu`));
    console.log(chalk.green(`3.支付宝小程序:      mpreact ${type[0]}:ali`));
    console.log(chalk.green(`4.快应用:            mpreact ${type[0]}:quick`));
    process.exit(1);
}
if(!config[buildType].support ){
    console.log(
        chalk.red(config[buildType].notSopportResText)
    )
    process.exit(1);
}
config['buildType'] = buildType;



let commond = args[0];
if(/\:/.test(commond)){
    //<watch|build>:
    commond = commond.split(':')[0];
}
switch(commond){
    case 'watch':
        require('../packages/index')('watch', buildType);
        break;
    case 'build':
        require('../packages/index')('build', buildType);
        break;
    case 'init':
        require('../packages/init')(args[1]);
        break;  
    default:
        console.log(chalk.green('初始化项目: mpreact init <project-name>'));      
}
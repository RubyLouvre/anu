#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
if ( Number(process.version.match(/v(\d+)/)[1]) < 8) {
    // eslint-disable-next-line
    console.log( `当前nodejs版本为 ${chalk.red(process.version)}, 请保证 >= ${chalk.bold(8)}`);
    process.exit(1);
}
const program = require('commander');

program
    .name('nanachi')
    .usage('<commond>')
    .version(require('../package.json').version, '-v, --version')

program
    .command('init <project-name>')
    .description('初始化项目')

program
    .command('watch:[wx|ali|bu|quick]')
    .description('监听[ 微信小程序 | 支付宝小程序 | 百度只能小程序 | 快应用]')

program
    .command('build:[wx|ali|bu|quick]')
    .description('构建[ 微信小程序 | 支付宝小程序 | 百度只能小程序 | 快应用]')

program
    .command('update')
    .description('update cli')


program.parse(process.argv);
if(program.args.length === 0) program.help();


const config = require('../packages/config');
const args = program.args;
function getBuildType(args){
    let type = args[0].split(':')[1];
    type = !type ? 'wx' : type.toLowerCase();
    return type;
}

/* eslint-disable */
if (args[0] === 'init' && typeof args[1] === 'undefined') {
    console.error('请指定项目名称');
    console.log(
        `  ${chalk.cyan(program.name())} init ${chalk.green('<project-name>')}\n`
    );
    console.log('例如:\n');
    console.log(
        `  ${chalk.cyan(program.name())} init ${chalk.green('nanachi-app')}`
    );
    process.exit(1);
}

let buildType = getBuildType(args);
/* eslint-disable */
if(!config[buildType]){
    let type = args[0].split(':');
    console.log(
        chalk.red('请检查命令是否正确')
    )
    console.log(chalk.green(`1.微信小程序:        nanachi ${type[0]}`))
    console.log(chalk.green(`2.百度智能小程序:    nanachi ${type[0]}:bu`));
    console.log(chalk.green(`3.支付宝小程序:      nanachi ${type[0]}:ali`));
    console.log(chalk.green(`4.快应用:            nanachi ${type[0]}:quick`));
    process.exit(1);
}



process.env.ANU_ENV = buildType;

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
    case 'update':
        require('../packages/updateCli')();
        break;
    default:
        console.log(chalk.green('初始化项目: nanachi init <project-name>'));      
}
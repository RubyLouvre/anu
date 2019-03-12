#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');
const platforms = require('../consts/platforms');
let config = require('../packages/config');
function checkNodeVersion(version){
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
checkNodeVersion('8.6.0');

//获取参数的布尔值
function getArgValue(cmd){
    let args = {};
    cmd.options.forEach(function(op){
        let key = op.long.replace(/^--/, '');
        //commander中会把 --beta-ui 风格的参数变为cmd上betaUi驼峰
        //beta-ui => betaUi
        key = key.split('-').map((el, index)=>{
            return index > 0 ? `${el[0].toUpperCase()}${el.slice(1)}` : el;
        }).join('');
        
        if (typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    });
    return args;
}

function injectBuildEnv(cmd, buildType){
    let buildArgs = getArgValue(cmd);
    process.env.ANU_ENV = buildType;
    config['buildType'] = buildType;
    config['compress'] = buildArgs['compress'];
    if (buildType === 'quick') {
        config['huawei'] = buildArgs['huawei'] || false;
    }
}

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

program
    .command('init <app-name>')
    .description('description: 初始化项目')
    .action((appName)=>{
        require('../commands/init')(appName);
    });



program
    .command('page <page-name>')
    .description('description: 创建pages/<page-name>/index.js模版')
    .action((name)=>{
        let isPage = true;
        require('../commands/createPage')( {name, isPage} );
    });

program
    .command('component <component-name>')
    .description('description: 创建components/<component-name>/index.js组件')
    .action((name)=>{
        let isPage = false;
        require('../commands/createPage')( {name, isPage});
    });

function buildAction(buildType, compileType) {
    return function(cmd) {
        const args = getArgValue(cmd);
        if (compileType === 'watch') { args['watch'] = true; }
        injectBuildEnv(cmd, buildType);
        buildType === 'h5'
            ? require('mini-html5/runkit/build')
            : require('../commands/build')(args);
    };
}
//注册其他命令
platforms.forEach(function(el){
    let {type, des, isDefault } = el;
    ['build', 'watch'].forEach(function (compileType) {
        if (isDefault) {
            program
                .command(`${compileType}`)
                .description(`description: 构建${des}`)
                .option('--compress', '压缩资源')
                .option('--beta', '同步react runtime')
                .option('--beta-ui', '同步schnee-ui')
                .option('--huawei','补丁华为快应用')
                .action(buildAction(type, compileType));
        }
        program
            .command(`${compileType}:${type}`)
            .description(`description: 构建${des}`)
            .option('--compress', '压缩资源')
            .option('--beta', '同步react runtime')
            .option('--beta-ui', '同步schnee-ui')
            .option('--huawei','补丁华为快应用')
            .action(buildAction(type, compileType));
    });
});


program
    .arguments('<command>')
    .action(()=>{
        // eslint-disable-next-line
        console.log(chalk.yellow('无效 nanachi 命令'));
        program.outputHelp();
    });

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
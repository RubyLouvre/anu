#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');
const platforms = require('../consts/platforms');
const { BUILD_OPTIONS } = require('../consts/index');
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

/**
 * 注册命令
 * @param {String} command 命令名
 * @param {String} desc 命令描述
 * @param {Object} options 命令参数
 * @param {Function} action 回调函数
 */
function registeCommand(command, desc, options = {}, action) {
    const cmd = program.command(command).description(desc);
    Object.keys(options).forEach(key => {
        const option = options[key];

        cmd.option(`${option.alias ? '-' + option.alias + ' ,' : ''}--${key}`, option.desc);
    });
    cmd.action(action);
}

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

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

registeCommand('init <app-name>', 'description: 初始化项目', {}, (appName)=>{
    require('../commands/init')(appName);
});

['page', 'component'].forEach(type => {
    registeCommand(
        `${type} <page-name>`,
        `description: 创建${type}s/<${type}-name>/index.js模版`,
        {}, 
        (name)=>{
            const isPage = type === 'page';
            require('../commands/createPage')( {name, isPage} );
        });
});


function buildAction(buildType, compileType) {
    return function(cmd) {
        const args = getArgValue(cmd);
        args['buildType'] = buildType;
        args['watch'] = compileType === 'watch';
        require('../commands/build')(args);
    };
}

function registeBuildfCommand({compileType, buildType, isDefault, desc}) {
    registeCommand(`${compileType}${isDefault ? '' : ':' + buildType}`, desc, BUILD_OPTIONS, buildAction(buildType, compileType));
}
//注册其他命令
platforms.forEach(function(el){
    const { buildType, des, isDefault } = el;
    ['build', 'watch'].forEach(function (compileType) {
        if (isDefault) { 
            registeBuildfCommand({
                compileType, 
                buildType, 
                isDefault, 
                des
            }); 
        }
        registeBuildfCommand({
            compileType, 
            buildType, 
            isDefault: false, 
            des
        });
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
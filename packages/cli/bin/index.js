#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');
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
        if (typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    });
    return args;
}

function getBuildType(cmd){
    return cmd['_name'].split(':').pop();
}

function injectBuildEnv(cmd){
    let buildType = getBuildType(cmd);
    process.env.ANU_ENV = buildType;
    config['buildType'] = buildType;
    config['compress'] = getArgValue(cmd)['compress'];
}

let buildCommonds = [
    {
        type: 'wx',
        des: '微信小程序'
    },
    {
        type: 'ali',
        des: '支付宝小程序'
    },
    {
        type: 'bu',
        des: '百度智能小程序'
    },
    {
        type: 'tt',
        des: '头条小程序'
    },
    {
        type: 'quick',
        des: '快应用'
    },
    {
        type: 'h5',
        des: 'H5'
    },
];

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

program
    .command('init <app-name>')
    .description('description: 初始化项目')
    .action((appName)=>{
        require('../commonds/init')(appName);
    });



program
    .command('page <template-name>')
    .description('description: 创建pages/<template-name>/index.js模版')
    .action((name)=>{
        let isPage = true;
        require('../commonds/createPage')( {name, isPage} );
    });

program
    .command('component <component-name>')
    .description('description: 创建components/<component-name>/index.js组件')
    .action((name)=>{
        let isPage = false;
        require('../commonds/createPage')( {name, isPage});
    });


buildCommonds.forEach(function(el){
    let {type, des} = el;
    program
        .command(`build:${type}`)
        .description(`description: 构建${des}`)
        .option('-c, --compress', '压缩资源')
        .option('-b, --beta', '同步react runtime')
        .action(function(cmd){
            let args = getArgValue(cmd);
            injectBuildEnv(cmd);

            getBuildType(cmd) === 'h5'
                ? require('mini-html5/runkit/build')
                : require('../commonds/build')(args);
        });
    program
        .command(`watch:${type}`)
        .description(`description: 监听${des}`)
        .option('-c, --compress', '压缩资源')
        .option('-b, --beta', '同步react runtime')
        .action(function(cmd){
            let args = getArgValue(cmd);
            args['watch'] = true;
            injectBuildEnv(cmd);

            getBuildType(cmd) === 'h5'
                ? require('mini-html5/runkit/run')
                : require('../commonds/build')(args);
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







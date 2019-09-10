#!/usr/bin/env node
import platforms from '../consts/platforms';
import BUILD_OPTIONS from '../consts/buildOptions';
import CliBuilder from './cliBuilder';
import init from './commands/init';
import createPage from './commands/createPage';
import build from './commands/build';
import install from './commands/install';
import '../tasks/chaikaMergeTask/injectChaikaEnv';
const { version } = require('../package.json');

const cli: CliBuilder = new CliBuilder();
cli.checkNodeVersion('8.6.0');

cli.version = version;

cli.addCommand('init <app-name>', null, 'description: 初始化项目', {}, (appName: any)=>{
    init(appName);
});

cli.addCommand(
    'install [name]',
    null,
    'description: 安装拆库模块. 文档: https://rubylouvre.github.io/nanachi/documents/chaika.html',
    {
        'branch': {
            desc: '指定分支',
            alias: 'b'
        }
    },
    function(name, opts){
        install(name, opts);
    }
);

['page', 'component'].forEach(type => {
    cli.addCommand(
        `${type} <page-name>`,
        null,
        `description: 创建${type}s/<${type}-name>/index.js模版`,
        {}, 
        (name)=>{
            createPage({name, isPage: type === 'page'});
        });
});

platforms.forEach(function(el){
    const { buildType, des, isDefault } = el;
    ['build', 'watch'].forEach(function (compileType) {
        cli.addCommand(
            `${compileType}:${buildType}`, 
            isDefault ? compileType : null,
            des, 
            BUILD_OPTIONS,
            (options) => {
                build({
                    ...options,
                    watch: compileType === 'watch',
                    buildType
                });
            }
        );
    });
});

cli.run();
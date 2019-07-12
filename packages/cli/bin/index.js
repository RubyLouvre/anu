#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../package.json");
const platforms_1 = require("../ts-consts/platforms");
const buildOptions_1 = require("../ts-consts/buildOptions");
const cliBuilder_1 = require("./cliBuilder");
const init_1 = require("../tsCommands/init");
const createPage_1 = require("../tsCommands/createPage");
const build_1 = require("../tsCommands/build");
const cli = new cliBuilder_1.default();
cli.checkNodeVersion('8.6.0');
cli.version = package_json_1.version;
cli.addCommand('init <app-name>', null, 'description: 初始化项目', {}, (appName) => {
    init_1.default(appName);
});
cli.addCommand('install [name]', null, 'description: 安装拆库模块. 文档: https://rubylouvre.github.io/nanachi/documents/chaika.html', {
    'branch': {
        desc: '指定分支',
        alias: 'b'
    }
}, function (name, opts) {
    require('../commands/install')(name, opts);
});
['page', 'component'].forEach(type => {
    cli.addCommand(`${type} <page-name>`, null, `description: 创建${type}s/<${type}-name>/index.js模版`, {}, (name) => {
        createPage_1.default({ name, isPage: type === 'page' });
    });
});
platforms_1.default.forEach(function (el) {
    const { buildType, des, isDefault } = el;
    ['build', 'watch'].forEach(function (compileType) {
        cli.addCommand(`${compileType}:${buildType}`, isDefault ? compileType : null, des, buildOptions_1.default, (options) => {
            const args = {};
            Object.keys(options).forEach(key => {
                args[key] = options.key;
            });
            build_1.default(Object.assign({}, args, { watch: compileType === 'watch', buildType }));
        });
    });
});
cli.run();

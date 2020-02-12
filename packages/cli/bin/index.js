#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const platforms_1 = __importDefault(require("../consts/platforms"));
const buildOptions_1 = __importDefault(require("../consts/buildOptions"));
const cliBuilder_1 = __importDefault(require("./cliBuilder"));
const init_1 = __importDefault(require("./commands/init"));
const createPage_1 = __importDefault(require("./commands/createPage"));
const install_1 = __importDefault(require("./commands/install"));
const path = __importStar(require("path"));
require("../tasks/chaikaMergeTask/injectChaikaEnv");
const { version } = require('../package.json');
const index_1 = __importDefault(require("../tasks/chaikaMergeTask/index"));
let cwd = process.cwd();
function changeWorkingDir() {
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}
function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}
const cli = new cliBuilder_1.default();
cli.checkNodeVersion('8.6.0');
cli.version = version;
cli.addCommand('init <app-name>', null, 'description: 初始化项目', {}, (appName) => {
    init_1.default(appName);
});
cli.addCommand('install [name]', null, 'description: 安装拆库模块. 文档: https://rubylouvre.github.io/nanachi/documents/chaika.html', {
    'branch': {
        desc: '指定分支',
        alias: 'b'
    }
}, function (name, opts) {
    install_1.default(name, opts);
});
['page', 'component'].forEach(type => {
    cli.addCommand(`${type} <page-name>`, null, `description: 创建${type}s/<${type}-name>/index.js模版`, {}, (name) => {
        createPage_1.default({ name, isPage: type === 'page' });
    });
});
platforms_1.default.forEach(function (el) {
    const { buildType, des, isDefault } = el;
    ['build', 'watch'].forEach(function (compileType) {
        cli.addCommand(`${compileType}:${buildType}`, isDefault ? compileType : null, des, buildOptions_1.default, (options) => __awaiter(this, void 0, void 0, function* () {
            if (isChaikaMode()) {
                try {
                    yield index_1.default();
                    changeWorkingDir();
                }
                catch (err) {
                    console.error(err);
                    process.exit(1);
                }
            }
            require('./commands/build')(Object.assign(Object.assign({}, options), { watch: compileType === 'watch', buildType }));
        }));
    });
});
cli.run();

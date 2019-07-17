import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import axios from 'axios';
import ora from 'ora';
import { REACT_LIB_MAP } from '../consts/index';
import nodeResolve from 'resolve';
import config from '../config/config';
import { NanachiOptions } from '../index';
const utils = require('../packages/utils/index');

const cliRoot = path.resolve(__dirname, '..');
const getSubpackage = require('../packages/utils/getSubPackage');
let cwd = process.cwd();

//删除dist目录, 以及快应的各配置文件
function getRubbishFiles(buildType: string){

    let fileList = ['package-lock.json', 'yarn.lock'];
    buildType === 'quick'
        ? fileList = fileList.concat(['dist', 'build', 'sign', 'src', 'babel.config.js'])
        : fileList = fileList.concat([utils.getDistName(buildType)]);
    
    //构建应用时，要删除source目录下其他的 React lib 文件。
    let libList = Object.keys(REACT_LIB_MAP)
        .map(function(key){
            return `source/${REACT_LIB_MAP[key]}`;
        })
        .filter(function(libName){
            return libName.split('/')[1] != REACT_LIB_MAP[buildType];
        });
    fileList = fileList.concat(libList);

    return fileList.map(function(file){
        return {
            id: path.join(cwd, file),
            ACTION_TYPE: 'REMOVE'
        };
    });
}


//合并快应用构建json
function getQuickPkgFile() {
    let projectPkgPath = path.join(cwd, 'package.json');
    let projectPkg = require(projectPkgPath);
    let quickPkg = require(path.join(cliRoot, 'packages/quickHelpers/quickInitConfig/package.json'));
    //合并 scripts, devDependencies
    ['scripts', 'devDependencies'].forEach(function(key){
        projectPkg[key] = projectPkg[key] || {};
        Object.assign(projectPkg[key], quickPkg[key]);
    });

    return [
        {
            id: projectPkgPath,
            content: JSON.stringify(projectPkg, null, 4),
            ACTION_TYPE: 'WRITE'
        }
    ];
}

//copy 快应用构建的基础依赖
function getQuickBuildConfigFile(){
    const baseDir = path.join(cliRoot, 'packages/quickHelpers/quickInitConfig');
    let signDir = baseDir;
    const sign = 'sign', babelConfig = 'babel.config.js';
    try {
        const userSignDir = path.join(cwd, 'source/sign');
        const files = fs.readdirSync(userSignDir);
        if (files.length) {
            signDir = path.join(cwd, 'source');
        }
    } catch (e) {
    }
    return [
        {
            id: path.join(signDir, sign),
            dist: path.join(cwd, sign),
            ACTION_TYPE: 'COPY'
        },
        {
            id: path.join(baseDir, babelConfig),
            dist: path.join(cwd,  babelConfig),
            ACTION_TYPE: 'COPY'
        }
    ];
}

//从 github 同步UI
function downloadSchneeUI(){
    let spinner = ora(chalk.green.bold(`正在同步最新版schnee-ui, 请稍候...\n`)).start();
    let npmDir = path.join(cwd, 'node_modules');
    process.chdir(npmDir);
    fs.removeSync(path.join(npmDir, 'schnee-ui'));
    let ret = spawn.sync('git', ['clone',  '-b', 'dev', 'https://github.com/qunarcorp/schnee-ui.git'], { stdio: 'inherit' });
    if (ret.error) {
        // eslint-disable-next-line
        console.log(ret.error, 11);
        process.exit(1);
    }
    process.chdir(cwd);
    spinner.succeed(chalk.green.bold(`同步 schnee-ui 成功!`));
}

function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}

function getReactPath(ReactLibName: string) {
    if (isChaikaMode()) {
        return path.join(cwd, '.CACHE/nanachi/source', ReactLibName);
    }
    return  path.join(cwd, 'source', ReactLibName);
}

async function getRemoteReactFile(ReactLibName: string): Promise<Array<taskItem>>{
    let dist = getReactPath(ReactLibName);
    let { data } = await axios.get(`https://raw.githubusercontent.com/RubyLouvre/anu/branch3/dist/${ReactLibName}`);
    return [
        {
            id: dist,
            content: data,
            ACTION_TYPE: 'WRITE'
        }
    ];
}

function getReactLibFile(ReactLibName: string): Array<taskItem> {
    let src = path.join(cliRoot, 'lib', ReactLibName);
    let dist = getReactPath(ReactLibName);
    try {
        //文件有就不COPY
        fs.accessSync(dist);
        return [];
    } catch (err) {
        return [
            {
                id: src,
                dist: dist,
                ACTION_TYPE: 'COPY'
            }
        ];
    }
}


//copy project.config.json
function getProjectConfigFile(buildType: string) {
    if (buildType === 'quick' || buildType === 'h5') return [];
    let fileName = 'project.config.json';
    let src = '';
    fs.existsSync(path.join(cwd, fileName))
        ? src = path.join(cwd, fileName)
        : src = path.join(cwd, 'source', fileName);

    let dist = path.join(cwd, 'dist', fileName);
    if (fs.existsSync(src)) {
        return [
            {
                id: src,
                dist: dist,
                ACTION_TYPE: 'COPY'
            }
        ];
    } else {
        return [];
    }
}

//fs-extra 各文件I/O操作返回Promise
const helpers: {
    [actionName: string]: Function;
} = {
    COPY: function( { id, dist }: {
        id: string;
        dist: string;
    } ) {
        return fs.copy(id, dist);
    },
    WRITE: function( {id, content}: {
        id: string;
        content: string;
    } ) {
        fs.ensureFileSync(id);
        return fs.writeFile(id, content);
    },
    REMOVE: function( {id}: {
        id: string;
    } ) {
        return fs.remove(id);
    }
};

function needInstallHapToolkit(){
    //检查本地是否安装快应用的hap-toolkit工具
    try {
        //hap-toolkit中package.json没有main或者module字段, 无法用 nodeResolve 来判断是否存在。
        //nodeResolve.sync('hap-toolkit', { basedir: cwd });
        let hapToolKitPath = path.join(cwd, 'node_modules', 'hap-toolkit');
        fs.accessSync(hapToolKitPath);
        return false;
    } catch (err) {
        return true;
    }
}

function checkPagePath(dirname: string) {
    if (/[\\/]common([\\/]|$)/.test(dirname)) return;
    fs.readdir(dirname, function(err, files) {
        if (err) {
            console.log(err);
            return;
        }
        let jsFileNum = 0;
        files.forEach(file => {
            file = path.resolve(dirname, file);
            const stat = fs.statSync(file);
            if (stat.isFile()) {
                if (/\.js$/.test(file)) {
                    jsFileNum++;
                }
            } else {
                checkPagePath(file);
            }
            if (jsFileNum > 1) {
                console.error(chalk`{red Error: }{grey ${path.dirname(file)}} 目录不符合分包规范，该目录下不允许包含多个js文件`);
                process.exit();
            }
        });
    });
}

function injectPluginsConfig() {
    let userConfig: any;
    try {
        userConfig = require(path.join(cwd, 'source', `${config.buildType}Config.json`));
    } catch (e) {
    
    }
    if (userConfig && userConfig.plugins && Object.prototype.toString.call(userConfig.plugins) === '[object Object]') {
        Object.keys(userConfig.plugins).forEach(key => {
            const name = userConfig.plugins[key].name;
            if (!name) {
                delete userConfig[key];
                throw `${key}配置项必须包含name字段`;
            }
            config.pluginTags[name] = `plugin://${key}/${name}`;
            delete userConfig.plugins[key].name;
        });
        config.plugins = userConfig.plugins;
    }
}

interface taskItem {
    id: string;
    dist?: string;
    content?: string;
    ACTION_TYPE: string;
}

export default async function runTask({ platform: buildType, beta, betaUi, compress }: NanachiOptions){
   
    // 检查pages目录是否符合规范
    if (buildType !== 'quick' && getSubpackage(buildType).length > 0) {
        //checkPagePath(path.resolve(cwd, 'source/pages'));
    }
    const ReactLibName = REACT_LIB_MAP[buildType];
    const isQuick = buildType === 'quick';
    let tasks: Array<taskItem> = [];
    
    // 安装nanachi-compress-loader包
    if (compress) {
        const compressLoaderName = 'nanachi-compress-loader';
        try {
            nodeResolve.sync(compressLoaderName, { basedir: cwd });
        } catch (e) {
            let spinner = ora(chalk.green.bold(`正在安装${compressLoaderName}`)).start();
            utils.installer(
                compressLoaderName,
                '--save-dev'
            );
            spinner.succeed(chalk.green.bold(`${compressLoaderName}安装成功`));
        }
    }

    if (betaUi) {
        downloadSchneeUI();
    }

    //--beta从远程拉react runtime, 否则从cli里copy.
    if (beta) {
        let spinner = ora(chalk.green.bold(`正在同步最新的${ReactLibName}, 请稍候...`)).start();
        tasks = tasks.concat(await getRemoteReactFile(ReactLibName));
        spinner.succeed(chalk.green.bold(`同步最新的${ReactLibName}成功!`));
    } else {
        tasks = tasks.concat(getReactLibFile(ReactLibName));
    }
    
    //快应用下需要copy babel.config.js, 合并package.json等
    if (isQuick) {
        tasks = tasks.concat(getQuickBuildConfigFile(), getQuickPkgFile());
        if (needInstallHapToolkit()) {
            //获取package.json中hap-toolkit版本，并安装
            let toolName = 'hap-toolkit@latest';
            // eslint-disable-next-line
            console.log(chalk.bold.green(`缺少快应用构建工具 ${toolName}, 正在安装, 请稍候...`));
            utils.installer(
                toolName,
                '--save-dev'
            );
        }
    }
    injectPluginsConfig();
    
    //copy project.config.json
    tasks = tasks.concat(getProjectConfigFile(buildType));

    
    try {
        //每次build时候, 必须先删除'dist', 'build', 'sign', 'src', 'babel.config.js'等等冗余文件或者目录
        await Promise.all(getRubbishFiles(buildType).map(function(task){
            if (helpers[task.ACTION_TYPE]) {
                return helpers[task.ACTION_TYPE](task);
            }
        }));

        await Promise.all(tasks.map(function(task){
            if (helpers[task.ACTION_TYPE]) {
                return helpers[task.ACTION_TYPE](task);
            }
        }));
    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
        process.exit(1);
    }
}

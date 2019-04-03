const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const cwd = process.cwd();
const spawn = require('cross-spawn');
const axios = require('axios');
const ora = require('ora');
const glob = require('glob');
const { REACT_LIB_MAP } = require('../consts/index');

const cliRoot = path.resolve(__dirname, '..');

//删除dist目录, 以及快应的各配置文件
function getRubbishFiles(buildType){
    let fileList = ['package-lock.json', 'yarn.lock'];
    buildType !== 'quick'
    ? fileList = fileList.concat(['dist', 'build', 'sign', 'src', 'babel.config.js'])
    : fileList = fileList.concat(['dist']);
    
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
        }
    });
};


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
};


//copy 快应用构建的基础依赖
function getQuickBuildConfigFile(){
    const baseDir = path.join(cliRoot, 'packages/quickHelpers/quickInitConfig');
    const sign = 'sign', babelConfig = 'babel.config.js';
    return [
        {
            id: path.join(baseDir, sign),
            dist: path.join(cwd, sign),
            ACTION_TYPE: 'COPY'
        },
        {
            id: path.join(baseDir, babelConfig),
            dist: path.join(cwd,  babelConfig),
            ACTION_TYPE: 'COPY'
        }
    ];
};

//从 github 同步UI
function downloadSchneeUI(){
    let spinner = ora(chalk.green.bold(`正在同步最新版schnee-ui, 请稍候...\n`)).start();
    let cwd = process.cwd(), npmDir = path.join(cwd, 'node_modules');
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


async function getRemoteReactFile(ReactLibName) {
    let dist = path.join(cwd, 'source', ReactLibName);
    let { data } = await axios.get(`https://raw.githubusercontent.com/RubyLouvre/anu/branch3/dist/${ReactLibName}`);
    return [
        {
            id: dist,
            content: data,
            ACTION_TYPE: 'WRITE'
        }
    ];
}

function getReactLibFile(ReactLibName) {
    let src = path.join(cliRoot, 'lib', ReactLibName);
    let dist = path.join(cwd, 'source', ReactLibName);
    return [
        {
            id: src,
            dist: dist,
            ACTION_TYPE: 'COPY'
        }
    ];
}


function getAssetsFile( buildType ) {
    const assetsDir = path.join(cwd, 'source', 'assets');
    let files = glob.sync( assetsDir+'/**', {nodir: true});

    files = files
    .filter(function(id){
        //过滤js, css, sass, scss, less, json文件
        return !/\.(js|scss|sass|less|css|json)$/.test(id)
    })
    .map(function(id){
        let dist = id.replace('source', buildType === 'quick' ? 'src' : 'dist');
        return {
            id: id,
            dist: dist ,
            ACTION_TYPE: 'COPY'
        }
    });
    
    return files;

}

//copy project.config.json
function getProjectConfigFile(buildType) {
    if (buildType === 'quick') return [];
    let fileName = 'project.config.json';
    let dist = path.join(cwd, 'source', fileName);
    let src = path.join(cwd, fileName);
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
const helpers = {
    COPY: function( { id, dist } ) {
        return fs.copy(id, dist)
    },
    WRITE: function( {id, content} ) {
        fs.ensureFileSync(id);
        
        return fs.writeFile(id, content);
    },
    REMOVE: function( {id} ) {
        return fs.remove(id);
    }
}

async function runTask({ buildType, beta,  betaUi }){
    const ReactLibName = REACT_LIB_MAP[buildType];
    const isQuick = buildType === 'quick';
    let tasks  = [];

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
        tasks = tasks.concat(getQuickBuildConfigFile(), getQuickPkgFile())
    }
    
    //copy project.config.json
    tasks = tasks.concat(getProjectConfigFile(buildType));

    //copy assets目录下静态资源
    tasks = tasks.concat(getAssetsFile(buildType));

    try {
        //每次build时候, 必须先删除'dist', 'build', 'sign', 'src', 'babel.config.js'等等冗余文件或者目录
        await Promise.all(getRubbishFiles().map(function(task){
            return helpers[task.ACTION_TYPE](task);
        }));

        await Promise.all(tasks.map(function(task){
            return helpers[task.ACTION_TYPE](task);
        }));
    } catch (err) {
        
    }
};


module.exports = async function(args){
    await runTask(args);
};
import shelljs from 'shelljs';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import axios from 'axios';
import glob from 'glob';
const cwd = process.cwd();

function unPack(src: string, dist: string) {
    dist = path.join(dist, 'source');
    fs.ensureDirSync(dist);
    fs.emptyDirSync(dist);
    const unzipExec = shelljs.exec(`tar -zxvf ${src} -C ${dist}`, {
        silent: true
    });
    if (unzipExec.code) {
        // eslint-disable-next-line
        console.log(chalk.bold.red(unzipExec.stderr));
    }
    try {
        let files = glob.sync( dist + '/**', {nodir: true, dot: true});
        files.forEach(function(el: string){
            let fileName = path.basename(el);
            if (
                /\/package\.json$/.test(el)
                || /\/\.\w+$/.test(el)
            ) {
                fs.moveSync( el, path.join(dist, '..', fileName));
            }
        });

    } catch (err) {
        // eslint-disable-next-line
    }
   
}

function isOldChaikaConfig(name="") {
    return /^[A-Za-z0-9_\.\+-]+@#?[A-Za-z0-9_\.\+-]+$/.test(name);
}

function downLoadGitRepo(target: string, branch: string){
    let cmd = `git clone ${target} -b ${branch}`;
    let distDir = path.join(cwd, '.CACHE', 'download');
    let gitRepoName = target.split('/').pop().replace(/\.git$/, '');
    fs.removeSync(path.join(distDir, gitRepoName));
    fs.ensureDirSync(distDir);
    let std = shelljs.exec(
        cmd,
        {
            cwd: distDir,
            silent: true
        }
    );

    if (/fatal:/.test(std.stderr)) {
        // eslint-disable-next-line
        console.log(chalk.bold.red(std.stderr));
        process.exit(1);
    } 
    // eslint-disable-next-line
    console.log(chalk.green(`安装依赖包 ${target} 成功. VERSION: ${branch}`));
}


function getNanachiChaikaConfig() {
    let nanachiUserConfig: any = {};
    try {
        nanachiUserConfig = require(path.join(cwd, 'nanachi.config'));
    } catch (err) {
        if (/SyntaxError/.test(err)) {
            // eslint-disable-next-line
            console.log(err);
        }
    }
    return nanachiUserConfig.chaikaConfig || {};
}

async function downLoadBinaryLib(binaryLibUrl: string, patchModuleName: string) {
    
    let axiosConfig = {
        url: binaryLibUrl,
        type: 'GET',
        responseType: 'arraybuffer'
    };
    
    let { data } = await axios(axiosConfig);
    let libDist = path.join(cwd, `.CACHE/lib/${path.basename(patchModuleName)}`);
    fs.ensureFileSync(libDist);
    fs.writeFile(libDist, data, function(err){
        if (err) {
            // eslint-disable-next-line
            console.log(err);
            return;
        }
        // eslint-disable-next-line
        console.log(chalk.green(`安装依赖包 ${binaryLibUrl} 成功.`));
        unPack(
            libDist, 
            path.join(cwd, `.CACHE/download/${patchModuleName}`)
        );
    });
}


function downLoadPkgDepModule(){
    var pkg = require(path.join(cwd, 'package.json'));
    var depModules = pkg.modules || {};
    let depKey = Object.keys(depModules);
    const nanachiChaikaConfig = getNanachiChaikaConfig();
    if (!depKey.length) {
        // eslint-disable-next-line
        console.log(chalk.bold.red('未在package.json中发现拆库依赖包, 全量安装失败.'));
        process.exit(1);
    }
    

    depKey.forEach(function(key){
        // 用户自定义根据tag或者branch下载模块包
        if (
            Object.keys(nanachiChaikaConfig).length 
            && nanachiChaikaConfig.onInstallTarball 
            && typeof nanachiChaikaConfig.onInstallTarball === 'function'
        ) {
            // nanachi.config.js
            /**
             * {
             *   onInstallTarball: function(moduleName, version) {
             *      // 该函数用于用户自定义返回可远程下载的包
             *      return https://xxx/yyy/version.git
             *   }
             * }
             */
            let gitRepo = nanachiChaikaConfig.onInstallTarball(key, depModules[key]);
            console.log(gitRepo, '===');
            // 下载对应的tag或者branch
            downLoadGitRepo(gitRepo, depModules[key]);
        } else if (isOldChaikaConfig(`${key}@${depModules[key]}`)) {
            // 兼容老的chaika
            patchOldChaikaDownLoad(`${key}@${depModules[key]}`);
        } else {

        }

    });
}


function patchOldChaikaDownLoad(name:string) {
    // git@gitlab.corp.qunar.com:qunar_miniprogram/nnc_{module}.git
    const [moduleName, versionName] = name.split('@');
    const {moduleGitUrl, packageUrl, prefix} = require('./moduleUrls');

    // home主包是 nnc_xxx 格式.  其他包是 nnc_module_xxx 格式
    const patchModuleName = /home_/.test(moduleName) 
        ? `${prefix}_${moduleName}` 
        : `${prefix}_module_${moduleName}`;
   
    if (/^#/.test(versionName)) {
        // 分支安装
        const gitRepo = moduleGitUrl.replace('{module}', `${patchModuleName}`);
        const branchName = versionName.replace(/^#/, '');
        downLoadGitRepo(gitRepo, branchName);
    } else {
        // tag 安装， 注意主包格式和其他包不一样
        const patchModuleUrl = `${packageUrl}${patchModuleName}/${versionName}/${moduleName}-${versionName}.w`;
        downLoadBinaryLib(patchModuleUrl, patchModuleName);
    }
}



export default function(name: string, opts: any){
    if (process.env.NANACHI_CHAIK_MODE != 'CHAIK_MODE') {
        // eslint-disable-next-line
        console.log(chalk.bold.red('需在package.json中配置{"nanachi": {"chaika_mode": true }}, 拆库开发功能请查阅文档: https://rubylouvre.github.io/nanachi/documents/chaika.html'));
        process.exit(1);
    }
    
    let downloadInfo:{
        type: string;
        lib: string;
        version?: string;
    } = {
        type: '',
        lib: ''
    };


    if (!name && !opts.branch) {
        //nanachi install package.json 中配置的所有包
        downloadInfo = {
            type: 'all',
            lib: ''
        };
    }

    // nanachi install moduleName@#branchName
    // nanachi install moduleName@tagName
    if (isOldChaikaConfig(name)) {
        patchOldChaikaDownLoad(name);
        return;
    }

    //nanachi install xxx.zip
    // if (name && !/\.git$/.test(name) ) {
    //     downloadInfo = {
    //         type: 'binary',
    //         lib: name
    //     };
    // }
    // nanachi install xxx.git -b branchName
    if (/\.git$/.test(name) && opts.branch && typeof opts.branch === 'string' ) {
        downloadInfo = {
            type: 'git',
            lib: name,
            version: opts.branch
        };
    }
    let {type, lib, version} = downloadInfo;

    switch (type) {
        case 'git':
            downLoadGitRepo(lib, version);
            break;
        // case 'binary':
        //     downLoadBinaryLib(lib);
        case 'all':
            downLoadPkgDepModule();
        default:
            break;
    }
};




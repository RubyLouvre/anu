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
    console.log(chalk.green(`安装依赖包 ${gitRepoName} 成功.`));
}


async function downLoadBinaryLib(lib: string) {
    let [tarName, version] = lib.split('@');
    let tarUrl = '';
    let nanachiUserConfig: any = {};
    try {
        nanachiUserConfig = require(path.join(cwd, 'nanachi.config'));
    } catch (err) {
        if (/SyntaxError/.test(err)) {
            // eslint-disable-next-line
            console.log(err);
        }
    }
   
    let onInstallTarball = nanachiUserConfig.chaikaConfig && nanachiUserConfig.chaikaConfig.onInstallTarball || function(){ return ''; };
    tarUrl = onInstallTarball(tarName, version);
    
    if (tarUrl) {
        let axiosConfig = {
            url: tarUrl,
            type: 'GET',
            responseType: 'arraybuffer'
        };
        
        let { data } = await axios(axiosConfig);
        let libDist = path.join(cwd, `.CACHE/lib/${path.basename(tarUrl)}`);
        fs.ensureFileSync(libDist);
        fs.writeFile(libDist, data, function(err){
            if (err) {
                // eslint-disable-next-line
                console.log(err);
                return;
            }
            // eslint-disable-next-line
            console.log(chalk.green(`安装依赖包 ${tarName}@${version} 成功.`));
            unPack(
                libDist, 
                path.join(cwd, `.CACHE/download/${tarName}`)
            );
        });
    }
}


function downLoadConfigDepModule(){
    var pkg = require(path.join(cwd, 'package.json'));
    var depModules = pkg.modules || {};
    let depKey = Object.keys(depModules);
    if (!depKey.length) {
        // eslint-disable-next-line
        console.log(chalk.bold.red('未在package.json中发现拆库依赖包, 安装失败.'));
        process.exit(1);
    }
    depKey.forEach(function(key){
        if (/\.git$/.test(key)) {
            downLoadGitRepo(key, depModules[key]);
        } else {
            downLoadBinaryLib( key+'@'+depModules[key] );
        }
    });

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
        //nanachi install package.json中配置的所有包
        downloadInfo = {
            type: 'all',
            lib: ''
        };
    }
    if (name && !/\.git$/.test(name) ) {
        //nanachi install xxx@kkk
        downloadInfo = {
            type: 'binary',
            lib: name
        };
    }
    if (/\.git$/.test(name) && opts.branch && typeof opts.branch === 'string' ) {
        downloadInfo = {
            type: 'git',
            lib: name,
            version: opts.branch
        };
    }
    let {type, lib, version} = downloadInfo;

    if (type === 'git') {
        downLoadGitRepo(lib, version);
    }

    if (type === 'binary') {
        downLoadBinaryLib(lib);
    }

    if (type === 'all' ) {
        downLoadConfigDepModule();
    }

};




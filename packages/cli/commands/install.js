const shelljs = require('shelljs');
const cwd = process.cwd();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const glob = require('glob');

function unPack(src, dist) {
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
        files.forEach(function(el){
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


function downLoadGitRepo(target, branch){
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


async function downLoadBinaryLib(lib) {
    let [tarName, version] = lib.split('@');
    let tarUrl = '';
    let nanachiUserConfig = {};
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

module.exports = function( downloadInfo ){
   
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




const shelljs = require('shelljs');
const cwd = process.cwd();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');

function unPack(src, dist) {
    fs.ensureDirSync(dist);
    fs.emptyDirSync(dist);
    const unzipExec = shelljs.exec(`tar -zxvf ${src} -C ${dist}`, {
        silent: true
    });
    if (unzipExec.code) {
        console.log(chalk.bold.red(unzipExec.stderr));
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
    console.log(chalk.green(`download ${gitRepoName} success.`));
}


async function downLoadBinaryLib(lib) {
    let libUrl = '', libName = '', ext = '';
    let nanachiUserConfig = {};
    try {
        nanachiUserConfig = require(path.join(cwd, 'nanachi.config.js'));
    } catch (err) {
        // eslint-disable-next-line
    }

    let iRules = nanachiUserConfig.chaikaConfig && nanachiUserConfig.chaikaConfig.installRules || [];
    
    for (let i = 0; i < iRules.length; i++) {
        if ( iRules[i].test.test(lib) && iRules[i].rule ) {
            libUrl = iRules[i].rule(lib);
            libName = path.parse(libUrl).name;
            ext = path.parse(libUrl).ext;
            break;
        }
    }
    if (libUrl) {
        let axiosConfig = {
            url: libUrl,
            type: 'GET',
            responseType: 'arraybuffer'
        };
        
        let { data } = await axios(axiosConfig);
        let libDist = path.join(cwd, `.CACHE/lib/${libName}${ext}`);
        fs.ensureFileSync(libDist);
        fs.writeFile(libDist, data, function(err){
            if (err) {
                // eslint-disable-next-line
                console.log(err);
                return;
            }
            // eslint-disable-next-line
            console.log(chalk.green(`download ${libName} success.`));
            unPack(
                libDist, 
                path.join(cwd, `.CACHE/download/${libName}`)
            );
        });
    }
}


function downLoadConfigDepModule(){
    var pkg = require(path.join(cwd, 'package.json'));
    var depModules = pkg.modules || {};
    let depKey = Object.keys(depModules);
    if (!depKey.length) {
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




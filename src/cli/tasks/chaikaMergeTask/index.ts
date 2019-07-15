import copySource from './copySource';
import mergeFiles from './mergeFiles';
import * as path from 'path';
import * as fs from 'fs-extra';
const cwd = process.cwd();

function changeWorkingDir(){
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}
function makeSymLink(){
    let currentNpmDir = path.join(cwd, 'node_modules');
    let targetNpmDir = path.join(cwd, '.CACHE/nanachi/node_modules');
   
    //如果没有软连接目录，则创建
    if (!fs.existsSync(targetNpmDir)) {
        fs.symlinkSync(currentNpmDir , targetNpmDir);
        return;
    }
}

export default async function(){
    try {
        //copy 资源
        await copySource();
        //合并各种配置，注入
        await mergeFiles();
        //创建软连接
        makeSymLink();
        //更改进程所在目录
        //changeWorkingDir();
        
    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
    }
};
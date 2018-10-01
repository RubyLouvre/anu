const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();

const sources = [
    'ReactWX.js',
    'ReactAli.js',
    'ReactBu.js'
]

sources.forEach((item)=>{
    const src = path.join(cwd, `dist/${item}`);
    const dist = path.join(cwd, `packages/cli/packages/lib/${item}`);
    fs.ensureFileSync(dist);
    fs.copyFile(src, dist, (err)=>{
        if(err){
            // eslint-disable-line
            console.log(err);
        }else{
            // eslint-disable-line
            console.log(`${dist} 同步成功`);
        }
    })
})











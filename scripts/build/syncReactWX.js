const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const src = path.join(cwd, 'dist/ReactWX.js');

const template = ['qunar', 'pdd', 'music'];

template.forEach((item)=>{
    const dist = path.join(cwd, `packages/cli/packages/template/${item}/src/ReactWX.js`);
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











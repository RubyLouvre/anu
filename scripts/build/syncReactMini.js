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
    fs.writeFile(
        dist,
        fs.readFileSync(src, 'utf-8'),
        (err)=>{
            if(err){
                // eslint-disable-line
                console.log(err);
            }else{
                // eslint-disable-line
                console.log(`${dist} 同步成功`);
            }
        }
    )
})











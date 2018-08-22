const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
module.exports = function(usingComponents, modules){
    Object.keys(usingComponents).forEach((componentName)=>{
        //对usingComponents直接copy目录
        let componentDir = path.dirname(usingComponents[componentName]);
        let src = path.join(cwd,'src', componentDir );
        let dest = path.join(cwd,'dist', componentDir );
        let list = modules.useNativeComponentsList;
        fs.ensureDirSync(dest);
        fs.copySync(src, dest);
        if(!list.includes(componentName)) list.push(componentName);

    })
}
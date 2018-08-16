const fs = require('fs-extra');
const path = require('path');
const modules = require("../modules");

const log = console.log;
module.exports = (nPath, usingComponents)=>{
    Object.keys(usingComponents).forEach((componentName)=>{

        //对usingComponents直接copy目录
        let componentDir = path.dirname(usingComponents[componentName] );
        let src = path.join(process.cwd(),'src', componentDir );
        let dest = path.join(process.cwd(),'dist', componentDir );
        fs.ensureDirSync(dest);
        fs.copySync(src, dest);
        
            
        modules.useNativeComponentsList = modules.useNativeComponentsList || [];
        if(!modules.useNativeComponentsList.includes(componentName) ){
            modules.useNativeComponentsList.push(componentName)
        }

    })


}
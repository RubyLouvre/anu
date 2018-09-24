const path = require('path');
const cwd = process.cwd();
const queue = require('./queue');
const fs = require('fs-extra');
const config = require('./config');
const nodeResolve = require('resolve');
const isLess = (filePath)=>{
    return /\.less$/.test(filePath);
};
const isCss = (filePath)=>{
    return /\.css$/.test(filePath);
};
const isSass = (filePath)=>{
    return /\.(scss|sass))$/.test(filePath);
};
const getDist = (filePath) =>{
    let { name, dir } = path.parse(filePath);
    let relativePath = path.relative( path.join(cwd, 'src'), dir);
    let distDir = path.join(cwd, 'dist', relativePath);
    let styleExt = config[config['buildType']].styleExt; //获取构建的样式文件后缀名
    let distFilePath = path.join(distDir, `${name}.${styleExt}` );
    return distFilePath;
};

const compileLess = (filePath, styleFiles)=>{
    
    var less = require('less');
    return new Promise((resolve, reject)=>{
        less.render(
            fs.readFileSync(filePath).toString(),
            {
                paths: [path.join(cwd, 'src')] // Specify search paths for @import directives
            }
        )
            .then(res => {
                let code = res.css.toString();
            
                //如果less有@import依赖, 不断的添加到styleFiles中
                if (res.imports.length){
                    res.imports.forEach((item)=>{
                        if (!styleFiles.includes(item)){
                            styleFiles.push(item);
                        }
                    });
                }
                resolve(code);
            })
            .catch(err => {
                if (err){
                // eslint-disable-next-line
                console.log(err);
                }
            });
    });
    
};

const compileSass = (filePath)=>{
    //nodeResolve()
    let sass = require('node-sass');
    return new Promise((resolve, reject)=>{
        sass.render(
            {
                file: file
            },
            (err, res) => {
                if (err) throw err;
                let code = res.css.toString();
                resolve(code);
            }
        );
    });
    

};


module.exports = async (currentFilePath, styleFiles)=>{

    // for(let i = 0; i < styleFiles.length; i++){
        
    // }

    

    let filePath = currentFilePath;
    let distPath = getDist(filePath);
    let code = '';
    if (isLess(filePath)){
        code = await compileLess(filePath, styleFiles);
    } else if (isSass(filePath)){

    }
    queue.push({
        code: code,
        type: 'css',
        path: distPath
    });

    
};
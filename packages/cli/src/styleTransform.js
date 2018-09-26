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

    if(/app.less/.test(filePath)){
        console.log(distFilePath, '------');
    }
    return distFilePath;
};

const compileLess = (filePath)=>{
    
    
    var less = require('less');
    var content = fs.readFileSync(filePath).toString();
    less.render(
        content,
        {
            filename: path.resolve(filePath)
        }
    )
    .then(res => {
        let code = res.css;
        //为什么app.wxss丢失？
        queue.push({
            code: code,
            type: 'css',
            path: getDist(filePath)
        });
       

    })
    .catch(err => {
        if (err){
            // eslint-disable-next-line
            console.log(err);
        }
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


module.exports = (filePath)=>{

    
    
    
    if (isLess(filePath)){
        compileLess(filePath);
    } else if (isSass(filePath)){

    }

    // if(/app/.test(filePath)){
    //    // console.log(code);
    //     console.log(getDist(filePath));
    // }
    
    // queue.push({
    //     code: code,
    //     type: 'css',
    //     path: getDist(filePath)
    // });
    
    //console.log(queue)
   

    
};
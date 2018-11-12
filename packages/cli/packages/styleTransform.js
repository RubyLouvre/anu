/* eslint no-console: 0 */

const path = require('path');
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const validateStyle = require('./validateStyle');
const exitName = config[config['buildType']].styleExt;

const isLess = (filePath) => {
    return /\.less$/.test(filePath);
};
const isCss = (filePath) => {
    return /\.css$/.test(filePath);
};
const isSass = (filePath) => {
    return /\.(scss|sass)$/.test(filePath);
};
const getDist = (filePath) =>{
    filePath = utils.resolvePatchComponentPath(filePath);
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir } =  path.parse(dist);
    return  path.join(dir, `${name}.${exitName}`);
};

var less = require('less');
var sass = require('node-sass');


const compileLess = (filePath, originalCode) => {
    less.render(
        originalCode,
        {
            filename: filePath
        }
    )
        .then(res => {
            let code = validateStyle(res.css);
            if (!code) return;
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
        })
        .catch(err => {
            //eslint-disable-next-line
            console.log('filePath: ', filePath,'\n', err);
        });
};

const compileSass = (filePath) => {
    sass.render(
        {
            file: filePath,
            importer: (url)=>{
                //url: import的路径
                url = utils.resolveStyleAlias(filePath, url);  //resolveStyleAlias: //处理scss文件中的alias配置
                return {
                    file: url
                };
            }
        },
        (err, result)=>{
            if (err) {
                console.log(err);
                return;
            }
            let code = result.css.toString();
            if (!code) return;
            code = validateStyle(code);
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
        }
        
    );
    
};

module.exports = (data) => {
    let {id, originalCode} = data;
    if (isLess(id) || isCss(id)) {
        compileLess(id, originalCode);
    } else if (isSass(id)) {
        compileSass(id);
    }
};

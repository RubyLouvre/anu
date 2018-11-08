/* eslint no-console: 0 */

const path = require('path');
const cwd = process.cwd();
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
/* eslint-disable */
const compileLess = (filePath, originalCode) => {
   
    less.render(
        originalCode,
        {
            filename: filePath
        }
    )
        .then(res => {
            let code = validateStyle(res.css);
            if(!code) return;
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        });
};

const renderSass = (filePath) => {
    let sass = require(path.join(cwd, 'node_modules', 'node-sass'));
    sass.render(
        {
            file: filePath
        },
        (err, res) => {
            if (err) {
              console.log('filePath: ', filePath,'\n', err);
              return;
            }
            let code = validateStyle(res.css.toString());
            if(!code) return;
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
        }
    );
};
const compileSass = (filePath) => {
    try {
        require(path.join(cwd, 'node_modules', 'node-sass', 'package.json'));
    } catch (err) {
        utils.installer('node-sass', 'dev')
    }
    renderSass(filePath);
};


module.exports = (data) => {
    let {id, originalCode} = data;
    if (isLess(id) || isCss(id)) {
        compileLess(id, originalCode);
    } else if (isSass(id)) {
        compileSass(id);
    }
};

/* eslint no-console: 0 */

const path = require('path');
const cwd = process.cwd();
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const fs = require('fs-extra');
const validateStyle = require('./validateStyle');
const appSassStyleFileNameReg = /app\.(scss|sass)$/;

const isLess = (filePath) => {
    return /\.less$/.test(filePath);
};
const isCss = (filePath) => {
    return /\.css$/.test(filePath);
};
const isSass = (filePath) => {
    return /\.(scss|sass)$/.test(filePath);
};
const getDist = (filePath) => {
    let { name, dir } = path.parse(filePath);
    let relativePath = path.relative(path.join(cwd, 'src'), dir);
    let distDir = path.join(cwd, 'dist', relativePath);
    let styleExt = config[config['buildType']].styleExt; //获取构建的样式文件后缀名
    let distFilePath = path.join(distDir, `${name}.${styleExt}`);
    return distFilePath;
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
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
            utils.emit('build');
        })
        .catch(err => {
            if (err) {
                console.log(err);
            }
        });

};

const renderSass = (filePath, originalCode) => {
    let sass = require(path.join(cwd, 'node_modules', 'node-sass'));

    /**
     * node-sass配置{data : originalCode}处理@import语句比较繁琐，所以用{file: filePath},
     * 但app样式中可能存在动态分析插入的@import引用component样式，所以先写入一个隐藏文件, file api读取的是隐藏文件目录
     */
    if (appSassStyleFileNameReg.test(filePath)) {
        try {
            var hideAppStylePath = filePath.replace(/app\.(scss|sass)$/, '.app.$1');
            fs.ensureFileSync(hideAppStylePath);
            fs.writeFileSync(hideAppStylePath, originalCode)
        } catch (err) {
            if (err) {
                console.log(err);
            }
        }
    }



    sass.render(
        {
            file: appSassStyleFileNameReg.test(filePath) ? hideAppStylePath : filePath
        },
        (err, res) => {
            if (err) throw err;
            let code = validateStyle(res.css.toString());
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
            utils.emit('build');


            if (appSassStyleFileNameReg.test(filePath)) {
                fs.remove(hideAppStylePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    );
};
const compileSass = (filePath, originalCode) => {
    try {
        require(path.join(cwd, 'node_modules', 'node-sass', 'package.json'));
    } catch (err) {
        utils.installer('node-sass')
    }
    renderSass(filePath, originalCode);
};


module.exports = (data) => {
    const { id, originalCode } = data;
    if (isLess(id) || isCss(id)) {
        compileLess(id, originalCode);
    } else if (isSass(id)) {
        compileSass(id, originalCode);
    }

};

/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const commentParser = require('postcss-comment');
const validateStyle = require('../validateStyle');
const utils = require('../utils');
const less = require('less');
const precss = require('precss');  //解析sass-like语法

//postcss插件: 清除注释
var removeComment = postCss.plugin('postcss-plugin-remove-comment', function(){
    return function(root){
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

const compileSass = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        postCss([
            removeComment,
            require('postcss-import')({
                resolve(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.s[ca]ss/.test(importer)) {
                        importer = importer + '.scss';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            }),
            precss()
        ])
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath,   
                    parser: commentParser, //兼容非标准css注释
                }
            )
            .then((result)=>{
                let code = validateStyle(result.css);
                resolved({
                    code: code
                });
            })
            .catch((err)=>{
                reject(err);
            });
    });
    
};


const compileLess = (filePath, originalCode) => {
    return new Promise((resolve, reject)=>{
        postCss([
            removeComment,
            require('postcss-import')({
                resolve(importer, baseDir){
                    
                    if (!/\.less/.test(importer)) {
                        importer = importer + '.less';
                    }
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            })
        ])
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath
                }
            )
            .then((result)=>{
                less.render(
                    result.css,
                    {
                        filename: filePath
                    }
                )
                    .then((result)=>{
                        let code = validateStyle(result.css);
                        resolve({
                            code: code
                        });

                    });
            })
            .catch((err)=>{
                reject(err);
            });
    });

};

module.exports = {
    compileSass,
    compileLess
};
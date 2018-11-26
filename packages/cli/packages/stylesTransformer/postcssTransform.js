/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const commentParser = require('postcss-comment');
const validateStyle = require('../validateStyle');
const utils = require('../utils');
const less = require('less');
//const chalk = require('chalk');

//postcss插件: 清除注释
var removeComment = postCss.plugin('postcss-plugin-remove-comment', ()=>{
    return (root)=>{
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

//解析sass darken和lighten函数
/**
 * darken($color: #fff, $amount: 100) => color(#fff shade(100%))
 * lighten($color: #000, $amount: 100) => color(#000 tint(100%))
 */

var transformDarkenOrLighten = postCss.plugin('postcss-plugin-darken-lighten-fn', ()=>{
    var ruleRegMap =  {
        darken: (value)=>{
            value = value.replace('darken', 'color')                //darken => color
                .replace(/(\$color|\$amount|:|%)/g, '')    //删掉  [$color | $amount | : ]
                .replace(/,\s*(\d+)/, function(a,b){
                    return ' ' + `shade(${b}%)`;			//color(#ff9800, 10) => color(#ff9800 shade(10%));
                });
            return value;
        },
        lighten: (value)=>{
            value = value.replace('lighten', 'color')             
                .replace(/(\$color|\$amount|:|%)/g, '')  
                .replace(/,\s*(\d+)/, function(a,b){
                    return ' ' + `tint(${b}%)`;
                });
            return value;
        }
    };
    return (root)=>{
        root.walkRules((rule)=>{
            rule.walkDecls( (decl) => {
                let fnName =  decl.value.replace(/\(.+\)/g, '');
                if (typeof ruleRegMap[fnName] === 'function') {
                    decl.value = ruleRegMap[fnName](decl.value);
                }
            });
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
            transformDarkenOrLighten,
            require('postcss-color-hsl'),
            require('postcss-color-function'),
            require('precss'),
            require('postcss-automath'),     //5px + 2 => 7px
            
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
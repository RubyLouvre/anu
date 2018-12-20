/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const validateStyle = require('../validateStyle');
const utils = require('../utils');
const chalk = require('chalk');

//postcss插件: 清除注释
const postCssRemoveComments = postCss.plugin('postcss-plugin-remove-comment', ()=>{
    return (root)=>{
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

/**
 * 解析sass darken和lighten函数
 * darken($color: #fff, $amount: 10) => darken(#fff, 10%);
 * lighten($color: #000, $amount: 100) => lighten(#000, 100%);
 * */
const postCssTransformDarkenOrLighten = postCss.plugin('postcss-plugin-darken-lighten-fn', ()=>{
    return (root)=>{
        root.walkRules((rule)=>{
            rule.walkDecls( (decl) => {
                if ( /^(darken|lighten)\b/.test(decl.value) ) {
                    decl.value = decl.value.replace(/\$(color|amount)\s*:|%|\s/g, '')  
                        .replace(/,(\d+)/, function(a){
                            return a+'%';
                        });
                }
            });
        });
    };
});


//移除自定义函数, 提示用@mixin
const postCssWalkAtFunction = postCss.plugin('pistcss-plugin-walk-at-@function', ()=>{
    return (root)=>{
        root.walkAtRules((rule) => {
            if (rule.name !== 'function') return;
            rule.remove();
            console.log(
                '\n' + 'Warning: ' +chalk.yellow('不支持函数指令@function, 请使用@mixin') + '\n',
                `    at ${rule.source.input.file}:${rule.source.start.line}:${rule.source.start.column}`
            );
        });
    };
});


const compileSassByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        postCss([
            require('postcss-import')({
                resolve(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.s[ca]ss$/.test(importer)) {
                        importer = importer + '.scss';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            }),
            postCssRemoveComments,
            postCssTransformDarkenOrLighten,
            postCssWalkAtFunction,
            require('postcss-nested-props'),   //属性嵌套
            require('precss'),
            require('postcss-automath'),       //5px + 2 => 7px
            
        ])
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath,   
                    parser: require('postcss-scss')  //@each | @if | Interpolation(插值: ${})
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

module.exports = compileSassByPostCss;

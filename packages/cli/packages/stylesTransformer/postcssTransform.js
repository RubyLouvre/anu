/* eslint no-console: 0 */
const path = require('path');
const fs = require('fs');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const commentParser = require('postcss-comment');
const validateStyle = require('../validateStyle');
const config = require('../config');
//const utils = require('../utils');
const exitName = config[config['buildType']].styleExt;
const less = require('less');
const precss = require('precss');  //解析sass-like语法

//postcss插件: 获取所有@import id;
// var postcssPluginImport = postCss.plugin('postcss-plugin-import', function(opts){
//     opts = opts || {};
//     return function(root){
//         root.walkAtRules((rule)=>{
//             if ( rule.name === 'import') {
//                 typeof opts.getImport === 'function' && opts.getImport(rule.params.replace(/'|"/g, ''));
//                 rule.remove();
//             } 
            
//         });
//     };
// });


//postcss插件: 清除注释
var postCssRemoveComments = postCss.plugin('postcss-plugin-remove-comment', function(){
    return function(root){
        root.walkComments(comment => {
            comment.remove();
        });
    };
});


var insertImportsCode = (originCode, imports)=>{
    //将@import的依赖插入到文件头部
    let importPragram = imports.map((importPath)=>{
        if (config.buildType != 'quick') {
            importPath = importPath.replace(/\.(scss|sass|less|css)$/g, `.${exitName}`);
        }
        return `@import '${importPath}';`;
    });
    let code = importPragram.length ? importPragram.join('\n') + '\n' + originCode : originCode;
    return code;
};

const compileSass = (filePath)=>{
    let originCode = fs.readFileSync(filePath).toString();
    return new Promise((resolved, reject)=>{
        postCss([
            
            precss({ 'import': { extension: 'scss' }}),
            postCssRemoveComments,
            autoprefixer
        ])
            .process(
                originCode,
                {
                    from:  undefined,   //https://github.com/ionic-team/ionic/issues/13763
                    parser: commentParser //兼容非标准css注释
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


const compileLess = (filePath) => {
    let imports = [];
    let originCode = fs.readFileSync(filePath).toString();
    return new Promise((resolve, reject)=>{
        postCss([
            postCssRemoveComments,
            // postcssPluginImport({
            //     getImport(id){
            //         if (!id.endsWith('.less')) {
            //             id = id + '.less';
            //         }
            //         id =  utils.resolveStyleAlias(filePath, id); //处理alias
            //         imports.push(id);
            //     }
            // }),
            autoprefixer
        ])
            .process(
                originCode,
                {
                    from: undefined
                }
            )
            .then((result)=>{
                less.render(
                    result.css
                )
                    .then((result)=>{
                        let code = validateStyle(result.css);

                        code = insertImportsCode(code, imports);
                        resolve({
                            code: code,
                            importer: imports.map((id)=>{
                                return path.resolve( path.dirname(filePath), id);
                            }),
                            id: filePath
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
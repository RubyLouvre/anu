/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const validateStyle = require('../validateStyle');
const utils = require('../utils');

//postcss插件: 清除注释
const postCssRemoveComments = postCss.plugin('postcss-plugin-remove-comment', ()=>{
    return (root)=>{
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

const postCssPluginLessVar = postCss.plugin('postCssPluginLessVar', ()=> {
    function findValue(node, decl) {
        let find = false;
        let value;
        // 遍历variable 找出当前节点下变量定义
        node.walkAtRules(rule => {
            if (rule.variable && rule.name === decl.value.split('@')[1]) {
                find = true;
                value = rule.value;
            }
        });
        if (find && value) {
            decl.value = value;
        }
        // 没找到或到达根节点则退出递归
        if (!find && node.type !== 'root') {
            findValue(node.parent, decl);
        }
    }

    return (root) => {
        root.walkDecls(decl => {
            // 找出变量
            if (decl.value && decl.value.match(/(@{?[a-zA-Z0-9-_.]+}?)/g)) {
                findValue(decl.parent, decl);
            }
        });
    };
});

const compileLessByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        postCss([
            require('postcss-import')({
                resolve(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.less/.test(importer)) {
                        importer = importer + '.less';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            }),
            postCssRemoveComments,
            postCssPluginLessVar,
            require('postcss-nested-props'),   //属性嵌套
            require('precss'),
            require('postcss-automath')       //5px + 2 => 7px
            
        ])
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath,   
                    parser: require('postcss-less'),
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



module.exports = compileLessByPostCss;

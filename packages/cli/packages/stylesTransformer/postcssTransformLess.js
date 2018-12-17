/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const validateStyle = require('../validateStyle');
const utils = require('../utils');
const varReg = /@{?([a-zA-Z0-9-_.]+)}?/;

//postcss插件: 清除注释
const postCssRemoveComments = postCss.plugin('postcss-plugin-remove-comment', ()=>{
    return (root)=>{
        root.walkComments(comment => {
            comment.remove();
        });
    };
});

const postCssPluginLessVar = postCss.plugin('postCssPluginLessVar', ()=> {
    function findVar(node, decl) {
        let find = false;
        let value;
        // 遍历variable 找出当前节点下变量定义
        node.walkAtRules(rule => {
            decl.value.replace(varReg, function(a, b) {
                if (b && b === rule.name) {
                    find = true;
                    value = rule.value;
                }
                return a;
            });
        });
        if (find && value) {
            decl.value = decl.value.replace(varReg, value);
        }
        // 没找到或到达根节点则退出递归
        if (!find && node.type !== 'root') {
            findVar(node.parent, decl);
        }
    }

    return (root) => {
        root.walkDecls(decl => {
            // 找出变量
            if (decl.value && decl.value.match(varReg)) {
                findVar(decl.parent, decl);
            }
        });
        // 移除变量声明
        root.walkAtRules(rule => {
            if (rule.variable) {
                rule.remove();
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

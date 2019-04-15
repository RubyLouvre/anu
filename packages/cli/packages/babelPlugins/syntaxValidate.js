let config = require('../config');
let path = require('path');
let g = require('@babel/generator').default;
let cwd = process.cwd();
let logQueue = require('../../nanachi-loader/logger/queue');


//校验代码行数
function checkCodeLine( {filePath, code, number = 500} ){
    if (/\/node_modules\//.test( filePath.replace(/\\/g, '/')) ) {
        return;
    }
    let line =  code.match(/\n/g);
    if ( !line || line.length <= number ) return;
   
    logQueue.warning.push({
        id: filePath,
        level: 'warning',
        msg: `${filePath} 文件代码不能超过${number}行, 请优化.`
    });
}


//校验目录规范, pages中不能含有components目录, 反之亦然。
function checkoutFilePath(filePath) {
    //把目录分割成数组
    let pathAray = path.relative( cwd,  filePath).replace(/\\/, '/').split('/');  //把目录分割成数组
   
    let componentsPos = pathAray.indexOf('components');
    let pagesPos = pathAray.indexOf('pages');
    let msg = '';

    if (componentsPos === -1 || pagesPos === -1) return;
    componentsPos > pagesPos
        ? msg = `${filePath} pages 目录下不能包含 components 目录, 请修复.`
        : msg = `${filePath} components 目录下不能包含 pages 目录, 请修复.`;

    logQueue.error.push({
        id: filePath,
        level: 'error',
        msg: msg
    });
    
}


//校验组件目录规范
function checkImportComponent( filePath ){
    if ( !/\/components\//.test(filePath.replace(/\\/, '/')) ) return;
    let componentsDir = path.join(cwd, 'source', 'components');
    // 如果是 components 中的组件需要校验
    if (filePath.indexOf(componentsDir) === 0) {
        let restComponentsPath = filePath.replace(componentsDir, '');
        if (!/^(\/|\\)[A-Z][a-zA-Z0-9]*(\/|\\)index\.js/.test(restComponentsPath)) {
            logQueue.error.push({
                id: filePath,
                level: 'error',
                msg: filePath
                    + '\n组件名必须首字母大写\nimport [组件名] from \'@components/[组件名]/[此处必须index]\''
                    + '\neg. import Loading from \'@components/Loading/index\'\n'
            });
        }
    }
}



//校验jsx规范
function validateJsx(astPath, state){
    
    let expression =  astPath.node.expression;
    let callee = expression.callee;
    let type = expression.type;

    if (type === 'StringLiteral') return;
    if (typeof astPath.node.loc === 'undefined') return;

    
    let fileId = path.relative(cwd, state.filename);
    let { line, column } = astPath.node.loc.start;

    //判断map的数组是否经过函数处理. 例如: list.slice(0,2).map
    if (
        type === 'CallExpression'
        && callee && callee.property && callee.property.name === 'map'
        && callee.object.type === 'CallExpression'
    ) {
        logQueue.error.push({
            id: fileId,
            level: 'error',
            msg: `jsx中无法调用非map函数\nat ${fileId}:${line}:${column}\n ${g(astPath.node).code}\n`,
        });
        return;
    }

    //属性插值中，不能调用函数
    if ( 
        astPath.parentPath.type === 'JSXAttribute' //属性节点
        && !/^(on)|(catch)/.test(astPath.parentPath.node.name.name) //跳过属性中事件on|catch绑定  属性名不是事件绑定
        && type === 'CallExpression'     //属性值是函数调用
        && callee.property && callee.property.name != 'bind'   //属性值是非bind函数调用
    ) {
        logQueue.error.push({
            id: fileId,
            level: 'error',
            msg: `jsx属性中无法调用函数.\nat ${fileId}:${line}:${column}\n ${g(astPath.node).code}\n`,
        });
        return;
    }

    //三元表达式中不能调用函数
    if (astPath.parentPath.type === 'JSXAttribute' && type === 'ConditionalExpression') {
        astPath.traverse({
            CallExpression: function(){
                logQueue.error.push({
                    id: fileId,
                    level: 'error',
                    msg: `jsx属性中三元表式无法调用非map函数.\nat ${fileId}:${line}:${column}\n${g(astPath.node).code}\n`,
                });
            }
        });
    }
}




module.exports = function(){
    return {
        pre: function( data ){
            let filePath =  data.opts.filename;

            checkCodeLine({
                filePath: filePath,
                code: data.code
            });

            checkoutFilePath(filePath);
            checkImportComponent(filePath);
            
        },
        visitor: {
            JSXExpressionContainer: {
                enter: function(astPath, state){
                    if (['wx', 'tt', 'qq'].includes(config.buildType)) {
                        validateJsx(astPath, state);
                    }
                }
            }
        }
    }
}

//条件import
/**
 *  // if process.env.ANU_ENV === [wx|ali|bu|quick]
 *  import ...
 */
var g = require('@babel/generator').default;
let config = require('../config');
let visitor = {
    ImportDeclaration: {
        exit(astPath) {
            let node  = astPath.node;
            if (node.leadingComments) {
                let targetEnvReg = new RegExp(`\\s*if\\s+(process\\.env\\.ANU_ENV\\s*={2,3}\\s*\\'(${config.buildType})\\';?)`, 'g');
                let envReg = /\s*if\s+(process\.env\.ANU_ENV\s*={2,3}\s*'(wx|ali|bu|quick)';?)/g;
                let leadingComments = node.leadingComments.pop();

                if (!leadingComments) return;

                let commentValue = leadingComments.value;
                
                if (
                  leadingComments.type === 'CommentLine' //单行注释
                   && envReg.test(commentValue)              //满足if语句
                   && !targetEnvReg.test(commentValue)       //匹配非ANU_ENV值的import语句
                ) { 
                   //移除无法匹配ANU_ENV的import语句
                   astPath.remove();
                }
            }
        }
    }
};
module.exports = function(){
    return {
        visitor: visitor
    };
};
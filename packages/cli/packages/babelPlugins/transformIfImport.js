//条件import
/**
 *  // if process.env.ANU_ENV === [wx|ali|bu|quick]
 *  import ...
 */
let config = require('../../config/config');
let visitor = {
    ImportDeclaration: {
        enter(astPath) {
            let node  = astPath.node;
            if (node.leadingComments) {
                let envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*'([\w|]*)';?/;
                let leadingComments = node.leadingComments;
                for (let i = 0; i < leadingComments.length; i++){
                    let commentValue = leadingComments[i].value;
                    const match = commentValue.match(envReg);
                    if (
                        leadingComments[i].type === 'CommentLine' //单行注释
                        && match            //满足if语句
                    ) { 
                        const targetEnvs = match[1] && match[1].split('|');
                        //移除无法匹配ANU_ENV的import语句
                        if (targetEnvs && !targetEnvs.includes(config.buildType)) {
                            astPath.remove();
                            break;
                        }
                    }
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

    
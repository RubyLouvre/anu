//条件import
/**
 *  // if process.env.ANU_ENV === [wx|ali|bu|quick]
 *  import ...
 */
let buildType = process.env.ANU_ENV;
let visitor = {
    ImportDeclaration: {
        enter(astPath) {
            let node = astPath.node;
            if (node.leadingComments && node.leadingComments.length) {
                let envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*'([\w|]*)';?/;
                if (node.leadingComments.length > 1) {
                    node.leadingComments = [ node.leadingComments.pop()];
                }
                let lastCom = node.leadingComments[0];
                let commentValue = lastCom.value;
                const match = commentValue.match(envReg);
                if (
                    lastCom.type === 'CommentLine' //单行注释
                    && match            //满足if语句
                ) { 
                    const targetEnvs = match[1] && match[1].split('|');
                    //移除无法匹配ANU_ENV的import语句
                    if (targetEnvs && !targetEnvs.includes(buildType)) {
                        astPath.remove();
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
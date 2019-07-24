//条件import
/**
 *  // if process.env.ANU_ENV === [wx|ali|bu|quick]
 *  import ...
 */
import * as t from '@babel/types';
import { NodePath, PluginObj } from '@babel/core';
import config from '../../config/config';
const envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*'([\w|]*)';?/;
let visitor = {
    Program: {
        // 必须enter时删除，在其他插件解析前就将无用的import语句删除
        enter(astPath: NodePath<t.Program>) {
            const nodes = astPath.node.body;
            // 此处不能使用visitor访问import节点，因为删除节点后可能会改变下一个import语句的leadingComments，必须使用遍历节点的方式实现按需打包
            astPath.node.body = nodes.filter((node) => {
                const leadingComments = node.leadingComments;
                if (node.type === 'ImportDeclaration' && leadingComments) {
                    for (let i = 0; i < leadingComments.length; i++){
                        let commentValue = leadingComments[i].value;
                        const match = commentValue.match(envReg);
                        if (
                            leadingComments[i].type === 'CommentLine' //单行注释
                            && match            //满足if语句
                        ) { 
                            const targetEnvs: any = match[1] && match[1].split('|');
                            //移除无法匹配ANU_ENV的import语句
                            if (targetEnvs && !targetEnvs.includes(config.buildType)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });
        }
    }
};
module.exports = function(): PluginObj{
    return {
        visitor: visitor
    };
};
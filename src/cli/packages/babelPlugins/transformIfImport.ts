import * as t from '@babel/types';
import { NodePath, PluginObj } from '@babel/core';
import config from '../../config/config';
const envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*\[(.*)\];?/;
/**
 * 条件import
 *
 * ``` js
 * // if process.env.ANU_ENV === [wx|ali|bu|quick]
 * import xxx from 'xxx'
 * ```
 */
let visitor = {
    Program: {
        // 必须enter时删除，在其他插件解析前就将无用的import语句删除
        enter(astPath: NodePath<t.Program>) {
            const nodes = astPath.node.body;
            // 此处不能使用visitor访问import节点，因为删除节点后可能会改变下一个import语句的leadingComments，必须使用遍历节点的方式实现按需打包
            astPath.node.body = nodes.filter(node => {
                const leadingComments = node.leadingComments;
                /**
                 * 使用了 import 语句,并且import上方有注释
                 * leadingComments: import 上方可能有多条注释 
                 */
                if (node.type === 'ImportDeclaration' && leadingComments) {
                    for (let i = 0; i < leadingComments.length; i++) {
                        const { type, value: commentValue } = leadingComments[i];
                        const match = commentValue.match(envReg);
                        /**
                         * CommentLine 单行注释
                         * march: 匹配注释 if process.env.ANU_ENV === [wx|ali|bu|quick]
                         */
                        if (type === 'CommentLine' && match) {
                            const targetEnvs: any = match[1];
                            //移除无法匹配ANU_ENV的import语句
                            if (targetEnvs && !targetEnvs.includes(config.buildType)) {
                                return false;
                            }
                            // 删掉对应的注释
                            t.removeComments(node);
                        }
                    }
                }
                return true;
            });
            console.log();
        }
    }
};
module.exports = function (): PluginObj {
    return {
        visitor: visitor
    };
};

import config from '../../config/config';
import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';
/**
 * 用于搜集快应用 titlebar 显示隐藏配置
 */
module.exports = function(): PluginObj{
    return {
        visitor: {
            ObjectProperty(astPath: NodePath<t.ObjectProperty>, state: any){
                if (config['buildType'] !== 'quick' || astPath.node.key.name !== 'navigationBarTitleText') return;
                let fileId = state.file.opts.filename;
                let node = astPath.node;
                if ((node.value as t.StringLiteral).value === '') {
                    //config.quick.disabledTitleBarPages.push(fileId)
                    config['quick']['disabledTitleBarPages'].add(fileId);
                }
            }
        }
    };
};
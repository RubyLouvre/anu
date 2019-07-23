// 过滤快应用中不支持的属性
import config from '../../config/config';

module.exports = function ignoreAttri(astPath: any, nodeName: string) {
    
    if (attributes[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el: any) {
            const ignoreRule = attributes[nodeName].rules;
            const ignoreFunc = attributes[nodeName].ruleFunc;
            const attriName = el.name.name.toLowerCase();
            // 过滤rules中的规则
            if (ignoreRule.includes(attriName)) {
                return false;
            }
            // 过滤ruleFunc中匹配的规则
            if (typeof ignoreFunc === 'function') {
                return ignoreFunc(attriName, el.value);
            }
            return true;
        });
    }
};

/**
 * rules 优先匹配，匹配到删除规则
 * ruleFunc 根据props值匹配
 */
const attributes: any = {
    form: {
        rules: ['onsubmit', 'bindsubmit']
    },
    button: {
        rules: ['ongetphonenumber']
    }
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function ignoreAttri(astPath, nodeName) {
    if (attributes[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el) {
            const ignoreRule = attributes[nodeName].rules;
            const ignoreFunc = attributes[nodeName].ruleFunc;
            const attriName = el.name.name.toLowerCase();
            if (ignoreRule.includes(attriName)) {
                return false;
            }
            if (typeof ignoreFunc === 'function') {
                return ignoreFunc(attriName, el.value);
            }
            return true;
        });
    }
};
const attributes = {
    form: {
        rules: ['onsubmit', 'bindsubmit']
    },
    button: {
        rules: ['ongetphonenumber']
    }
};

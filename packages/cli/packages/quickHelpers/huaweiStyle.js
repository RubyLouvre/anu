"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("@babel/generator"));
const ignoreCss_1 = __importDefault(require("./ignoreCss"));
module.exports = function huaWeiStyleTransform(expr, isString) {
    if (isString) {
        return transform(generator_1.default(expr).code);
    }
    var obj = expr.properties;
    var str = '';
    for (let i in obj) {
        var attrName = hyphen(obj[i].key.name);
        var attrValue = obj[i].value;
        var attrType = attrValue.type;
        var value;
        switch (attrType) {
            case 'MemberExpression':
            case 'ConditionalExpression':
                value = transform(generator_1.default(attrValue).code);
                break;
            case 'BinaryExpression':
                let left = generator_1.default(attrValue.left).code;
                let right = generator_1.default(attrValue.right).code;
                if (/rpx/gi.test(right)) {
                    value = replaceWithExpr(left) + 'px';
                }
                else {
                    value = replaceWithExpr(left + '*2') + 'px';
                }
                break;
            default:
                value = transform(attrValue.value);
                break;
        }
        if (ignoreCss_1.default[attrName]) {
            if (ignoreCss_1.default[attrName] === true) {
                continue;
            }
            else if (!ignoreCss_1.default[attrName](value)) {
                continue;
            }
        }
        str += attrName + ':' + value + ';';
    }
    return str;
};
var rpx = /(\d[\d\.]*)(r?px)/gi;
var rhyphen = /([a-z\d])([A-Z]+)/g;
function transform(val) {
    val = val + '';
    val = val.replace(rpx, (str, match, unit) => {
        if (unit.toLowerCase() === 'px') {
            match = parseFloat(match) * 2;
        }
        return match + 'px';
    });
    return replaceWithExpr(val);
}
function hyphen(target) {
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}
function replaceWithExpr(value) {
    if (value.indexOf('this.') >= 0) {
        value = `{{${value.replace(/this\.(\s*)/gi, '$1')}}}`;
    }
    return value;
}

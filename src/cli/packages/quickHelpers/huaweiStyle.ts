import generate from '@babel/generator';
import ignoreCss from './ignoreCss';

module.exports = function huaWeiStyleTransform(expr: any, isString: boolean) {
    if (isString) {
        
        return transform(generate(expr).code);
    }
    // 华为1040之前不支持style={ props.style123 },需要特殊处理
    var obj = expr.properties;
    var str = '';
    for (let i in obj) {
        var attrName = hyphen(obj[i].key.name);
        var attrValue = obj[i].value;
        var attrType = attrValue.type;
        var value;
        switch (attrType) {
            case 'MemberExpression': // style={{backgroundColor: this.state.color}}
            case 'ConditionalExpression': // style={{ height: this.state.arr && this.state.arr.length > 0 ? '100%' : 'auto' }}
                value = transform(generate(attrValue).code);
                break;
            case 'BinaryExpression': // 形如 style= {{height: this.state.height + 'px'}}
                let left = generate(attrValue.left).code;
                let right = generate(attrValue.right).code;
                if (/rpx/gi.test(right)) {
                    value = replaceWithExpr(left) + 'px';
                } else {
                    value = replaceWithExpr(left + '*2') + 'px';
                }
                break;
            default:
                value = transform(attrValue.value);
                break;

        }
        if (ignoreCss[attrName]) {
            if (ignoreCss[attrName] === true) {
                continue;
            } else if (!ignoreCss[attrName](value)) {
                continue;
            }
        }
        str += attrName + ':'+ value + ';';
    }
    return str;
};

var rpx = /(\d[\d\.]*)(r?px)/gi;
var rhyphen = /([a-z\d])([A-Z]+)/g;

function transform(val: string) {
    val = val + '';
    val = val.replace(rpx, (str, match, unit) => {
        if (unit.toLowerCase() === 'px') {
            match = parseFloat(match) * 2;
        }
        return match + 'px';
    });

    return replaceWithExpr(val);
}

function hyphen(target: string) {
    //转换为连字符风格
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}
// 将形如 this.state.value 变成 {{state.value}}
function replaceWithExpr(value: string) {
    if (value.indexOf('this.') >= 0) {
        value = `{{${value.replace(/this\.(\s*)/gi, '$1')}}}`;
    }
    return value;
}
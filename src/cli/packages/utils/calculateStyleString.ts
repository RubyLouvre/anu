//将<view style={{ borderColor: this.state.custom_field1_rule ? '#f5222d' : '', borderWidth: '1px', borderStyle: 'solid'}}>
// 转换成 <view style="border-color: {{state.custom_field1_rule ? '#f5222d' : ''}};border-width: 1rpx;border-style: solid">

const generate = require('@babel/generator').default;
const isVar =  /Expression|Identifier/
const rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target: string) {
    //转换为连字符风格
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}

function calculateStyleString(expr: any) {
    return expr.properties
        .map(function(node: any) {

            return (
                hyphen(node.key.name) +
                ': ' +
                (isVar.test(node.value.type)
                    ? `{{${generate(node.value).code.replace(/this\./, '')}}}`
                    : node.value.value)
            );
        })
        .join(';');
}

module.exports = calculateStyleString;
export default calculateStyleString;

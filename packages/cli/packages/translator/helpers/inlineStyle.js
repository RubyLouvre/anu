//将<view style={{ borderColor: this.state.custom_field1_rule ? '#f5222d' : '', borderWidth: '1px', borderStyle: 'solid'}}>
// 转换成 <view style="border-color: {{state.custom_field1_rule ? '#f5222d' : ''}};border-width: 1rpx;border-style: solid">


const generate = require('babel-generator').default;

var rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
  //转换为连字符风格
  return target.replace(rhyphen, '$1-$2').toLowerCase();
}

function style(expr) {
  var styleValue = expr.properties
    .map(function(node) {
      const key = node.key.name;
      const isVar = /Expression|Identifier/.test(node.value.type);
      // if (CSSProperty.hasLengthUnit[key] && !isVar) {
      //   node.value.value = node.value.value.replace(/(\d+)px/gi, '$1rpx');
      // }

      return hyphen(node.key.name) + ': ' + (isVar
        ? `{{${generate(node.value).code.replace(/this\./, '')}}}`
        : node.value.value);
    })
    .join(';');

  return styleValue;
}

module.exports = style;
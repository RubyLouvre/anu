// 处理行内样式

var rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
  //转换为连字符风格
  return target.replace(rhyphen, '$1-$2').toLowerCase();
}

function transform(obj) {
  return Object.keys(obj)
    .map(item => {
      let value = obj[item].toString();
      value= value.replace(/(\d+)px/gi, (str, match) => {
        return this.pxTransform(match);
      })
      return hyphen(item) + ': ' + value;
    })
    .join(';');
}

export function collectStyle(obj, props, key) {
  
  var str = transform.call(this, obj);
  props[key] = str;
  return obj;
}
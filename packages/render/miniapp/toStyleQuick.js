// 处理行内样式

var rhyphen = /([a-z\d])([A-Z]+)/g;
// function hyphen(target) {
//     //转换为连字符风格
//     return target.replace(rhyphen, '$1-$2').toLowerCase();
// }

function transform(obj) {
    var ret = {};
    for (var i in obj){
      let value = obj[i].toString();
      value = value.replace(/(\d+)px/gi, (str, match) => {
        return match + 'px';
      });
      ret[i] = value;
    }
    return ret;
}

export function toStyle(obj, props, key) {
    if (props) {
        if (typeof obj == 'string' ){
            var ret = {};
            obj.split(';').forEach(function(el){
                var index = el.indexOf(':');
                var name  = el.slice(0, index).trim();
                var value  = el.slice(index).trim();
                if (name){
                    ret[name] = value;
                }
            });
            obj = ret;
        }
        var str = transform.call(this, obj);
        props[key] = str;
    } else {
        console.warn('toStyle生成样式失败，key为',key);//eslint-disable-line
    }

    return obj;
}

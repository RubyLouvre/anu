// 处理行内样式

function camel(target) {
    //转换为驼峰风格
    return target.replace(/\-(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
}

function transform(obj) {
    var ret = {};
    for (var i in obj){
        let value = obj[i]+'';
        value = value.replace(/(\d+)px/gi, (str, match) => {
            return match + 'px';
        });
        ret[camel(i)] = value;
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

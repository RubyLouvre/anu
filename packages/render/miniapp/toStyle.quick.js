// 处理行内样式(快应用没有rpx)
var rcamel = /-(\w)/g;
var rpx = /(\d[\d\.]*)(r?px)/gi;
function camel(target) {
    //转换为驼峰风格
    return target.replace(rcamel, function(all, letter){
        return letter.toUpperCase();
    });
}

function transform(obj) {
    var ret = {};
    for (var i in obj){
        let value = obj[i]+'';
        value = value.replace(rpx, (str, match, unit) => {
            if ( unit.toLowerCase() === 'px') {
                match = parseFloat(match) * 2;
            } 
            return match + 'px';
        });
        ret[camel(i)] = value;
    }
    return ret;
}

export function toStyle(obj, props, key) {
    if (props) {
        if ( obj +'' === obj ){
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

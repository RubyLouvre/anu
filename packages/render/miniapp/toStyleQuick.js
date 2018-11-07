// 处理行内样式

var rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
    //转换为连字符风格
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}

function transform(obj) {
    var ret = {};
    for (var i in obj){
        ret[hyphen(i)] = obj[i];
    }
    return ret;
}

export function toStyle(obj, props, key) {
    if (props) {
        var str = transform.call(this, obj);
        props[key] = str;
    } else {
        console.warn('toStyle生成样式失败，key为',key);//eslint-disable-line
    }

    return obj;
}

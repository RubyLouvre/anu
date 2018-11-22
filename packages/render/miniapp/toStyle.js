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
            value = value.replace(/(\d+)px/g, (str, match) => {
                return this.pxTransform(match);
            });
            return hyphen(item) + ': ' + value;
        })
        .join(';');
}

export function toStyle(obj, props, key) {
    if (props) {
        if (typeof obj == 'object'){//clor: red;
            var str = transform.call(this, obj);
        } else {
            str = obj;
        }
        props[key] = str;
    } else {
        console.warn('toStyle生成样式失败，key为',key);//eslint-disable-line
    }

    return obj;
}



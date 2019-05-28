


const rsegments = /[\w\.-]+/g;
const path = require('path');
const config = require('../../config/config');

module.exports = function calculateComponentsPath(bag, nodeName, modules){
    // 如果包含别名，直接解析别名返回路径
    const aliasMap = require('../../consts/alias')(config.buildType);
    let [alias, ...rests] = bag.source.split(/[\\/]/);
    alias = aliasMap[alias];
    if (alias) {
        return path.join(alias, ...rests).replace(/^source/, '');
    }
    
    var parent = modules.current.match(rsegments);
    var son = bag.source.match(rsegments);
    var canPop = true;
    var noParentFlag = true;
    while (son[0] === '..'){
        noParentFlag = false;
        son.shift();
        if (canPop){
            parent.pop();
            canPop = false;
        }
        parent.pop();
    }
    var arr;
    if (noParentFlag) {
        arr = path.resolve(path.dirname(modules.current), bag.source).match(rsegments);
    } else {
        arr = parent.concat(son);
    }
    if (arr[0] == 'source'){
        arr.shift();
    }
    return "/"+arr.join('/')   // `/components/${nodeName}/index`;
}
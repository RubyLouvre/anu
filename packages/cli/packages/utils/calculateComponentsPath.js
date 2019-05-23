


const rsegments = /[\w\.]+/g;
const path = require('path');
const isWindow = require('./isWindow');
const isNpm = require('./isNpmModule');

module.exports = function calculateComponentsPath(bag, nodeName, modules){
    let sourcePath = modules.sourcePath;
      //import { xxx } from 'schnee-ui';
      if (isNpm(bag.source)) {
        return '/npm/' + bag.source + '/components/' + nodeName + '/index';
    }
    let isNodeModulePathReg = isWindow ? /\\node_modules\\/ : /\/node_modules\//;

    //如果XPicker中存在 import XOverlay from '../XOverlay/index';
    if ( isNodeModulePathReg.test(sourcePath) && /^\./.test(bag.source) ) {
        //获取用组件的绝对路径
        let importerAbPath = path.resolve(path.dirname(sourcePath), bag.source);
        return '/npm/' + importerAbPath.split(`${path.sep}node_modules${path.sep}`)[1]
    }
    var parent = modules.current.match(rsegments);
    var son = bag.source.match(rsegments);
    var canPop = true
    var noParentFlag = true;
    while(son[0] === '..'){
        noParentFlag = false;
        son.shift();
        if(canPop){
            parent.pop();
            canPop = false;
        }
        parent.pop()
    }
    var arr;
    if (noParentFlag) {
        arr = path.resolve(path.dirname(modules.current), bag.source).match(rsegments);
    } else {
        arr = parent.concat(son);
    }
    if(arr[0] == 'source'){
        arr.shift()
    }
    return "/"+arr.join('/')   // `/components/${nodeName}/index`;
}
let rword = /[^, ]+/g;
const config = require('../config');
const buildType = config.buildType;
const patchComponents = config[buildType].patchComponents;
let builtInStr =
    'block,scroll-view,swiper,swiper-item,movable-area,movable-view,cover-view,icon,rich-text,' +
    'progress,checkbox,picker,picker-view,radio,slider,switch,template,' +
    'navigator,audio,image,camera,video,live-player,live-pusher,map,canvas,open-data,web-view,radio-group,' +
    'slot,wxs,checkbox-group,loading';
let builtIn = {};
builtInStr.replace(rword, function(el) {
    builtIn[el] = el;
});


let map = Object.assign({}, builtIn);
'view'.replace(rword, function(el) {
    map[el] = 'div';
});
'text'.replace(rword, function(el) {
    map[el] = 'span';
});

module.exports = function mapTagName(path, modules) {
    var orig = path.node.name.name;
    var hasPatch = patchComponents[name];
    if (hasPatch){
        path.node.name.name = hasPatch.name; //{button: {name :'Button', href:''}}
        
        //在页面引入 import hasPatch.name from components/hasPatch.name /index
        //根据 hasPatch.href 覆制 文件到 components
        return;
       
    }
    path.node.name.name = map[orig] || 'view';
};

const utils = require('../utils/index');

let rword = /[^, ]+/g;
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


module.exports = utils.createNodeName(map, 'div');
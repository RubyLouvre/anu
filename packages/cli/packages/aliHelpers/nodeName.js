
const utils = require('../utils/index');

let rword = /[^, ]+/g;
let builtInStr =
    'view,text,button,block,scroll-view,swiper,swiper-item,movable-area,movable-view,cover-view,icon,rich-text,' +
    'progress,checkbox,form,input,input,label,picker,picker-view,radio,slider,switch,textarea,template,' +
    'navigator,audio,image,camera,video,live-player,live-pusher,map,canvas,open-data,web-view,radio-group,' +
    'slot,wxs,checkbox-group,loading';
let builtIn = {
    favorite: "favorite", //小程序收藏 https://docs.alipay.com/mini/component/component-favorite
    lifestyle: "lifestyle",//支付宝生活号 https://docs.alipay.com/mini/component/lifestyle
};
builtInStr.replace(rword, function(el) {
    builtIn[el] = el;
});


let map = Object.assign({}, builtIn);
'p,div,h1,h2,h3,h4,h5,h6,quoteblock'.replace(rword, function(el) {
    map[el] = 'view';
});
'span,b,s,code,quote,cite'.replace(rword, function(el) {
    map[el] = 'text';
});


module.exports = utils.createNodeName(map, 'view');
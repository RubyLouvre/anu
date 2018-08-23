let rword = /[^, ]+/g;

let builtInStr =
    "view,text,button,block,scroll-view,swiper,swiper-item,movable-area,movable-view,cover-view,icon,rich-text," +
    "progress,checkbox,form,input,input,label,picker,picker-view,radio,slider,switch,textarea,template," +
    "navigator,audio,image,camera,video,live-player,live-pusher,map,canvas,open-data,web-view,radio-group," +
    "slot,wxs,checkbox-group";
let builtIn = {};
builtInStr.replace(rword, function(el) {
    builtIn[el] = el;
});

//兼容小程序自定义组件
function addCustomComponents(customComponents){
    customComponents.forEach(function(el){
        map[el] = el;
    });
}

let map = Object.assign({}, builtIn);
"p,div,h1,h2,h3,h4,h5,h6,quoteblock".replace(rword, function(el) {
    map[el] = "view";
});
"span,b,s,code,quote,cite".replace(rword, function(el) {
    map[el] = "text";
});

module.exports = function mapTagName(path, modules) {
    var orig = path.node.name.name;
    addCustomComponents(modules.customComponents);
    path.node.name.name = map[orig] || "view";
};
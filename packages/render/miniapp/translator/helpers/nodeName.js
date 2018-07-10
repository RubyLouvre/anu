let rword = /[^, ]+/g;

var builtInStr =
  "view,text,button,block,scroll-view,swiper,movable-view,cover-view,icon,rich-text," +
  "progress,checkbox,form,input,input,label,picker,picker-view,radio,slider,switch,textarea,template," +
  "navigator,audio,image,camera,video,live-player,live-pusher,map,canvas,open-data,web-view," +
  "slot,wxs";
var builtIn = {};
builtInStr.replace(rword, function(el) {
  builtIn[el] = el;
});
var map = Object.assign({}, builtIn);
"p,div,h1,h2,h3,h4,h5,h6,quoteblock".replace(rword, function(el) {
  map[el] = "view";
});
"span,b,s,code,quote,cite".replace(rword, function(el) {
  map[el] = "text";
});

module.exports = function mapTagName(path) {
  var orig = path.node.name.name;
  path.node.name.name = map[orig] || "view";
};

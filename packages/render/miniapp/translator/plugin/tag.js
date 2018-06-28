/**
 * 官方所有的组件，官方更新，这里也需要更新：
 * https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
 */

let rword = /[^, ]+/g;

var builtInStr = "view,text,button,scroll-view,swiper,movable-view,cover-view,icon,rich-text,"+
"progress,checkbox,form,input,input,label,picker,picker-view,radio,slider,switch,textarea,"+
"navigator,audio,image,camera,video,live-player,live-pusher,map,canvas,open-data,web-view"+
"slot"
var builtIn = {}
builtInStr.replace(rword, function(el){
  builtIn[el] = el;
})
var map = Object.assign({}, builtIn)
"p,div,h1,h2,h3,h4,h5,h6,quoteblock".replace(rword,function(el){
  map[el] = "view"
});
"span,b,s,code,quote,cite".replace(rword,function(el){
  map[el] = "span"
})


module.exports = {
  builtIn: builtIn,
  map: map
}
let rword = /[^, ]+/g;

let builtInStr =
    'div,list,list-item,popup,refresh,richtext,stack,swiper,tab,tab-bar,tab-context,'+
    'a,span,text,image,progress,rating,'+
    'input,label,option,picker,select,slider,switch,textarea,'+
    'video,canvas,web,map'; 

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
'p,div,h1,h2,h3,h4,h5,h6,quoteblock'.replace(rword, function(el) {
    map[el] = 'view';
});
'span,b,s,code,quote,cite'.replace(rword, function(el) {
    map[el] = 'text';
});

module.exports = function mapTagName(path, modules) {
    var orig = path.node.name.name;
    addCustomComponents(modules.customComponents);
    path.node.name.name = map[orig] || 'view';
};
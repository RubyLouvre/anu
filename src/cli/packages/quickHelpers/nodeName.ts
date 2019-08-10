
import utils from '../utils/index';

let rword = /[^, ]+/g;
let builtInStr =
    'div,list,list-item,popup,refresh,richtext,stack,swiper,tab,tab-bar,tab-context,'+
    'a,text,image,progress,rating,'+
    'input,option,picker,select,slider,switch,textarea,'+
    'video,canvas,web,map'; 
//label行为很怪异
let builtIn: any = {};
builtInStr.replace(rword, function(el) {
    builtIn[el] = el;
    return el;
});


let map = Object.assign({}, builtIn);
'p,div,h1,h2,h3,h4,h5,h6,quoteblock,label'.replace(rword, function(el) {
    map[el] = 'div';
    return el;
});
'span,b,s,code,quote,cite,icon'.replace(rword, function(el) {
    map[el] = 'text';//span不能直接放在div下面
    return el;
});
map.button = 'div';
map['scroll-view'] = 'list';
map['web-view'] = 'web';
module.exports = utils.createNodeName(map, 'div');
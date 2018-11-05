let rword = /[^, ]+/g;
const utils = require('../utils/index');


let builtInStr =
    'div,list,list-item,popup,refresh,richtext,stack,swiper,tab,tab-bar,tab-context,'+
    'a,text,image,progress,rating,'+
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
    map[el] = 'div';
});
'span,b,s,code,quote,cite'.replace(rword, function(el) {
    map[el] = 'text';
});
map.button = 'input';
module.exports = function mapTagName(astPath, modules) {
    var orig = astPath.node.name.name;
    if (orig == 'button' && astPath.node.type === 'JSXOpeningElement'){
        var attrs = astPath.node.attributes;
        for (var i = 0, el; el = attrs[i]; i++){//eslint-disable-line
            if ( el.name.name == 'type' && /^(primary|default|warn)$/.test(el.value.value )){
                attrs.splice(i, 1);
                break;
            }
        }
        astPath.node.attributes.push( utils.createAttribute(
            'fixQuickButtonType',
            'button'
        ));
    }

    addCustomComponents(modules.customComponents);
    astPath.node.name.name = map[orig] || 'div';
};
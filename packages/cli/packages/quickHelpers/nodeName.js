"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../utils/index"));
let rword = /[^, ]+/g;
let builtInStr = 'div,list,list-item,popup,refresh,richtext,stack,swiper,tab,tab-bar,tab-context,' +
    'a,text,image,progress,rating,' +
    'input,option,picker,select,slider,switch,textarea,' +
    'video,canvas,web,map';
let builtIn = {};
builtInStr.replace(rword, function (el) {
    builtIn[el] = el;
    return el;
});
let map = Object.assign({}, builtIn);
'p,div,h1,h2,h3,h4,h5,h6,quoteblock,label'.replace(rword, function (el) {
    map[el] = 'div';
    return el;
});
'span,b,s,code,quote,cite,icon'.replace(rword, function (el) {
    map[el] = 'text';
    return el;
});
map.button = 'div';
map['scroll-view'] = 'list';
map['web-view'] = 'web';
module.exports = index_1.default.createNodeName(map, 'div');

// 过滤快应用中不支持的属性

module.exports = function ignoreAttri(astPath, nodeName) {

    
    if (attributes[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el) {
            let ignoreRule = attributes[nodeName].split(/,\s*/g);
            let attriName = el.name.name.toLowerCase();
            return !ignoreRule.includes(attriName);
        });
    }

};


const attributes = {
    list: 'scroll-y,scroll-x,scroll-into-view,scroll-left',
    'list-item': 'animation',
    text: 'animation,size,content,decode,color,open-type',
    switch: 'color',
    stack: 'animation',
    div: 'animation,hover-class,formtype,type,open-type',
    input: 'placeholder-style,placeholder-class',
    image: 'mode',
    swiper: 'indicator-dots'
};
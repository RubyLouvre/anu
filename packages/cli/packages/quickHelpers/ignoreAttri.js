module.exports = function ignoreAttri(astPath, nodeName) {

    
    if (tag[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el) {
            let ignoreRule = tag[nodeName].split(/,\s*/g);
            let attriName = el.name.name.toLowerCase();
            return !ignoreRule.includes(attriName);
        });
    }

};


const tag = {
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
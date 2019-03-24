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
    list: 'scroll-y,scroll-x,scroll-into-view,scroll-left,lower-threshold,enable-back-to-top,scroll-with-animation',
    'list-item': 'animation',
    text: 'animation,size,content,decode,color,open-type',
    switch: 'color',
    stack: 'animation',
    div: 'animation,hover-class,formtype,type,open-type,src,action,submit',
    input: 'placeholder-style,placeholder-class',
    image: 'mode,width,height,confirm,focus,confirm-type',
    swiper: 'indicator-dots,duration,indicator-active-color,indicator-color,circular',
    video: 'show-center-play-btn,objectfit,show-play-btn,direction',
    textarea: 'placeholder-class,show-confirm-bar,focus,value,cursor-spacing'
};
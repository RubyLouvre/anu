module.exports = function ignoreAttri(astPath, nodeName) {

    
    if (tag[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el) {
            let ignoreRule = tag[nodeName].split(/,\s*/g);
            let attriName = el.name.name;
            return !ignoreRule.includes(attriName);
        });
    }

};


const tag = {
    list: 'scroll-y,scroll-x, scroll-into-view,scroll-left',
    'list-item': 'animation',
    text: 'animation,size,content,decode',
    switch: 'color',
    stack: 'animation',
    div: 'animation',
    input: 'placeholder-style'
};
module.exports = function mapPropName(astPath) {
    var nameNode = astPath.node.name;
    var orig = nameNode.name;
    //百度的事件绑定直接是on/Catch[eventName]
    if (/^catch[A-Z]/.test(orig)) {
        //  nameNode.name = 'catch' + orig.slice(5).toLowerCase();
    } else if (/^on[A-Z]/.test(orig)) {
        //  nameNode.name = 'on' + orig.slice(2).toLowerCase();
    } else {
        if (orig === 'className') {
            nameNode.name = 'class';
        }
    }
};

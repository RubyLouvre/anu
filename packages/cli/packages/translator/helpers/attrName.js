module.exports = function mapPropName(astPath) {
    var nameNode = astPath.node.name;
    var orig = nameNode.name;
    if (/^catch[A-Z]/.test(orig)) {
        nameNode.name = 'catch' + orig.slice(5).toLowerCase();
    } else if (/^on[A-Z]/.test(orig)) {
        if (orig == 'onClick'){
            orig = 'onTap';
        }
        nameNode.name = 'bind' + orig.slice(2).toLowerCase();
    } else {
        if (orig === 'className') {
            nameNode.name = 'class';
        }
    }
};

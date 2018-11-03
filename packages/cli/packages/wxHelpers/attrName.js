module.exports = function mapPropName(astPath) {
    let nameNode = astPath.node.name;
    let orig = nameNode.name;
    if (/^catch[A-Z]/.test(orig)) {
        nameNode.name = 'catch' + orig.slice(5).toLowerCase();
    } else if (/^on[A-Z]/.test(orig)) {
        nameNode.name = 'bind' + orig.slice(2).toLowerCase();
    } else {
        if (orig === 'className') {
            nameNode.name = 'class';
        }
    }
};

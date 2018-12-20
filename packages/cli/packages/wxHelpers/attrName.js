module.exports = function mapPropName(astPath, attrName, parentName) {
    let attrNameNode = astPath.node.name;
    if (parentName == 'canvas' && attrName == 'id'){
        attrNameNode.name = 'canvas-id';
        return;
    }
    if (/^catch[A-Z]/.test(attrName)) {
        attrNameNode.name = 'catch' + attrName.slice(5).toLowerCase();
    } else if (/^on[A-Z]/.test(attrName)) {
        attrNameNode.name = 'bind' + attrName.slice(2).toLowerCase();
    } else {
        if (attrName === 'className') {
            attrNameNode.name = 'class';
        }
    }
};

module.exports = function mapPropName(astPath, attrName) {
    var attrNameNode = astPath.node.name;
    if (attrName === 'className') {
        attrNameNode.name = 'class';
    }
};

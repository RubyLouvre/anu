
module.exports = function mapPropName(astPath: any, attrName: string) {
    var attrNameNode = astPath.node.name;
    if (attrName === 'className') {
        attrNameNode.name = 'class';
    }
};
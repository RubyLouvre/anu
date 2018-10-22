
module.exports = function mapPropName(astPath) {
    var nameNode = astPath.node.name;
    var orig = nameNode.name;

    if (orig === 'className') {
        nameNode.name = 'class';
    }

};
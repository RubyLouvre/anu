
module.exports = function mapPropName(astPath: any, attrName: any, parentName: any) {
    var attrNameNode = astPath.node.name;
  
    if (attrName === 'className') {
        attrNameNode.name = 'class';
    } else if (attrName === 'hidden') {
        attrNameNode.name = 'show';
    }
    if(parentName == 'image' && attrName == 'onLoad'){
        attrNameNode.name = 'onComplete';
    }
};



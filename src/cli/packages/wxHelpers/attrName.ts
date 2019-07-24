import utils from '../utils';

module.exports = function mapPropName(astPath: any, attrName: any, parentName: any) {
    let attrNameNode = astPath.node.name;
    if (parentName === 'canvas' && attrName === 'id'){
        if (!astPath.addCanvas){//这里执行了两次，需要排查
            astPath.addCanvas = true;
            astPath.container.push(
                utils.createAttribute('canvas-id',astPath.node.value )
            );
        }
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

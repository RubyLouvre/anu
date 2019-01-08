function findCurrentUnmaskedContext(fiber) {
    var node = fiber;
    do {
        var stateNode = node.stateNode;
        if (node.containerInfo){
            return fiber.context || {};
        }
        if (stateNode.getChildContext){
            return stateNode._unmaskedContext;
        }
        node = node.return;
    } while (node !== null);
}

export function getContextForSubtree (instance) {
    if (!instance) {
        return {};
    }
    var fiber = instance._internalReactFiber;
    var unmaskedContext = findCurrentUnmaskedContext(fiber);
    var type =  fiber.type;
    var contextTypes = type && type.contextTypes;
    if (contextTypes === Object(contextTypes)) {
        var context = {};
        for (var key in contextTypes){
            if (contextTypes.hasOwnProperty(key)) {
                context[key] = unmaskedContext[key];
            }
        }
        return context;
    }
    return unmaskedContext;
}

function get (instance) {
    return instance._internalReactFiber;
}
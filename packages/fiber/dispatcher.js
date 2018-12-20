import { Renderer } from 'react-core/createRenderer';
function setter(a){      
    Renderer.updateComponent(this, {
        value: a
    });
}
export var dispatcher = {
    useState: function(a){
        var instance = Renderer.currentOwner;
        var fn =  setter.bind(instance);
        var fiber = instance._reactInternalFiber;
        if (fiber && fiber.updateQueue){
            var pendings = fiber.updateQueue.pendingStates;
            var newState = {};
            pendings.forEach(function(el){
                newState.value = el.value;
            });
            fiber.updateQueue.pendingStates = [newState];
            return [newState.value, fn];
        }
        return [a, fn];
    }
};
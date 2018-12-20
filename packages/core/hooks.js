
import { Renderer } from './createRenderer';

function resolveDispatcher(){
    return Renderer.currentOwner.dispatcher;
}

export function useState(initValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initValue);
}
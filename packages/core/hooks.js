
import { dispatcher } from 'react-fiber/dispatcher';

function resolveDispatcher(){
    return dispatcher;
}

export function useState(initValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initValue);
}

import { dispatcher } from 'react-fiber/dispatcher';

export function useState(initValue) {
    return dispatcher.useState(initValue);
}
export function useEffect(initValue) {
    return dispatcher.useEffect(initValue);
}
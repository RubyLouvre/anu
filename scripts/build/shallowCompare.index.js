
import {shallowEqual} from "react-core/shallowEqual";
export default function shallowCompare(instance, nextProps, nextState) {
    var a = shallowEqual(instance.props, nextProps); 
    var b = shallowEqual(instance.state, nextState);
    return !a || !b;
}

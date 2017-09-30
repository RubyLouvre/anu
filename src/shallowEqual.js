var hasOwnProperty = Object.prototype.hasOwnProperty;
import { typeNumber } from "./util";
export function shallowEqual(objA, objB) {
    if (Object.is(objA, objB)) {
        return true;
    }
    //确保objA, objB都是对象
    if (typeNumber(objA) < 7 || typeNumber(objB) < 7) {
        return false;
    }
    let keysA = Object.keys(objA);
    let keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
        if (
            !hasOwnProperty.call(objB, keysA[i]) ||
            !Object.is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false;
        }
    }

    return true;
}
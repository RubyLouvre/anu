// @flow

function bar(x: string): string {
    return x.length;
}
bar('Hello, world!');
var hasBadMapPolyfill: boolean = true;
if (__DEV__) {
    hasBadMapPolyfill = false;
    try {
        const nonExtensibleObject = Object.preventExtensions({});
        const testMap = new Map([[nonExtensibleObject, null]]);
        const testSet = new Set([nonExtensibleObject]);
        // This is necessary for Rollup to not consider these unused.
        // https://github.com/rollup/rollup/issues/1771
        // TODO: we can remove these if Rollup fixes the bug.
        testMap.set(0, 0);
        testSet.add(0);
    } catch (e) {
        // TODO: Consider warning about bad polyfills
        hasBadMapPolyfill = true;
    }
}
export default {
    bar
}
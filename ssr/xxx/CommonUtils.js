export function getArrayByLength(length) {
    const ret = [];
    for (let i = 0; i < length; i++) {
        ret[i] = null;
    }
    return ret;
}

function is(x, y) {
    let ret;
    if (x === y) {
        ret = x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // return x !== x && y !== y;
        ret = isNaN(x) && isNaN(y);
    }

    return ret;
}

// 判断是否为 Function
export function isFunction(it) {
    return Object.prototype.toString.call(it) === '[object Function]';
}

export function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    const hasOwnProperty = Object.prototype.hasOwnProperty;

    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

export function getElementOffsetY(ele, parent) {
    let y = 0;
    while (ele !== parent && ele !== null) {
        y += ele.offsetTop;
        ele = ele.offsetParent;
    }
    return y;
}

export const DELAY_TIME_FOR_INFINITE_WITHOUT_HEIGHT = 250;

export function inheritProps(props, attrs) {
    return attrs.reduce((ret, attr) => {
        ret[attr] = props[attr];
        return ret;
    }, {});
}

/**
 * @method getOnlyChild
 * @return vnode|false
 * @description 判断虚拟节点是否只拥有一个子节点，取代针对原生 React 的 !children.length，以支持 Qreact
 * In React : vnode.children = {xxx}
 * In Qreact: vnode.children = [{xxx}]
 */
export function getOnlyChild(props) {
    const children = props.children;
    if (children) {
        // for React
        if (!children.length) return children;
        // for Qreact
        if (children.length === 1) return children[0];
    }
    return false;
}
/*
    This should find all Android browsers lower than build 535.19 (both stock browser and webview)
    - galaxy S2 is ok
    - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
    - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S3 is badAndroid (stock brower, webview)
    `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S4 is badAndroid (stock brower, webview)
    `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
    - galaxy S5 is OK
    `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
    - galaxy S6 is OK
    `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
    */
export function isBadAndroid() {
    const appVersion = window.navigator.appVersion;
    let _isBadAndroid = false;
    // Android browser is not a chrome browser.
    if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
        const safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
        if (safariVersion && typeof safariVersion === 'object' && safariVersion.length >= 2) {
            _isBadAndroid = parseFloat(safariVersion[1]) < 535.19;
        } else {
            _isBadAndroid = true;
        }
    } else {
        _isBadAndroid = false;
    }

    return _isBadAndroid;
}

export function getRAF() {
    function basicRAF(callback) {
        return window.setTimeout(callback, 1000 / 60);
    }

    let rAF = window.cancelAnimationFrame && window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame && window.webkitRequestAnimationFrame ||
        window.mozCancelAnimationFrame && window.mozRequestAnimationFrame ||
        window.oCancelAnimationFrame && window.oRequestAnimationFrame ||
        window.msCancelAnimationFrame && window.msRequestAnimationFrame ||
        basicRAF;

    let cancelrAF = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.clearTimeout;

    if (isBadAndroid()) {
        rAF = basicRAF;
        cancelrAF = window.clearTimeout;
    }

    return { rAF, cancelrAF };
}

export function whichTransitionEventPrefix() {
    let result;
    const el = document.createElement('fakeelement');
    const transitions = {
        transition: 'transition',
        WebkitTransition: 'webkitTransition'
    };
    Object.keys(transitions).some(t => {
        if (el.style[t] !== undefined) {
            result = transitions[t];
            return true;
        }
        return false;
    });
    return result;
}
const utils = (() => {
    const me = {};
    const _elementStyle = document.createElement('div').style;

    const _vendor = (() => {
        const vendors = ['t', 'WebkitT', 'MozT', 'msT', 'OT'];
        let transform;

        for (let i = 0, l = vendors.length; i < l; i++) {
            transform = `${vendors[i]}ransform`;
            if (transform in _elementStyle) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })();

    const _prefixStyle = (style) => {
        if (_vendor === false) {
            return false;
        }
        if (_vendor === '') {
            return style;
        }
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    };

    me.getTime = Date.now || function getTime() {
        return new Date().getTime();
    };

    me.getRAF = () => {
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

        if (me.isBadAndroid) {
            rAF = basicRAF;
            cancelrAF = window.clearTimeout;
        }

        return { rAF, cancelrAF };
    };

    me.extend = (target, obj) => {
        Object.keys(obj).forEach((i) => {
            target[i] = obj[i];
        });
    };

    me.momentum = (current, start, time, lowerMargin, wrapperSize, deceleration) => {
        let distance = current - start,
            destination,
            duration;
        const speed = Math.abs(distance) / time;

        deceleration = deceleration === undefined ? 0.0015 : deceleration;

        destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }

        return {
            destination: Math.round(destination),
            duration
        };
    };

    const _transform = _prefixStyle('transform');

    me.extend(me, {
        hasTransform: _transform !== false,
        hasPerspective: _prefixStyle('perspective') in _elementStyle,
        hasTouch: 'ontouchstart' in window,
        hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
        hasTransition: _prefixStyle('transition') in _elementStyle
    });

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
    me.isBadAndroid = (() => {
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
    })();

    me.extend(me.style = {}, {
        transform: _transform,
        transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
        transitionDuration: _prefixStyle('transitionDuration'),
        transitionDelay: _prefixStyle('transitionDelay'),
        transformOrigin: _prefixStyle('transformOrigin')
    });

    me.preventDefaultException = (el, exceptions) => {
        const keys = Object.keys(exceptions);

        for (let i = 0, len = keys.length; i < len; i++) {
            const attr = keys[i];
            if (exceptions[attr].test(el[attr])) {
                return true;
            }
        }

        return false;
    };

    me.extend(me.eventType = {}, {
        touchstart: 1,
        touchmove: 1,
        touchend: 1

        // mousedown: 2,
        // mousemove: 2,
        // mouseup: 2,
        //
        // pointerdown: 3,
        // pointermove: 3,
        // pointerup: 3,
        //
        // MSPointerDown: 3,
        // MSPointerMove: 3,
        // MSPointerUp: 3
    });

    me.extend(me.ease = {}, {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: (k) => k * (2 - k)
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: (k) => {
                const _k = k - 1;
                return Math.sqrt(1 - (_k * _k));
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: (k) => {
                const b = 4;
                const _k = k - 1;
                return _k * _k * ((b + 1) * _k + b) + 1;
            }
        },
        bounce: {
            style: '',
            fn: (k) => {
                let y,
                    _k = k;

                if ((_k / 1) < (1 / 2.75)) {
                    _k = _k / 1;
                    y = 7.5625 * _k * _k;
                } else if (k < (2 / 2.75)) {
                    _k -= (1.5 / 2.75);
                    y = 7.5625 * _k * _k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    _k -= (2.25 / 2.75);
                    y = 7.5625 * _k * _k + 0.9375;
                } else {
                    _k -= (2.625 / 2.75);
                    y = 7.5625 * _k * _k + 0.984375;
                }

                return y;
            }
        },
        elastic: {
            style: '',
            fn: (k) => {
                const f = 0.22,
                    e = 0.4;

                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }

                return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
            }
        }
    });

    return me;
})();

export default utils;
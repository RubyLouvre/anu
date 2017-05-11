;
(function () {
    function archy(obj, prefix, opts) {
        if (prefix === undefined) prefix = '';
        if (!opts) opts = {};
        var chr = function (s) {
            var chars = {
                '│': '|',
                '└': '`',
                '├': '+',
                '─': '-',
                '┬': '-'
            };
            return opts.unicode === false ? chars[s] : s;
        };

        if (typeof obj === 'string') obj = {
            label: obj
        };

        var nodes = obj.nodes || [];
        var lines = (obj.label || '').split('\n');
        var splitter = '\n' + prefix + (nodes.length ? chr('│') : ' ') + ' ';

        return prefix +
            lines.join(splitter) + '\n' +
            nodes.map(function (node, ix) {
                var last = ix === nodes.length - 1;
                var more = node.nodes && node.nodes.length;
                var prefix_ = prefix + (last ? ' ' : chr('│')) + ' ';

                return prefix +
                    (last ? chr('└') : chr('├')) + chr('─') +
                    (more ? chr('┬') : chr('─')) + ' ' +
                    archy(node, prefix_, opts).slice(prefix.length + 2);
            }).join('');
    };

    function toString(obj) {
        return Object.prototype.toString.call(obj);
    }

    function isFunction(obj) {
        return toString(obj) === '[object Function]';
    }

    function isString(obj) {
        return toString(obj) === '[object String]';
    }

    function isObject(obj) {
        return obj && toString(obj) === '[object Object]';
    }

    function isBoolean(obj) {
        return toString(obj) === '[object Boolean]';
    }

    function isNumber(obj) {
        return toString(obj) === '[object Number]';
    }

    function isSymbol(obj) {
        return toString(obj) === '[object Symbol]';
    }

    function getTypeName(obj) {
        var type = toString(obj).replace('[object ', '').replace(']', '');
        if (type === 'Function') {
            return '[Function ' + obj.name + ']';
        }
        return type;
    }

    // Source: isaacs's core-util-is library
    function isPrimitive(arg) {
        return arg === null ||
            typeof arg === 'boolean' ||
            typeof arg === 'number' ||
            typeof arg === 'string' ||
            typeof arg === 'symbol' ||
            arg === undefined;
    }

    function isInteger(obj) {
        if (Number.isInteger) {
            return Number.isInteger(obj);
        }

        return isNumber(obj) &&
            isFinite(obj) &&
            Math.floor(obj) === obj;
    }

    function simpleClone(obj, target) {
        var keys,
            i;

        if (!isObject(obj)) {
            throw new TypeError('Object to be cloned must be an Object');
        }

        target = target || {};
        keys = Object.keys(obj);
        i = keys.length;

        while (i--) {
            target[keys[i]] = obj[keys[i]];
        }

        return target;
    }

    var hasSymbolsSupport = true;

    try {
        hasSymbolsSupport = typeof Symbol === 'function';
    } catch (ex) {
        hasSymbolsSupport = false;
    }




    function format(obj) {
        if (hasSymbolsSupport && isSymbol(obj)) {
            return obj.toString();
        }

        if (isPrimitive(obj)) {
            return isString(obj) ? '"' + obj + '"' : String(obj);
        }

        return getTypeName(obj);
    }

    var hasArrowFunctions = true;

    try {
        (new Function('() => 1'))();
    } catch (ex) {
        hasArrowFunctions = false;
    }

    function deepInspect(obj, options, cLevel, pLevel, isParent) {
        var parent = (isParent ? "[[Parent]] : " : "");

        if (isPrimitive(obj) || cLevel === options.depth ||
            pLevel === options.parentChainLevel) {
            return parent + format(obj);
        }

        var keys;

        if (options.showHidden) {
            keys = Object.getOwnPropertyNames(obj);
            if (hasSymbolsSupport) {
                keys = keys.concat(Object.getOwnPropertySymbols(obj));
            }
        } else {
            keys = Object.keys(obj);
        }

        if (keys.length === 0 && !options.parentChainLevel) {
            if (isObject(obj)) {
                return '{}\n';
            }
            if (Array.isArray(obj)) {
                return '[]\n';
            }
            if (isFunction(obj)) {
                return '[Function "' + (obj.name || 'Anonymous') + '"]\n';
            }
            return parent + toString(obj) + '\n';
        }

        var result = {};
        result.label = parent + getTypeName(obj);
        result.nodes = [];

        if (options.parentChainLevel) {
            result.nodes.push(deepInspect(Object.getPrototypeOf(obj),
                options, 0, pLevel + 1, true));
        }

        var indexRE = /^["]?\d+["]?$/;

        result.nodes = result.nodes.concat(keys.map(function (key) {
            var fKey = format(key);
            var title = Array.isArray(obj) && indexRE.test(fKey) ? 'Index: ' :
                'Key: ';
            var value;
            try {
                value = obj[key];
            } catch (ex) {
                value = ex.message;
            }
            return {
                label: title + fKey,
                nodes: [deepInspect(value, options, cLevel + 1, pLevel)]
            };
        }));

        return result;
    }

    window.inspect = function inspect(obj, options) {
        options = simpleClone(options || {});

        options.showHidden = options.showHidden || false;

        if (!isBoolean(options.showHidden)) {
            throw new TypeError('showHidden property must be a boolean');
        }

        options.depth = options.depth || 1;

        if (!isInteger(options.depth) || options.depth <= 0) {
            throw new TypeError(
                'depth property must be a positive, non-zero integer');
        }

        if (options.parentChainLevel !== undefined) {
            if (!isInteger(options.parentChainLevel) ||
                options.parentChainLevel <= 0) {
                throw new TypeError(
                    'parentChainLevel property must be a positive, non-zero integer');
            }
        }

        var result = deepInspect(obj, options, 0, 0);

        if (isPrimitive(result)) {
            console.log(result);
        } else {
            console.log(archy(result));
        }
    }

})()
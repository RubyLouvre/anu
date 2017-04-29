var lifecycle = {
    '-2': 'getDefaultProps',
    '-1': 'getInitialState',
    '0': 'componentWillMount',
    '1': 'render',
    '2': 'componentDidMount',
    '3': 'componentWillReceiveProps',
    '4': 'shouldComponentUpdate',
    '5': 'componentWillUpdate',
    '6': 'componentDidUpdate',
    '7': 'componentWillUnmount'
}

/**
 * 
 * 
 * @export
 * @param {Component} instance 
 * @param {number} index 
 * @returns 
 */
export function applyComponentHook(instance, index) {
    if (instance) {
        var method = lifecycle[index]
        if (instance[method]) {
            return instance[method].apply(instance, [].slice.call(arguments, 2))
        }
    }
}
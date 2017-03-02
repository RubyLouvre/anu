var componentHooks = {
    '0': 'componentWillMount',
    '1': 'componentDidMount',
    '2': 'componentWillReceiveProps',
    '3': 'shouldComponentUpdate', //componentShouldUpdate
    '4': 'componentWillUpdate',
    '5': 'componentDidUpdate',
    '6': 'componentWillUnmount',
    '-2': 'getDefaultProps',
    '-1': 'getInitialState'
}

export default function applyComponentHook(el, index) {
    var hook = componentHooks[index]
    if (el && el[hook]) {
        return el[hook].apply(el, Array.prototype.slice.call(arguments, 2))
    }
}

/**
 * ------------------ The Life-Cycle of a Composite Component ------------------
 *
 * - constructor: Initialization of state. The instance is now retained.
 *   - componentWillMount
 *   - render
 *   - [children's constructors]
 *     - [children's componentWillMount and render]
 *     - [children's componentDidMount]
 *     - componentDidMount
 *
 *       Update Phases:
 *       - componentWillReceiveProps (only called if parent updated)
 *       - shouldComponentUpdate
 *         - componentWillUpdate
 *           - render
 *           - [children's constructors or receive props phases]
 *         - componentDidUpdate
 *
 *     - componentWillUnmount
 *     - [children's componentWillUnmount]
 *   - [children destroyed]
 * - (destroyed): The instance is now blank, released by React and ready for GC.
 *
 * -----------------------------------------------------------------------------
 */
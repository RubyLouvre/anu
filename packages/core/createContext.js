import { inherit } from "./util";
import { Component } from "./Component";
import { PropTypes } from "./PropTypes";

let uuid = 1;
function gud() {
    return uuid++;
}

const MAX_NUMBER = 1073741823;

function createEventEmitter(value) {
    let handlers = [];
    return {
        on(handler) {
            handlers.push(handler);
        },

        off(handler) {
            handlers = handlers.filter(h => h !== handler);
        },

        get() {
            return value;
        },

        set(newValue, changedBits) {
            value = newValue;
            handlers.forEach(handler => handler(value, changedBits));
        }
    };
}

export function createContext(defaultValue, calculateChangedBits) {
    const contextProp = "__create-react-context-" + gud() + "__";
    function Provider(props, context) {
        Component.call(this, props, context);
        this.emitter = createEventEmitter(props.value);
    }
    Provider.childContextTypes = {
        [contextProp]: PropTypes.object.isRequired
    };
    let fn = inherit(Provider, Component);
    fn.getChildContext = function () {
        return {
            [contextProp]: this.emitter
        };
    };
    fn.componentWillReceiveProps = function (nextProps) {
        if (this.props.value !== nextProps.value) {
            let oldValue = this.props.value;
            let newValue = nextProps.value;
            let changedBits;
            if (Object.is(oldValue, newValue)) {
                changedBits = 0; // No change
            } else {
                changedBits =
                    typeof calculateChangedBits === "function"
                        ? calculateChangedBits(oldValue, newValue)
                        : MAX_NUMBER;

                changedBits |= 0;

                if (changedBits !== 0) {
                    this.emitter.set(nextProps.value, changedBits);
                }
            }
        }
    };
    fn.render = function () {
        return this.props.children;
    };
    function Consumer(props, context) {
        Component.call(this, props, context);

        this.observedBits = 0;
        this.state = {
            value: this.getValue()
        };
        this.onUpdate = (newValue, changedBits) => {
            const observedBits = this.observedBits | 0;
            if ((observedBits & changedBits) !== 0) {
                this.setState({ value: this.getValue() });
            }
        };
    }
    Consumer.contextTypes = {
        [contextProp]: PropTypes.object
    };
    let fn2 = inherit(Consumer, Component);
    fn2.componentWillReceiveProps = function (nextProps) {
        let { observedBits } = nextProps;
        this.observedBits =
            observedBits === undefined || observedBits === null
                ? MAX_NUMBER // Subscribe to all changes by default
                : observedBits;
    };
    fn2.getValue = function () {
        if (this.context[contextProp]) {
            return this.context[contextProp].get();
        } else {
            return defaultValue;
        }
    };

    fn2.componentDidMount = function () {
        if (this.context[contextProp]) {
            this.context[contextProp].on(this.onUpdate);
        }
        let { observedBits } = this.props;
        this.observedBits =
            observedBits === undefined || observedBits === null
                ? MAX_NUMBER // Subscribe to all changes by default
                : observedBits;
    };

    fn2.componentWillUnmount = function () {
        if (this.context[contextProp]) {
            this.context[contextProp].off(this.onUpdate);
        }
    };


    fn2.render = function () {
        return this.props.children(this.state.value);
    };
    return {
        Provider,
        Consumer
    };
}



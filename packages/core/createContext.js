import {
    miniCreateClass,
    isFn
} from "./util";
import {
    Component
} from "./Component";
import {
    PropTypes
} from "./PropTypes";

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

    function create(obj, value) {
        obj[contextProp] = value;
        return obj;
    }
    let Provider = miniCreateClass(
        function Provider(props, b, c) {
            this.emitter = createEventEmitter(props.value);
            c.childContextTypes = create({}, PropTypes.object.isRequired);
        },
        Component, {
            getChildContext() {
                return create({}, this.emitter);
            },
            UNSAFE_componentWillReceiveProps(nextProps) {
                if (this.props.value !== nextProps.value) {
                    let oldValue = this.props.value;
                    let newValue = nextProps.value;
                    let changedBits;
                    if (Object.is(oldValue, newValue)) {
                        changedBits = 0; // No change
                    } else {
                        changedBits = isFn(calculateChangedBits) ?
                            calculateChangedBits(oldValue, newValue) :
                            MAX_NUMBER;

                        changedBits |= 0;

                        if (changedBits !== 0) {
                            this.emitter.set(nextProps.value, changedBits);
                        }
                    }
                }
            },
            render() {
                return this.props.children;
            }
        });

    let Consumer = miniCreateClass(
        function Consumer(a, b, c) {
            this.observedBits = 0;
            this.state = {
                value: this.getValue()
            };
            this.onUpdate = (newValue, changedBits) => {
                const observedBits = this.observedBits | 0;
                if ((observedBits & changedBits) !== 0) {
                    this.setState({
                        value: this.getValue()
                    });
                }
            };
            c.contextTypes = create({}, PropTypes.object);
        },
        Component, {
            UNSAFE_componentWillReceiveProps(nextProps) {
                let {
                    observedBits
                } = nextProps;
                this.observedBits = observedBits == null ?
                    MAX_NUMBER :
                    observedBits;
            },
            getValue() {
                if (this.context[contextProp]) {
                    return this.context[contextProp].get();
                } else {
                    return defaultValue;
                }
            },
            componentDidMount() {
                if (this.context[contextProp]) {
                    this.context[contextProp].on(this.onUpdate);
                }
                let {
                    observedBits
                } = this.props;
                // Subscribe to all changes by default
                this.observedBits = observedBits == null ?
                    MAX_NUMBER : observedBits;
            },
            componentWillUnmount() {
                if (this.context[contextProp]) {
                    this.context[contextProp].off(this.onUpdate);
                }
            },
            render() {
                return this.props.children(this.state.value);
            }
        }
    );

    return {
        Provider,
        Consumer
    };
}
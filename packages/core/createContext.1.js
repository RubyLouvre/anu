import { miniCreateClass, isFn } from './util';
import { Component } from './Component';


const MAX_NUMBER = 1073741823;
export function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits == void 0) {
        calculateChangedBits = null;
    }
    var providerInstance = {
        value: defaultValue,
        list: []
    };
    var Provider = miniCreateClass(function Provider(props) {
        if (props === void 0) {
            return providerInstance.value;
        }
        this.value = props.value;
        this.constructor.list = this.list = [];
        providerInstance = this;
    }, Component, {
        componentWillUnmount: function componentWillUnmount() {
            this.list.length = 0;
        },
        UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                var oldValue = this.props.value;
                var newValue = nextProps.value;
                var changedBits = void 0;
                if (Object.is(oldValue, newValue)) {
                    changedBits = 0;
                } else {
                    this.value = newValue;
                    changedBits = isFn(calculateChangedBits) ? calculateChangedBits(oldValue, newValue) : MAX_NUMBER;
                    changedBits |= 0;
                    if (changedBits !== 0) {
                        providerInstance.list.forEach(function (instance) {
                            instance.setState({
                                value: newValue
                            });
                            instance.forceUpdate()
                        });
                    }
                }
            }
        },
        render: function render() {
            return this.props.children;
        }
    });
    var Consumer = miniCreateClass(function Consumer() {
        providerInstance.list.push(this);
        this.observedBits = 0;
        this.state = {
            value: providerInstance.value
        };
    }, Component, {
        componentWillUnmount: function componentWillUnmount() {
            var i = providerInstance.list.indexOf(this);
            providerInstance.list.splice(i, 1);
        },
        render: function render() {
            return this.props.children(this.state.value);
        }
    });
    Provider.Provider = Provider;
    Provider.Consumer = Consumer;
    return Provider;
}

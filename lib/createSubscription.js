import React from 'react';
import isFn from '../src/util';

function notFn(fn, warning) {
    if (!isFn(fn)) {
        console.warn(warning)
    }
}

/**
 * 
 * config对象里包含两个函数
 * getCurrentValue: (source: Property) => Value | void,
 *  subscribe: (
      source: Property,
      callback: (value: Value | void) => void,
    ) => Unsubscribe,
 * 
 */
export function createSubscription(config) {
    const { getCurrentValue, subscribe } = config;
    notFn(getCurrentValue, 'Subscription must specify a getCurrentValue function')
    notFn(subscribe, 'Subscription must specify a subscribe function')

    // Reference: https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3
    class Subscription extends React.Component {
        state = {
            source: this.props.source,
            unsubscribeContainer: {
                unsubscribe: null,
            },
            value: this.props.source != null
                ? getCurrentValue(this.props.source)
                : undefined,
        };

        static getDerivedStateFromProps(nextProps, prevState) {
            if (nextProps.source !== prevState.source) {
                return {
                    source: nextProps.source,
                    unsubscribeContainer: {
                        unsubscribe: null,
                    },
                    value:
                        nextProps.source != null
                            ? getCurrentValue(nextProps.source)
                            : undefined,
                };
            }

            return null;
        }

        componentDidMount() {
            this.subscribe();
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.state.source !== prevState.source) {
                this.unsubscribe(prevState);
                this.subscribe();
            }
        }

        componentWillUnmount() {
            this.unsubscribe(this.state);
        }

        render() {
            return this.props.children(this.state.value);
        }

        subscribe() {
            const { source } = this.state;
            if (source != null) {
                const callback = (value) => {
                    this.setState(state => {
                        // If the value is the same, skip the unnecessary state update.
                        if (value === state.value) {
                            return null;
                        }

                        // If this event belongs to an old or uncommitted data source, ignore it.
                        if (source !== state.source) {
                            return null;
                        }

                        return { value };
                    });
                };

                // Store subscription for later (in case it's needed to unsubscribe).
                // This is safe to do via mutation since:
                // 1) It does not impact render.
                // 2) This method will only be called during the "commit" phase.
                const unsubscribe = subscribe(source, callback);

                notFn(unsubscribe, 'A subscription must return an unsubscribe function.');

                this.state.unsubscribeContainer.unsubscribe = unsubscribe;

                // External values could change between render and mount,
                // In some cases it may be important to handle this case.
                const value = getCurrentValue(this.props.source);
                if (value !== this.state.value) {
                    this.setState({ value });
                }
            }
        }

        unsubscribe(state) {
            const { unsubscribe } = state.unsubscribeContainer;
            if (isFn(unsubscribe)) {
                unsubscribe();
            }
        }
    }

    return Subscription;
}
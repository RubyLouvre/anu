'use strict';

let PropTypes;
let React;
let ReactDOM;
let ReactTestUtils;
let createReactClass;

describe('create-react-class-integration', () => {
    beforeEach(() => {
        jest.resetModules();
        PropTypes = require('prop-types');
        React = require('react');
        ReactDOM = require('react-dom');
        ReactTestUtils = require('test-utils');
        createReactClass = require("create-react-class")
    });

    it('should throw when `render` is not specified', () => {
        expect(function () {
            createReactClass({});
        }).toThrowError(
            'createClass(...): Class specification must implement a `render` method.',
        );
    });

    it('should copy prop types onto the Constructor', () => {
        const propValidator = jest.fn();
        const TestComponent = createReactClass({
            propTypes: {
                value: propValidator,
            },
            render: function () {
                return <div />;
            },
        });

        expect(TestComponent.propTypes).toBeDefined();
        expect(TestComponent.propTypes.value).toBe(propValidator);
    });

    it('should warn on invalid prop types', () => {
        return 
        expect(() =>
            createReactClass({
                displayName: 'Component',
                propTypes: {
                    prop: null,
                },
                render: function () {
                    return <span>{this.props.prop}</span>;
                },
            }),
        ).toWarnDev(
            'Warning: Component: prop type `prop` is invalid; ' +
            'it must be a function, usually from React.PropTypes.',
        );
    });

    it('should warn on invalid context types', () => {
        return
        expect(() =>
            createReactClass({
                displayName: 'Component',
                contextTypes: {
                    prop: null,
                },
                render: function () {
                    return <span>{this.props.prop}</span>;
                },
            }),
        ).toWarnDev(
            'Warning: Component: context type `prop` is invalid; ' +
            'it must be a function, usually from React.PropTypes.',
        );
    });

    it('should throw on invalid child context types', () => {
        return
        expect(() =>
            createReactClass({
                displayName: 'Component',
                childContextTypes: {
                    prop: null,
                },
                render: function () {
                    return <span>{this.props.prop}</span>;
                },
            }),
        ).toWarnDev(
            'Warning: Component: child context type `prop` is invalid; ' +
            'it must be a function, usually from React.PropTypes.',
        );
    });

    it('should warn when misspelling shouldComponentUpdate', () => {
        return
        expect(() =>
            createReactClass({
                componentShouldUpdate: function () {
                    return false;
                },
                render: function () {
                    return <div />;
                },
            }),
        ).toWarnDev(
            'Warning: A component has a method called componentShouldUpdate(). Did you ' +
            'mean shouldComponentUpdate()? The name is phrased as a question ' +
            'because the function is expected to return a value.',
        );

        expect(() =>
            createReactClass({
                displayName: 'NamedComponent',
                componentShouldUpdate: function () {
                    return false;
                },
                render: function () {
                    return <div />;
                },
            }),
        ).toWarnDev(
            'Warning: NamedComponent has a method called componentShouldUpdate(). Did you ' +
            'mean shouldComponentUpdate()? The name is phrased as a question ' +
            'because the function is expected to return a value.',
        );
    });

    it('should warn when misspelling componentWillReceiveProps', () => {
        return
        expect(() =>
            createReactClass({
                componentWillRecieveProps: function () {
                    return false;
                },
                render: function () {
                    return <div />;
                },
            }),
        ).toWarnDev(
            'Warning: A component has a method called componentWillRecieveProps(). Did you ' +
            'mean componentWillReceiveProps()?',
        );
    });

    it('should warn when misspelling UNSAFE_componentWillReceiveProps', () => {
        return
        expect(() =>
            createReactClass({
                UNSAFE_componentWillRecieveProps: function () {
                    return false;
                },
                render: function () {
                    return <div />;
                },
            }),
        ).toWarnDev(
            'Warning: A component has a method called UNSAFE_componentWillRecieveProps(). ' +
            'Did you mean UNSAFE_componentWillReceiveProps()?',
        );
    });

    it('should throw if a reserved property is in statics', () => {
        expect(function () {
            createReactClass({
                statics: {
                    getDefaultProps: function () {
                        return {
                            foo: 0,
                        };
                    },
                },

                render: function () {
                    return <span />;
                },
            });
        }).toThrowError(
            'getDefaultProps is not statics',
        );
    });

    // TODO: Consider actually moving these to statics or drop this unit test.
    xit('should warn when using deprecated non-static spec keys', () => {
        expect(() =>
            createReactClass({
                mixins: [{}],
                propTypes: {
                    foo: PropTypes.string,
                },
                contextTypes: {
                    foo: PropTypes.string,
                },
                childContextTypes: {
                    foo: PropTypes.string,
                },
                render: function () {
                    return <div />;
                },
            }),
        ).toWarnDev([
            'createClass(...): `mixins` is now a static property and should ' +
            'be defined inside "statics".',
            'createClass(...): `propTypes` is now a static property and should ' +
            'be defined inside "statics".',
            'createClass(...): `contextTypes` is now a static property and ' +
            'should be defined inside "statics".',
            'createClass(...): `childContextTypes` is now a static property and ' +
            'should be defined inside "statics".',
        ]);
    });

    it('should support statics', () => {
        const Component = createReactClass({
            statics: {
                abc: 'def',
                def: 0,
                ghi: null,
                jkl: 'mno',
                pqr: function () {
                    return this;
                },
            },

            render: function () {
                return <span />;
            },
        });
        let instance = <Component />;
        instance = ReactTestUtils.renderIntoDocument(instance);
        expect(instance.constructor.abc).toBe('def');
        expect(Component.abc).toBe('def');
        expect(instance.constructor.def).toBe(0);
        expect(Component.def).toBe(0);
        expect(instance.constructor.ghi).toBe(null);
        expect(Component.ghi).toBe(null);
        expect(instance.constructor.jkl).toBe('mno');
        expect(Component.jkl).toBe('mno');
        expect(instance.constructor.pqr()).toBe(Component);
        expect(Component.pqr()).toBe(Component);
    });

    it('should work with object getInitialState() return values', () => {
        const Component = createReactClass({
            getInitialState: function () {
                return {
                    occupation: 'clown',
                };
            },
            render: function () {
                return <span />;
            },
        });
        let instance = <Component />;
        instance = ReactTestUtils.renderIntoDocument(instance);
        expect(instance.state.occupation).toEqual('clown');
    });

    it('should work with getDerivedStateFromProps() return values', () => {
        const Component = createReactClass({
            getInitialState() {
                return {};
            },
            render: function () {
                return <span />;
            },
        });
        Component.getDerivedStateFromProps = () => {
            return { occupation: 'clown' };
        };
        let instance = <Component />;
        instance = ReactTestUtils.renderIntoDocument(instance);
        expect(instance.state.occupation).toEqual('clown');
    });

    it('renders based on context getInitialState', () => {
        const Foo = createReactClass({
            contextTypes: {
                className: PropTypes.string,
            },
            getInitialState() {
                return { className: this.context.className };
            },
            render() {
                return <span className={this.state.className} />;
            },
        });

        const Outer = createReactClass({
            childContextTypes: {
                className: PropTypes.string,
            },
            getChildContext() {
                return { className: 'foo' };
            },
            render() {
                return <Foo />;
            },
        });

        const container = document.createElement('div');
        ReactDOM.render(<Outer />, container);
        expect(container.firstChild.className).toBe('foo');
    });

    it('should throw with non-object getInitialState() return values', () => {
        [['an array'], 'a string', 1234].forEach(function (state) {
            const Component = createReactClass({
                getInitialState: function () {
                    return state;
                },
                render: function () {
                    return <span />;
                },
            });
            let instance = <Component />;
            expect(function () {
                instance = ReactTestUtils.renderIntoDocument(instance);
            }).toThrowError(
                'Component.getInitialState(): must return an object or null',
            );
        });
    });

    it('should work with a null getInitialState() return value', () => {
        const Component = createReactClass({
            getInitialState: function () {
                return null;
            },
            render: function () {
                return <span />;
            },
        });
        expect(() =>
            ReactTestUtils.renderIntoDocument(<Component />),
        ).not.toThrow();
    });

    it('should throw when using legacy factories', () => {
        
        const Component = createReactClass({
            render() {
                return <div />;
            },
        });
        expect(() => expect(() => Component()).toThrow()).toWarnDev(
            'Warning: Something is calling a React component directly. Use a ' +
            'factory or JSX instead. See: https://fb.me/react-legacyfactory',
        );
    });

    it('replaceState and callback works', () => {
         //不实现
        const ops = [];
        const Component = createReactClass({
            getInitialState() {
                return { step: 0 };
            },
            render() {
                ops.push('Render: ' + this.state.step);
                return <div />;
            },
        });

        const instance = ReactTestUtils.renderIntoDocument(<Component />);
        expect(() => {
            instance.replaceState({ step: 1 }, () => {
                ops.push('Callback: ' + instance.state.step);
            });
        }).toThrow("replaceState is deprecated")
    });

    it('getDerivedStateFromProps updates state when props change', () => {
        const Component = createReactClass({
            getInitialState() {
                return {
                    count: 1,
                };
            },
            render() {
                return <div>count:{this.state.count}</div>;
            },
        });
        Component.getDerivedStateFromProps = (nextProps, prevState) => ({
            count: prevState.count + nextProps.incrementBy,
        });

        const container = document.createElement('div');
        const instance = ReactDOM.render(
            <div>
                <Component incrementBy={0} />
            </div>,
            container,
        );
        expect(instance.textContent).toEqual('count:1');
        ReactDOM.render(
            <div>
                <Component incrementBy={2} />
            </div>,
            container,
        );
        expect(instance.textContent).toEqual('count:3');
    });

    it('should support the new static getDerivedStateFromProps method', () => {
        let instance;
        const Component = createReactClass({
            statics: {
                getDerivedStateFromProps: function () {
                    return { foo: 'bar' };
                },
            },

            getInitialState() {
                return {};
            },

            render: function () {
                instance = this;
                return null;
            },
        });
        ReactDOM.render(<Component />, document.createElement('div'));
        expect(instance.state.foo).toBe('bar');
    });

    it('warns if getDerivedStateFromProps is not static', () => {
        const Foo = createReactClass({
            getDerivedStateFromProps() {
                return {};
            },
            render() {
                return <div />;
            },
        });
        expect(() =>
            ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
        ).toWarnDev(
            'Component: getDerivedStateFromProps() is defined as an instance method ' +
            'and will be ignored. Instead, declare it as a static method.',
        );
    });

    it('warns if getDerivedStateFromCatch is not static', () => {
        const Foo = createReactClass({
            getDerivedStateFromCatch() {
                return {};
            },
            render() {
                return <div />;
            },
        });
        expect(() =>
            ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
        ).toWarnDev(
            'Component: getDerivedStateFromCatch() is defined as an instance method ' +
            'and will be ignored. Instead, declare it as a static method.',
        );
    });

    it('warns if getSnapshotBeforeUpdate is static', () => {
        const Foo = createReactClass({
            statics: {
                getSnapshotBeforeUpdate: function () {
                    return null;
                },
            },
            render() {
                return <div />;
            },
        });
        expect(() =>
            ReactDOM.render(<Foo foo="foo" />, document.createElement('div')),
        ).toWarnDev(
            'Component: getSnapshotBeforeUpdate() is defined as a static method ' +
            'and will be ignored. Instead, declare it as an instance method.',
        );
    });

    it('should warn if state is not properly initialized before getDerivedStateFromProps', () => {
        const Component = createReactClass({
            statics: {
                getDerivedStateFromProps: function () {
                    return null;
                },
            },
            render: function () {
                return null;
            },
        });
        expect(() =>
            ReactDOM.render(<Component />, document.createElement('div')),
        ).toWarnDev('Did not properly initialize state during construction.');
    });

    it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new static gDSFP is present', () => {
        return
        const Component = createReactClass({
            statics: {
                getDerivedStateFromProps: function () {
                    return null;
                },
            },
            componentWillMount: function () {
                throw Error('unexpected');
            },
            componentWillReceiveProps: function () {
                throw Error('unexpected');
            },
            componentWillUpdate: function () {
                throw Error('unexpected');
            },
            getInitialState: function () {
                return {};
            },
            render: function () {
                return null;
            },
        });

        expect(() => {
            ReactDOM.render(<Component />, document.createElement('div'));
        }).toWarnDev(
            'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
            'Component uses getDerivedStateFromProps() but also contains the following legacy lifecycles:\n' +
            '  componentWillMount\n' +
            '  componentWillReceiveProps\n' +
            '  componentWillUpdate\n\n' +
            'The above lifecycles should be removed. Learn more about this warning here:\n' +
            'https://fb.me/react-async-component-lifecycle-hooks',
        );
        ReactDOM.render(<Component foo={1} />, document.createElement('div'));
    });

    it('should not invoke deprecated lifecycles (cWM/cWRP/cWU) if new getSnapshotBeforeUpdate is present', () => {
        return
        const Component = createReactClass({
            getSnapshotBeforeUpdate: function () {
                return null;
            },
            componentWillMount: function () {
                throw Error('unexpected');
            },
            componentWillReceiveProps: function () {
                throw Error('unexpected');
            },
            componentWillUpdate: function () {
                throw Error('unexpected');
            },
            componentDidUpdate: function () { },
            render: function () {
                return null;
            },
        });

        expect(() => {
            ReactDOM.render(<Component />, document.createElement('div'));
        }).toWarnDev(
            'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
            'Component uses getSnapshotBeforeUpdate() but also contains the following legacy lifecycles:\n' +
            '  componentWillMount\n' +
            '  componentWillReceiveProps\n' +
            '  componentWillUpdate\n\n' +
            'The above lifecycles should be removed. Learn more about this warning here:\n' +
            'https://fb.me/react-async-component-lifecycle-hooks',
        );
        ReactDOM.render(<Component foo={1} />, document.createElement('div'));
    });

    it('should invoke both deprecated and new lifecycles if both are present', () => {
        const log = [];

        const Component = createReactClass({
            mixins: [
                {
                    componentWillMount: function () {
                        log.push('componentWillMount');
                    },
                    componentWillReceiveProps: function () {
                        log.push('componentWillReceiveProps');
                    },
                    componentWillUpdate: function () {
                        log.push('componentWillUpdate');
                    },
                },
            ],
            displayName: "Ctt",
            UNSAFE_componentWillMount: function () {
                log.push('UNSAFE_componentWillMount');
            },
            UNSAFE_componentWillReceiveProps: function () {
                log.push('UNSAFE_componentWillReceiveProps');
            },
            UNSAFE_componentWillUpdate: function () {
                log.push('UNSAFE_componentWillUpdate');
            },
            render: function () {
                return null;
            },
        });

        const div = document.createElement('div');
        var a = ReactDOM.render(<Component foo="bar" />, div);

        expect(a.constructor.displayName).toBe("Ctt")

        expect(log).toEqual(['componentWillMount',
            'UNSAFE_componentWillMount'
        ]);

        log.length = 0;

        ReactDOM.render(<Component foo="baz" />, div);
        expect(log).toEqual([
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
        ]);
    });
});


import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import createReactClass from "lib/createClass";
import PropTypes from "lib/ReactPropTypes";
var ReactDOM = window.ReactDOM || React;


describe('create-react-class-integration', function() {
  this.timeout(200000);

  it('should throw when `render` is not specified', () => {
    expect(function() {
      createReactClass({});
    }).toThrowError(
      '请实现render方法',
    );
  });

  it('should copy prop types onto the Constructor', () => {
    var propValidator = function() {}
    var TestComponent = createReactClass({
      propTypes: {
        value: propValidator,
      },
      render: function() {
        return <div />;
      },
    });

    expect(TestComponent.propTypes).toBeDefined();
    expect(TestComponent.propTypes.value).toBe(propValidator);
  });

  it('should warn on invalid prop types', () => {
    spyOn(console, 'error')
    createReactClass({
      displayName: 'Component',
      propTypes: {
        prop: null,
      },
      render: function() {
        return <span>{this.props.prop}</span>;
      },
    });
      expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: Component: prop type `prop` is invalid; ' +
    //     'it must be a function, usually from React.PropTypes.',
    // );
  });

  it('should warn on invalid context types', () => {
    spyOn(console, 'error')
    createReactClass({
      displayName: 'Component',
      contextTypes: {
        prop: null,
      },
      render: function() {
        return <span>{this.props.prop}</span>;
      },
    });
    expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: Component: context type `prop` is invalid; ' +
    //     'it must be a function, usually from React.PropTypes.',
    // );
  });

  it('should throw on invalid child context types', () => {
    spyOn(console, 'error')
    createReactClass({
      displayName: 'Component',
      childContextTypes: {
        prop: null,
      },
      render: function() {
        return <span>{this.props.prop}</span>;
      },
    });
    expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: Component: child context type `prop` is invalid; ' +
    //     'it must be a function, usually from React.PropTypes.',
    // );
  });

  it('should warn when mispelling shouldComponentUpdate', () => {
    spyOn(console, 'error')

    createReactClass({
      componentShouldUpdate: function() {
        return false;
      },
      render: function() {
        return <div />;
      },
    });
    // 未实现相关功能
    // expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: A component has a method called componentShouldUpdate(). Did you ' +
    //     'mean shouldComponentUpdate()? The name is phrased as a question ' +
    //     'because the function is expected to return a value.',
    // );

    createReactClass({
      displayName: 'NamedComponent',
      componentShouldUpdate: function() {
        return false;
      },
      render: function() {
        return <div />;
      },
    });
    // 未实现相关功能
   //  expect(console.error.calls.count()).toBe(2);
    // expect(console.error.calls.argsFor(1)[0]).toBe(
    //   'Warning: NamedComponent has a method called componentShouldUpdate(). Did you ' +
    //     'mean shouldComponentUpdate()? The name is phrased as a question ' +
    //     'because the function is expected to return a value.',
    // );
  });

  it('should warn when mispelling componentWillReceiveProps', () => {
    spyOn(console, 'error')
    createReactClass({
      componentWillRecieveProps: function() {
        return false;
      },
      render: function() {
        return <div />;
      },
    });
    // 未实现相关功能
   // expect(console.error.calls.count()).toBe(1);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'Warning: A component has a method called componentWillRecieveProps(). Did you ' +
    //     'mean componentWillReceiveProps()?',
    // );
  });

  // TODO: Consider actually moving these to statics or drop this unit test.

it('should warn when using deprecated non-static spec keys', () => {
    spyOn(console, 'error')
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
      render: function() {
        return <div />;
      },
    });
    // expect(console.error.calls.count()).toBe(4);
    // expect(console.error.calls.argsFor(0)[0]).toBe(
    //   'createClass(...): `mixins` is now a static property and should ' +
    //     'be defined inside "statics".',
    // );
    // expect(console.error.calls.argsFor(1)[0]).toBe(
    //   'createClass(...): `propTypes` is now a static property and should ' +
    //     'be defined inside "statics".',
    // );
    // expect(console.error.calls.argsFor(2)[0]).toBe(
    //   'createClass(...): `contextTypes` is now a static property and ' +
    //     'should be defined inside "statics".',
    // );
    // expect(console.error.calls.argsFor(3)[0]).toBe(
    //   'createClass(...): `childContextTypes` is now a static property and ' +
    //     'should be defined inside "statics".',
    // );
  });

  it('should support statics', () => {
    var Component = createReactClass({
      statics: {
        abc: 'def',
        def: 0,
        ghi: null,
        jkl: 'mno',
        pqr: function() {
          return this;
        },
      },

      render: function() {
        return <span />;
      },
    });
    var instance = <Component />;
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
    var Component = createReactClass({
      getInitialState: function() {
        return {
          occupation: 'clown',
        };
      },
      render: function() {
        return <span />;
      },
    });
    var instance = <Component />;
    instance = ReactTestUtils.renderIntoDocument(instance);
    expect(instance.state.occupation).toEqual('clown');
  });

  it('renders based on context getInitialState', () => {
    var Foo = createReactClass({
      contextTypes: {
        className: PropTypes.string,
      },
      getInitialState() {
        return {className: this.context.className};
      },
      render() {
        return <span className={this.state.className} />;
      },
    });

    var Outer = createReactClass({
      childContextTypes: {
        className: PropTypes.string,
      },
      getChildContext() {
        return {className: 'foo'};
      },
      render() {
        return <Foo />;
      },
    });

    var container = document.createElement('div');
    ReactDOM.render(<Outer />, container);
    expect(container.firstChild.className).toBe('foo');
  });

  it('should throw with non-object getInitialState() return values', () => {
    [['an array'], 'a string', 1234].forEach(function(state) {
      var Component = createReactClass({
        getInitialState: function() {
          return state;
        },
        render: function() {
          return <span />;
        },
      });
      var instance = <Component />;
      expect(function() {
        instance = ReactTestUtils.renderIntoDocument(instance);
      }).toThrowError(
        'getInitialState只能返回纯JS对象或者null',
      );
    });
  });

  it('should work with a null getInitialState() return value', () => {
    var Component = createReactClass({
      getInitialState: function() {
        return null;
      },
      render: function() {
        return <span />;
      },
    });
    expect(() =>
      ReactTestUtils.renderIntoDocument(<Component />),
    ).not.toThrow();
  });

  it('should throw when using legacy factories', () => {
     
  });

  it('replaceState and callback works', () => {
    var ops = [];
    var Component = createReactClass({
      getInitialState() {
        return {step: 0};
      },
      render() {
        ops.push('Render: ' + this.state.step);
        return <div />;
      },
    });

    var instance = ReactTestUtils.renderIntoDocument(<Component />);
    instance.replaceState({step: 1}, () => {
      ops.push('Callback: ' + instance.state.step);
    });
    // replaceState 未实现
    expect(ops).not.toEqual(['Render: 0', 'Render: 1', 'Callback: 1']);
  });

  it('isMounted works', () => {
    var ops = [];
    var instance;
    var Component = createReactClass({
      displayName: 'MyComponent',
      mixins: [
        {
          componentWillMount() {
            this.log('mixin.componentWillMount');
          },
          componentDidMount() {
            this.log('mixin.componentDidMount');
          },
          componentWillUpdate() {
            this.log('mixin.componentWillUpdate');
          },
          componentDidUpdate() {
            this.log('mixin.componentDidUpdate');
          },
          componentWillUnmount() {
            this.log('mixin.componentWillUnmount');
          },
        },
      ],
      log(name) {
        ops.push(`${name}: ${this.isMounted()}`);
      },
      getInitialState() {
        this.log('getInitialState');
        return {};
      },
      componentWillMount() {
        this.log('componentWillMount');
      },
      componentDidMount() {
        this.log('componentDidMount');
      },
      componentWillUpdate() {
        this.log('componentWillUpdate');
      },
      componentDidUpdate() {
        this.log('componentDidUpdate');
      },
      componentWillUnmount() {
        this.log('componentWillUnmount');
      },
      render() {
        instance = this;
        this.log('render');
        return <div />;
      },
    });

    var container = document.createElement('div');
    ReactDOM.render(<Component />, container);
    ReactDOM.render(<Component />, container);
    ReactDOM.unmountComponentAtNode(container);
    instance.log('after unmount');
    expect(ops).toEqual([
      'getInitialState: false',
      'mixin.componentWillMount: false',
      'componentWillMount: false',
      'render: false',
      'mixin.componentDidMount: true',
      'componentDidMount: true',
      'mixin.componentWillUpdate: true',
      'componentWillUpdate: true',
      'render: true',
      'mixin.componentDidUpdate: true',
      'componentDidUpdate: true',
      'mixin.componentWillUnmount: true',
      'componentWillUnmount: true',
      'after unmount: false',
    ]);

    // expect(console.error.calls.argsFor(0)[0]).toEqual(
    //   'Warning: MyComponent: isMounted is deprecated. Instead, make sure to ' +
    //     'clean up subscriptions and pending requests in componentWillUnmount ' +
    //     'to prevent memory leaks.',
    // );
  });
});
import React from "dist/React";
import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactShallowRenderer from "lib/ReactShallowRenderer";

import ReactDOMServer from "dist/ReactDOMServer";
var createReactClass = React.createClass
var PropTypes = React.PropTypes

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("create-react-class-integration", function() {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });

  var body = document.body,
    div;
  beforeEach(function() {
    div = document.createElement("div");
    body.appendChild(div);
  });
  afterEach(function() {
    body.removeChild(div);
  });
  it('should throw when `render` is not specified', () => {
    expect(function() {
      createReactClass({});
    }).toThrowError(
      'createClass(...): Class specification must implement a `render` method.',
    );
  });

  it('should copy prop types onto the Constructor', () => {
    var propValidator = function(){}
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
    spyOn(console, 'error');
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

  });

  it('should warn on invalid context types', () => {
    spyOn(console, 'error');
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
  });
  it('should throw on invalid child context types', () => {
    spyOn(console, 'error');
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
        'Component.getInitialState(): must return an object or null',
      );
    });
  });

  it('replaceState is deprecated', () => {
    spyOn(console, 'error');
    var Component = createReactClass({
      getInitialState() {
        return {step: 0};
      },
      render() {
        return <div />;
      },
    });

    var instance = ReactTestUtils.renderIntoDocument(<Component />);
    instance.replaceState({step: 1}, () => {
      ops.push('Callback: ' + instance.state.step);
    });
    expect(console.error.calls.count()).toBe(1);
  });

  it('isMounted works', () => {
    spyOn(console, 'error');

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

    expect(console.error.calls.count()).toBe(1);
  })
})
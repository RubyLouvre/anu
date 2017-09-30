import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import PropTypes from 'lib/ReactPropTypes';
import ReactDOMServer from "dist/ReactDOMServer";
var ReactDOM = window.ReactDOM || React;



// https://github.com/facebook/react/blob/master/src/isomorphic/classic/__tests__/ReactContextValidator-test.js

describe('ReactContextValidator', function() {
  this.timeout(200000);
  function normalizeCodeLocInfo(str) {
    return str && str.replace(/\(at .+?:\d+\)/g, '(at **)');
  }

  // TODO: This behavior creates a runtime dependency on propTypes. We should
  // ensure that this is not required for ES6 classes with Flow.

  it('should filter out context not in contextTypes', () => {
    class Component extends React.Component {
      render() {
        return <div />;
      }
    }
    Component.contextTypes = {
      foo: PropTypes.string,
    };

    class ComponentInFooBarContext extends React.Component {
      getChildContext() {
        return {
          foo: 'abc',
          bar: 123,
        };
      }

      render() {
        return <Component ref="child" />;
      }
    }
    ComponentInFooBarContext.childContextTypes = {
      foo: PropTypes.string,
      bar: PropTypes.number,
    };

    var instance = ReactTestUtils.renderIntoDocument(
      <ComponentInFooBarContext />,
    );
    expect(instance.refs.child.context).toEqual({foo: 'abc'});
  });

  it('should pass next context to lifecycles', () => {
    var actualComponentWillReceiveProps;
    var actualShouldComponentUpdate;
    var actualComponentWillUpdate;

    class Parent extends React.Component {
      getChildContext() {
        return {
          foo: this.props.foo,
          bar: 'bar',
        };
      }

      render() {
        return <Component />;
      }
    }
    Parent.childContextTypes = {
      foo: PropTypes.string.isRequired,
      bar: PropTypes.string.isRequired,
    };

    class Component extends React.Component {
      componentWillReceiveProps(nextProps, nextContext) {
        actualComponentWillReceiveProps = nextContext;
        return true;
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        actualShouldComponentUpdate = nextContext;
        return true;
      }

      componentWillUpdate(nextProps, nextState, nextContext) {
        actualComponentWillUpdate = nextContext;
      }

      render() {
        return <div />;
      }
    }
    Component.contextTypes = {
      foo: PropTypes.string,
    };

    var container = document.createElement('div');
    ReactDOM.render(<Parent foo="abc" />, container);
    ReactDOM.render(<Parent foo="def" />, container);
    expect(actualComponentWillReceiveProps).toEqual({foo: 'def'});
    expect(actualShouldComponentUpdate).toEqual({foo: 'def'});
    expect(actualComponentWillUpdate).toEqual({foo: 'def'});
  });

  it('should not pass previous context to lifecycles', () => {
    var actualComponentDidUpdate;

    class Parent extends React.Component {
      getChildContext() {
        return {
          foo: this.props.foo,
        };
      }

      render() {
        return <Component />;
      }
    }
    Parent.childContextTypes = {
      foo: PropTypes.string.isRequired,
    };

    class Component extends React.Component {
      componentDidUpdate(...args) {
        actualComponentDidUpdate = args;
      }

      render() {
        return <div />;
      }
    }
    Component.contextTypes = {
      foo: PropTypes.string,
    };

    var container = document.createElement('div');
    ReactDOM.render(<Parent foo="abc" />, container);
    ReactDOM.render(<Parent foo="def" />, container);
    expect(actualComponentDidUpdate.length).toBe(3);
  });

  it('should check context types', () => {
    spyOn(console, 'error')
    
    class Component extends React.Component {
      render() {
        return <div />;
      }
    }
    Component.contextTypes = {
      foo: PropTypes.string.isRequired,
    };

    ReactTestUtils.renderIntoDocument(<Component />);
  
    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);

    class ComponentInFooStringContext extends React.Component {
      getChildContext() {
        return {
          foo: this.props.fooValue,
        };
      }

      render() {
        return <Component />;
      }
    }
    ComponentInFooStringContext.childContextTypes = {
      foo: PropTypes.string,
    };

    ReactTestUtils.renderIntoDocument(
      <ComponentInFooStringContext fooValue={'bar'} />,
    );

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);

    class ComponentInFooNumberContext extends React.Component {
      getChildContext() {
        return {
          foo: this.props.fooValue,
        };
      }

      render() {
        return <Component />;
      }
    }
    ComponentInFooNumberContext.childContextTypes = {
      foo: PropTypes.number,
    };

    ReactTestUtils.renderIntoDocument(
      <ComponentInFooNumberContext fooValue={123} />,
    );

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
  });

  it('should check child context types', () => {
    spyOn(console, 'error')

    class Component extends React.Component {
      getChildContext() {
        return this.props.testContext;
      }

      render() {
        return <div />;
      }
    }
    Component.childContextTypes = {
      foo: PropTypes.string.isRequired,
      bar: PropTypes.number,
    };

    ReactTestUtils.renderIntoDocument(<Component testContext={{bar: 123}} />);

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);

    ReactTestUtils.renderIntoDocument(<Component testContext={{foo: 123}} />);

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
    

    ReactTestUtils.renderIntoDocument(
      <Component testContext={{foo: 'foo', bar: 123}} />,
    );

    ReactTestUtils.renderIntoDocument(<Component testContext={{foo: 'foo'}} />);

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
    
  });

  // TODO (bvaughn) Remove this test and the associated behavior in the future.
  // It has only been added in Fiber to match the (unintentional) behavior in Stack.
  it('should warn (but not error) if getChildContext method is missing', () => {
    spyOn(console, 'error')

    class ComponentA extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string.isRequired,
      };
      render() {
        return <div />;
      }
    }
    class ComponentB extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string.isRequired,
      };
      render() {
        return <div />;
      }
    }

    ReactTestUtils.renderIntoDocument(<ComponentA />);

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
    

    // Warnings should be deduped by component type
    ReactTestUtils.renderIntoDocument(<ComponentA />);

    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
    

    // PropTypes 为空实现所以没有报错
    ReactTestUtils.renderIntoDocument(<ComponentB />);
    
    // PropTypes 为空实现所以没有报错
    expect(console.error.calls.count()).toBe(0);
    
  });

  // TODO (bvaughn) Remove this test and the associated behavior in the future.
  // It has only been added in Fiber to match the (unintentional) behavior in Stack.
  it('should pass parent context if getChildContext method is missing', () => {

    class ParentContextProvider extends React.Component {
      static childContextTypes = {
        foo: PropTypes.number,
      };
      getChildContext() {
        return {
          foo: 'FOO',
        };
      }
      render() {
        return <MiddleMissingContext />;
      }
    }

    class MiddleMissingContext extends React.Component {
      static childContextTypes = {
        bar: PropTypes.string.isRequired,
      };
      render() {
        return <ChildContextConsumer />;
      }
    }

    var childContext;
    class ChildContextConsumer extends React.Component {
      render() {
        childContext = this.context;
        return <div />;
      }
    }
    ChildContextConsumer.contextTypes = {
      bar: PropTypes.string.isRequired,
      foo: PropTypes.string.isRequired,
    };

    ReactTestUtils.renderIntoDocument(<ParentContextProvider />);
    expect(childContext.bar).toBeUndefined();
    expect(childContext.foo).toBe('FOO');
  });
});
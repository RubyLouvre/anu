'use strict';

let PropTypes;
let React;
let ReactDOM;
let ReactTestUtils;

function StatelessComponent(props) {
  return <div>{props.name}</div>;
}

describe('ReactStatelessComponent', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
    PropTypes = require('prop-types');
    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('test-utils');
  });

  it('should render stateless component', () => {
    const el = document.createElement('div');
    ReactDOM.render(<StatelessComponent name="A" />, el);

    expect(el.textContent).toBe('A');
  });

  it('should update stateless component', () => {
    class Parent extends React.Component {
      render() {
        return <StatelessComponent {...this.props} />;
      }
    }

    const el = document.createElement('div');
    ReactDOM.render(<Parent name="A" />, el);
    expect(el.textContent).toBe('A');

    ReactDOM.render(<Parent name="B" />, el);
    expect(el.textContent).toBe('B');
  });

  it('should unmount stateless component', () => {
    const container = document.createElement('div');

    ReactDOM.render(<StatelessComponent name="A" />, container);
    expect(container.textContent).toBe('A');

    ReactDOM.unmountComponentAtNode(container);
    expect(container.textContent).toBe('');
  });

  it('should pass context thru stateless component', () => {
    class Child extends React.Component {
      static contextTypes = {
        test: PropTypes.string.isRequired,
      };

      render() {
        return <div>{this.context.test}</div>;
      }
    }

    function Parent() {
      return <Child />;
    }

    class GrandParent extends React.Component {
      static childContextTypes = {
        test: PropTypes.string.isRequired,
      };

      getChildContext() {
        return {test: this.props.test};
      }

      render() {
        return <Parent />;
      }
    }

    const el = document.createElement('div');
    ReactDOM.render(<GrandParent test="test" />, el);

    expect(el.textContent).toBe('test');

    ReactDOM.render(<GrandParent test="mest" />, el);

    expect(el.textContent).toBe('mest');
  });

  it('should warn for getDerivedStateFromProps on a functional component', () => {
    function StatelessComponentWithChildContext() {
      return null;
    }
    StatelessComponentWithChildContext.getDerivedStateFromProps = function() {};

    const container = document.createElement('div');

    expect(() =>
      ReactDOM.render(<StatelessComponentWithChildContext />, container),
    ).toWarnDev(
      'StatelessComponentWithChildContext: Stateless ' +
        'functional components do not support getDerivedStateFromProps.',
    );
  });

  it('should warn for childContextTypes on a functional component', () => {
    function StatelessComponentWithChildContext(props) {
      return <div>{props.name}</div>;
    }

    StatelessComponentWithChildContext.childContextTypes = {
      foo: PropTypes.string,
    };

    const container = document.createElement('div');

    expect(() =>
      ReactDOM.render(
        <StatelessComponentWithChildContext name="A" />,
        container,
      ),
    ).toWarnDev(
      'StatelessComponentWithChildContext(...): childContextTypes cannot ' +
        'be defined on a functional component.',
    );
  });

  it('should throw when stateless component returns undefined', () => {
    function NotAComponent() {}
  
      ReactTestUtils.renderIntoDocument(
        <div>
          <NotAComponent />
        </div>,
      );
    
  });

  it('should throw on string refs in pure functions', () => {
    function Child() {
      return <div ref="me" />;
    }

      ReactTestUtils.renderIntoDocument(<Child test="test" />);

  });

  it('should warn when given a string ref', () => {
    function Indirection(props) {
      return <div>{props.children}</div>;
    }

    class ParentUsingStringRef extends React.Component {
      render() {
        return (
          <Indirection>
            <StatelessComponent name="A" ref="stateless" />
          </Indirection>
        );
      }
    }

    expect(() =>
      ReactTestUtils.renderIntoDocument(<ParentUsingStringRef />),
    ).toWarnDev(
      'Warning: Stateless function components cannot be given refs. ' +
        'Attempts to access this ref will fail.\n\nCheck the render method ' +
        'of `ParentUsingStringRef`.\n' +
        '    in StatelessComponent (at **)\n' +
        '    in div (at **)\n' +
        '    in Indirection (at **)\n' +
        '    in ParentUsingStringRef (at **)',
    );

    // No additional warnings should be logged
    ReactTestUtils.renderIntoDocument(<ParentUsingStringRef />);
  });

  it('should warn when given a function ref', () => {
    function Indirection(props) {
      return <div>{props.children}</div>;
    }

    class ParentUsingFunctionRef extends React.Component {
      render() {
        return (
          <Indirection>
            <StatelessComponent
              name="A"
              ref={arg => {
                expect(arg).toBe(null);
              }}
            />
          </Indirection>
        );
      }
    }

    expect(() =>
      ReactTestUtils.renderIntoDocument(<ParentUsingFunctionRef />),
    ).toWarnDev(
      'Warning: Stateless function components cannot be given refs. ' +
        'Attempts to access this ref will fail.\n\nCheck the render method ' +
        'of `ParentUsingFunctionRef`.\n' +
        '    in StatelessComponent (at **)\n' +
        '    in div (at **)\n' +
        '    in Indirection (at **)\n' +
        '    in ParentUsingFunctionRef (at **)',
    );

    // No additional warnings should be logged
    ReactTestUtils.renderIntoDocument(<ParentUsingFunctionRef />);
  });

  it('deduplicates ref warnings based on element or owner', () => {
    // When owner uses JSX, we can use exact line location to dedupe warnings
    class AnonymousParentUsingJSX extends React.Component {
      render() {
        return <StatelessComponent name="A" ref={() => {}} />;
      }
    }
    Object.defineProperty(AnonymousParentUsingJSX, 'name', {value: undefined});

    let instance1;

    expect(() => {
      instance1 = ReactTestUtils.renderIntoDocument(
        <AnonymousParentUsingJSX />,
      );
    }).toWarnDev(
      'Warning: Stateless function components cannot be given refs.',
    );
    // Should be deduped (offending element is on the same line):
    instance1.forceUpdate();
    // Should also be deduped (offending element is on the same line):
    ReactTestUtils.renderIntoDocument(<AnonymousParentUsingJSX />);

    // When owner doesn't use JSX, and is anonymous, we warn once per internal instance.
    class AnonymousParentNotUsingJSX extends React.Component {
      render() {
        return React.createElement(StatelessComponent, {
          name: 'A',
          ref: () => {},
        });
      }
    }
    Object.defineProperty(AnonymousParentNotUsingJSX, 'name', {
      value: undefined,
    });

    let instance2;
    expect(() => {
      instance2 = ReactTestUtils.renderIntoDocument(
        <AnonymousParentNotUsingJSX />,
      );
    }).toWarnDev(
      'Warning: Stateless function components cannot be given refs.',
    );
    // Should be deduped (same internal instance, no additional warnings)
    instance2.forceUpdate();
    // Could not be deduped (different internal instance):
    expect(() =>
      ReactTestUtils.renderIntoDocument(<AnonymousParentNotUsingJSX />),
    ).toWarnDev('Warning: Stateless function components cannot be given refs.');

    // When owner doesn't use JSX, but is named, we warn once per owner name
    class NamedParentNotUsingJSX extends React.Component {
      render() {
        return React.createElement(StatelessComponent, {
          name: 'A',
          ref: () => {},
        });
      }
    }
    let instance3;
    expect(() => {
      instance3 = ReactTestUtils.renderIntoDocument(<NamedParentNotUsingJSX />);
    }).toWarnDev(
      'Warning: Stateless function components cannot be given refs.',
    );
    // Should be deduped (same owner name, no additional warnings):
    instance3.forceUpdate();
    // Should also be deduped (same owner name, no additional warnings):
    ReactTestUtils.renderIntoDocument(<NamedParentNotUsingJSX />);
  });

  // This guards against a regression caused by clearing the current debug fiber.
  // https://github.com/facebook/react/issues/10831
  it('should warn when giving a function ref with context', () => {
    function Child() {
      return null;
    }
    Child.contextTypes = {
      foo: PropTypes.string,
    };

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
      };
      getChildContext() {
        return {
          foo: 'bar',
        };
      }
      render() {
        return <Child ref={function() {}} />;
      }
    }

    expect(() => ReactTestUtils.renderIntoDocument(<Parent />)).toWarnDev(
      'Warning: Stateless function components cannot be given refs. ' +
        'Attempts to access this ref will fail.\n\nCheck the render method ' +
        'of `Parent`.\n' +
        '    in Child (at **)\n' +
        '    in Parent (at **)',
    );
  });

  it('should provide a null ref', () => {
    function Child() {
      return <div />;
    }

    const comp = ReactTestUtils.renderIntoDocument(<Child />);
    expect(!!comp).toBe(true);
  });

  it('should use correct name in key warning', () => {
    function Child() {
      return <div>{[<span />]}</div>;
    }

    expect(() => ReactTestUtils.renderIntoDocument(<Child />)).toWarnDev(
      'Each child in an array or iterator should have a unique "key" prop.\n\n' +
        'Check the render method of `Child`.',
    );
  });

  it('should support default props and prop types', () => {
    function Child(props) {
      return <div>{props.test}</div>;
    }
    Child.defaultProps = {test: 2};
    Child.propTypes = {test: PropTypes.string};

    expect(() => ReactTestUtils.renderIntoDocument(<Child />)).toWarnDev(
      'Warning: Failed prop type: Invalid prop `test` of type `number` ' +
        'supplied to `Child`, expected `string`.\n' +
        '    in Child (at **)',
    );
  });

  it('should receive context', () => {
    class Parent extends React.Component {
      static childContextTypes = {
        lang: PropTypes.string,
      };

      getChildContext() {
        return {lang: 'en'};
      }

      render() {
        return <Child />;
      }
    }

    function Child(props, context) {
      return <div>{context.lang}</div>;
    }
    Child.contextTypes = {lang: PropTypes.string};

    const el = document.createElement('div');
    ReactDOM.render(<Parent />, el);
    expect(el.textContent).toBe('en');
  });

  it('should work with arrow functions', () => {
    let Child = function() {
      return <div />;
    };
    // Will create a new bound function without a prototype, much like a native
    // arrow function.
    Child = Child.bind(this);

    expect(() => ReactTestUtils.renderIntoDocument(<Child />)).not.toThrow();
  });

  it('should allow simple functions to return null', () => {
    const Child = function() {
      return null;
    };
    expect(() => ReactTestUtils.renderIntoDocument(<Child />)).not.toThrow();
  });

  it('should allow simple functions to return false', () => {
    function Child() {
      return false;
    }
    expect(() => ReactTestUtils.renderIntoDocument(<Child />)).not.toThrow();
  });
});
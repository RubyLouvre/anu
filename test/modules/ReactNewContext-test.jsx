import React from 'dist/React';
import { createReactNoop } from 'lib/createReactNoop'
var ReactDOM = window.ReactDOM || React;

describe('ReactNewConextAPI', function () {
  this.timeout(200000);
  var body = document.body,
    div, ReactNoop
  beforeEach(function () {
    div = document.createElement('div');
    body.appendChild(div);
    ReactNoop = createReactNoop(div, ReactDOM)
  });
  afterEach(function () {
    body.removeChild(div);
  });
  function span(prop) {
    return { type: 'span', children: [prop] };
  }
  it('simple mount and update', () => {
    const Context = React.createContext(1);

    function Consumer(props) {
      return <Context.Consumer>{(value) => <span>{'Result: ' + value}</span>}</Context.Consumer>;
    }

    const Indirection = React.Fragment;

    function App(props) {
      return (
        <Context.Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
          </Indirection>
        </Context.Provider>
      );
    }

    ReactNoop.render(<App value={2} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([span('Result: 2')]);

    // Update
    ReactNoop.render(<App value={3} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([span('Result: 3')]);
  });

  it('propagates through shouldComponentUpdate false', () => {
    const Context = React.createContext(1);

    function Provider(props) {
      ReactNoop.yield('Provider');
      return (
        <Context.Provider value={props.value}>
          {props.children}
        </Context.Provider>
      );
    }

    function Consumer(props) {
      ReactNoop.yield('Consumer');
      return (
        <Context.Consumer>
          {value => {
            ReactNoop.yield('Consumer render prop');
            return <span>{'Result: ' + value}</span>;
          }}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        ReactNoop.yield('Indirection');
        return this.props.children;
      }
    }

    function App(props) {
      ReactNoop.yield('App');
      return (
        <Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App value={2} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      'Indirection',
      'Indirection',
      'Consumer',
      'Consumer render prop',
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: 2')]);

    // Update
    ReactNoop.render(<App value={3} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      'Consumer render prop',
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: 3')]);
  });
  it('consumers bail out if context value is the same', () => {
    const Context = React.createContext(1);

    function Provider(props) {
      ReactNoop.yield('Provider');
      return (
        <Context.Provider value={props.value}>
          {props.children}
        </Context.Provider>
      );
    }

    function Consumer(props) {
      ReactNoop.yield('Consumer');
      return (
        <Context.Consumer>
          {value => {
            ReactNoop.yield('Consumer render prop');
            return <span>{'Result: ' + value}</span>;
          }}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        ReactNoop.yield('Indirection');
        return this.props.children;
      }
    }

    function App(props) {
      ReactNoop.yield('App');
      return (
        <Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App value={2} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      'Indirection',
      'Indirection',
      'Consumer',
      'Consumer render prop',
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: 2')]);

    // Update with the same context value
    ReactNoop.render(<App value={2} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      // Don't call render prop again
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: 2')]);
  });
  it('nested providers', () => {

    const Context = React.createContext(1);

    function Provider(props) {
      return (
        <Context.Consumer>
          {contextValue => (
            // Multiply previous context value by 2, unless prop overrides
            <Context.Provider value={props.value || contextValue * 2}>
              {props.children}
            </Context.Provider>
          )}
        </Context.Consumer>
      );
    }

    function Consumer(props) {
      return (
        <Context.Consumer>
          {value => <span>{'Result: ' + value}</span>}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }

    function App(props) {
      return (
        <Provider value={props.value}>
          <Indirection>
            <Provider>
              <Indirection>
                <Provider>
                  <Indirection>
                    <Consumer />
                  </Indirection>
                </Provider>
              </Indirection>
            </Provider>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App value={2} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([span('Result: 8')]);

    // Update
    ReactNoop.render(<App value={3} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([span('Result: 12')]);
  });

  it('should provide the correct (default) values to consumers outside of a provider', () => {
    const FooContext = React.createContext({ value: 'foo-initial' });
    const BarContext = React.createContext({ value: 'bar-initial' });

    const Verify = ({ actual, expected }) => {
      expect(expected).toBe(actual);
      return null;
    };

    ReactNoop.render(
      <React.Fragment>
        <BarContext.Provider value={{ value: 'bar-updated' }}>
          <BarContext.Consumer>
            {({ value }) => <Verify actual={value} expected="bar-updated" />}
          </BarContext.Consumer>

          <FooContext.Provider value={{ value: 'foo-updated' }}>
            <FooContext.Consumer>
              {({ value }) => <Verify actual={value} expected="foo-updated" />}
            </FooContext.Consumer>
          </FooContext.Provider>
        </BarContext.Provider>

        <FooContext.Consumer>
          {({ value }) => <Verify actual={value} expected="foo-initial" />}
        </FooContext.Consumer>
        <BarContext.Consumer>
          {({ value }) => <Verify actual={value} expected="bar-initial" />}
        </BarContext.Consumer>
      </React.Fragment>,
    );
    ReactNoop.flush();
  });

  it('multiple consumers in different branches', () => {
    const Context = React.createContext(1);

    function Provider(props) {
      return (
        <Context.Consumer>
          {contextValue => (
            // Multiply previous context value by 2, unless prop overrides
            <Context.Provider value={props.value || contextValue * 2}>
              {props.children}
            </Context.Provider>
          )}
        </Context.Consumer>
      );
    }

    function Consumer(props) {
      return (
        <Context.Consumer>
          {value => <span>{'Result: ' + value}</span>}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }

    function App(props) {
      return (
        <Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Provider>
                <Consumer />
              </Provider>
            </Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App value={2} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([
      span('Result: 4'),
      span('Result: 2'),
    ]);

    // Update
    ReactNoop.render(<App value={3} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([
      span('Result: 6'),
      span('Result: 3'),
    ]);

    // Another update
    ReactNoop.render(<App value={4} />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([
      span('Result: 8'),
      span('Result: 4'),
    ]);
  });

  it('compares context values with Object.is semantics', () => {
    const Context = React.createContext(1);

    function Provider(props) {
      ReactNoop.yield('Provider');
      return (
        <Context.Provider value={props.value}>
          {props.children}
        </Context.Provider>
      );
    }

    function Consumer(props) {
      ReactNoop.yield('Consumer');
      return (
        <Context.Consumer>
          {value => {
            ReactNoop.yield('Consumer render prop');
            return <span>{'Result: ' + value}</span>;
          }}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        ReactNoop.yield('Indirection');
        return this.props.children;
      }
    }

    function App(props) {
      ReactNoop.yield('App');
      return (
        <Provider value={props.value}>
          <Indirection>
            <Indirection>
              <Consumer />
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App value={NaN} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      'Indirection',
      'Indirection',
      'Consumer',
      'Consumer render prop',
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: NaN')]);

    // Update
    ReactNoop.render(<App value={NaN} />);
    expect(ReactNoop.flush()).toEqual([
      'App',
      'Provider',
      // Consumer should not re-render again
      // 'Consumer render prop',
    ]);
    expect(ReactNoop.getChildren()).toEqual([span('Result: NaN')]);
  });

  it('context unwinds when interrupted', () => {
    return
    const Context = React.createContext('Default');

    function Consumer(props) {
      return (
        <Context.Consumer>
          {value => <span>{'Result: ' + value}</span>}
        </Context.Consumer>
      );
    }

    function BadRender() {
      throw new Error('Bad render');
    }

    class ErrorBoundary extends React.Component {
      state = { error: null };
      componentDidCatch(error) {
        this.setState({ error });
      }
      render() {
        if (this.state.error) {
          return null;
        }
        return this.props.children;
      }
    }

    function App(props) {
      return (
        <React.Fragment>
          <Context.Provider value="Does not unwind">
            <ErrorBoundary>
              <Context.Provider value="Unwinds after BadRender throws">
                <BadRender />
              </Context.Provider>
            </ErrorBoundary>
            <Consumer />
          </Context.Provider>
        </React.Fragment>
      );
    }

    ReactNoop.render(<App value="A" />);
    ReactNoop.flush();
    expect(ReactNoop.getChildren()).toEqual([
      // The second provider should use the default value.
      span('Result: Does not unwind'),
    ]);
  });

  it('can skip consumers with bitmask', () => {
    const Context = React.createContext({ foo: 0, bar: 0 }, (a, b) => {
      let result = 0;
      if (a.foo !== b.foo) {
        result |= 0b01;
      }
      if (a.bar !== b.bar) {
        result |= 0b10;
      }
      return result;
    });

    function Provider(props) {
      return (
        <Context.Provider value={{ foo: props.foo, bar: props.bar }}>
          {props.children}
        </Context.Provider>
      );
    }

    function Foo() {
      return (
        <Context.Consumer observedBits={0b01}>
          {value => {
            ReactNoop.yield('Foo');
            return <span>{'Foo: ' + value.foo}</span>;
          }}
        </Context.Consumer>
      );
    }

    function Bar() {
      return (
        <Context.Consumer observedBits={0b10}>
          {value => {
            ReactNoop.yield('Bar');
            return <span>{'Bar: ' + value.bar}</span>;
          }}
        </Context.Consumer>
      );
    }

    class Indirection extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return this.props.children;
      }
    }

    function App(props) {
      return (
        <Provider foo={props.foo} bar={props.bar}>
          <Indirection>
            <Indirection>
              <Foo />
            </Indirection>
            <Indirection>
              <Bar />
            </Indirection>
          </Indirection>
        </Provider>
      );
    }

    ReactNoop.render(<App foo={1} bar={1} />);
    expect(ReactNoop.flush()).toEqual(['Foo', 'Bar']);
    expect(ReactNoop.getChildren()).toEqual([span('Foo: 1'), span('Bar: 1')]);

    // Update only foo
    ReactNoop.render(<App foo={2} bar={1} />);
    expect(ReactNoop.flush()).toEqual(['Foo']);
    expect(ReactNoop.getChildren()).toEqual([span('Foo: 2'), span('Bar: 1')]);

    // Update only bar
    ReactNoop.render(<App foo={2} bar={2} />);
    expect(ReactNoop.flush()).toEqual(['Bar']);
    expect(ReactNoop.getChildren()).toEqual([span('Foo: 2'), span('Bar: 2')]);

    // Update both
    ReactNoop.render(<App foo={3} bar={3} />);
    expect(ReactNoop.flush()).toEqual(['Foo', 'Bar']);
    expect(ReactNoop.getChildren()).toEqual([span('Foo: 3'), span('Bar: 3')]);
  });
});

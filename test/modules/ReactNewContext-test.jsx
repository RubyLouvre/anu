import React from 'dist/React';
var ReactDOM = window.ReactDOM || React;

describe('ReactNewConextAPI', function() {
	this.timeout(200000);
	var body = document.body,
		div;
	function collectVDOM(vdom, array) {
		if (vdom.tag == 5) {
			var children = [];
			var element = {
				type: vdom.type,
				children: children
            };
            array.push(element)
			var c = vdom._children;
			for (var i in c) {
				collectVDOM(c[i], children);
			}
		} else if (vdom.tag === 6) {
			array.push( vdom.text +"");
		} else {
			var c = vdom._children;
			for (var i in c) {
				collectVDOM(c[i], array);
			}
		}
	}
	function span(prop) {
		return { type: 'span', children: [prop] };
    }
    var yieldData = []
	var ReactNoop = {
		render(vdom) {
			ReactDOM.render(vdom, div);
        },
        yield(a){
            yieldData.push(a)
        },
		flush() {
           var ret = yieldData.concat()
           yieldData.length = 0
           return ret
        },
		getChildren() {
			var c = div.__component,
				ret = [];
			collectVDOM(c, ret);
			return ret;
		}
	};
	beforeEach(function() {
		div = document.createElement('div');
		body.appendChild(div);
	});
	afterEach(function() {
		body.removeChild(div);
	});

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
		expect(ReactNoop.getChildren()).toEqual([ span('Result: 2') ]);

		// Update
		ReactNoop.render(<App value={3} />);
		ReactNoop.flush();
		expect(ReactNoop.getChildren()).toEqual([ span('Result: 3') ]);
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
          return
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
              {value => <span>{'Result: ' + value} </span>}
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
});

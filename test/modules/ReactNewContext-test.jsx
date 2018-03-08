import React from 'dist/React';
var ReactDOM = window.ReactDOM || React;

describe('ReactDOMFragment', function() {
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
	var ReactNoop = {
		render(vdom) {
			ReactDOM.render(vdom, div);
		},
		flush() {},
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
});

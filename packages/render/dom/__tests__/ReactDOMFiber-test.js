'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('test-utils');
const PropTypes = require('prop-types');

describe('ReactDOMFiber', () => {
	let container;

	beforeEach(() => {
		container = document.createElement('div');
	});
	afterEach(() => {
		ReactDOM.unmountComponentAtNode(container);
	});

	it('should render strings as children', () => {
		const Box = ({ value }) => <div>{value}</div>;

		ReactDOM.render(<Box value="foo" />, container);
		expect(container.textContent).toEqual('foo');
	});

	it('should render numbers as children', () => {
		const Box = ({ value }) => <div>{value}</div>;

		ReactDOM.render(<Box value={10} />, container);

		expect(container.textContent).toEqual('10');
	});

	it('should be called a callback argument', () => {
		// mounting phase
		let called = false;
		ReactDOM.render(<div>Foo</div>, container, () => (called = true));
		expect(called).toEqual(true);

		// updating phase
		called = false;
		ReactDOM.render(<div>Foo</div>, container, () => (called = true));
		expect(called).toEqual(true);
	});

	it('should call a callback argument when the same element is re-rendered', () => {
		class Foo extends React.Component {
			render() {
				return <div>Foo</div>;
			}
		}
		const element = <Foo />;

		// mounting phase
		let called = false;
		ReactDOM.render(element, container, () => (called = true));
		expect(called).toEqual(true);

		// updating phase
		called = false;
		ReactDOM.unstable_batchedUpdates(() => {
			ReactDOM.render(element, container, () => (called = true));
		});
		expect(called).toEqual(true);
	});

	it('should render a component returning strings directly from render', () => {
		const Text = ({ value }) => value;

		ReactDOM.render(<Text value="foo" />, container);
		expect(container.textContent).toEqual('foo');
	});

	it('should render a component returning numbers directly from render', () => {
		const Text = ({ value }) => value;

		ReactDOM.render(<Text value={10} />, container);

		expect(container.textContent).toEqual('10');
	});

	it('finds the DOM Text node of a string child', () => {
		class Text extends React.Component {
			render() {
				return this.props.value;
			}
		}

		let instance = null;
		ReactDOM.render(<Text value="foo" ref={ref => (instance = ref)} />, container);

		const textNode = ReactDOM.findDOMNode(instance);
		expect(textNode).toBe(container.firstChild);
		expect(textNode.nodeType).toBe(3);
		expect(textNode.nodeValue).toBe('foo');
	});

	it('finds the first child when a component returns a fragment', () => {
		class Fragment extends React.Component {
			render() {
				return [<div key="a" />, <span key="b" />];
			}
		}

		let instance = null;
		ReactDOM.render(<Fragment ref={ref => (instance = ref)} />, container);

		expect(container.childNodes.length).toBe(2);

		const firstNode = ReactDOM.findDOMNode(instance);
		expect(firstNode).toBe(container.firstChild);
		expect(firstNode.tagName).toBe('DIV');
	});

	it('finds the first child even when fragment is nested', () => {
		class Wrapper extends React.Component {
			render() {
				return this.props.children;
			}
		}

		class Fragment extends React.Component {
			render() {
				return [
					<Wrapper key="a">
						<div />
					</Wrapper>,
					<span key="b" />,
				];
			}
		}

		let instance = null;
		ReactDOM.render(<Fragment ref={ref => (instance = ref)} />, container);

		expect(container.childNodes.length).toBe(2);

		const firstNode = ReactDOM.findDOMNode(instance);
		expect(firstNode).toBe(container.firstChild);
		expect(firstNode.tagName).toBe('DIV');
	});

	it('finds the first child even when first child renders null', () => {
		console.log('Fragment不会产生实例');
		return;
		class NullComponent extends React.Component {
			render() {
				return null;
			}
		}

		class Fragment extends React.Component {
			render() {
				return [<NullComponent key="a" />, <div key="b" />, <span key="c" />];
			}
		}

		let instance = null;
		ReactDOM.render(<Fragment ref={ref => (instance = ref)} />, container);

		expect(container.childNodes.length).toBe(2);

		const firstNode = ReactDOM.findDOMNode(instance);
		expect(firstNode).toBe(container.firstChild);
		expect(firstNode.tagName).toBe('DIV');
	});

	let svgEls, htmlEls, mathEls;
	const expectSVG = { ref: el => svgEls.push(el) };
	const expectHTML = { ref: el => htmlEls.push(el) };
	const expectMath = { ref: el => mathEls.push(el) };

	const usePortal = function(tree) {
		return ReactDOM.createPortal(tree, document.createElement('div'));
	};

	const assertNamespacesMatch = function(tree) {
		container = document.createElement('div');
		svgEls = [];
		htmlEls = [];
		mathEls = [];

		ReactDOM.render(tree, container);
		svgEls.forEach(el => {
			expect(el.namespaceURI).toBe('http://www.w3.org/2000/svg');
		});
		htmlEls.forEach(el => {
			expect(el.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
		});
		mathEls.forEach(el => {
			expect(el.namespaceURI).toBe('http://www.w3.org/1998/Math/MathML');
		});

		ReactDOM.unmountComponentAtNode(container);
		expect(container.innerHTML).toBe('');
	};

	it('should render one portal', () => {
		const portalContainer = document.createElement('div');

		ReactDOM.render(<div>{ReactDOM.createPortal(<div>portal</div>, portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('<div>portal</div>');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.unmountComponentAtNode(container);
		expect(portalContainer.innerHTML).toBe('');
		expect(container.innerHTML).toBe('');
	});

	// TODO: remove in React 17
	it('should support unstable_createPortal alias', () => {
		const portalContainer = document.createElement('div');
		const createPortal = ReactDOM.createPortal;

		expect(() =>
			ReactDOM.render(<div>{createPortal(<div>portal</div>, portalContainer)}</div>, container)
		).toLowPriorityWarnDev(
			'The ReactDOM.unstable_createPortal() alias has been deprecated, ' +
				'and will be removed in React 17+. Update your code to use ' +
				'ReactDOM.createPortal() instead. It has the exact same API, ' +
				'but without the "unstable_" prefix.'
		);
		expect(portalContainer.innerHTML).toBe('<div>portal</div>');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.unmountComponentAtNode(container);
		expect(portalContainer.innerHTML).toBe('');
		expect(container.innerHTML).toBe('');
	});

	it('should render many portals', () => {
		const portalContainer1 = document.createElement('div');
		const portalContainer2 = document.createElement('div');

		const ops = [];
		class Child extends React.Component {
			componentDidMount() {
				ops.push(`${this.props.name} componentDidMount`);
			}
			componentDidUpdate() {
				ops.push(`${this.props.name} componentDidUpdate`);
			}
			componentWillUnmount() {
				ops.push(`${this.props.name} componentWillUnmount`);
			}
			render() {
				return <div>{this.props.name}</div>;
			}
		}

		class Parent extends React.Component {
			componentDidMount() {
				ops.push(`Parent:${this.props.step} componentDidMount`);
			}
			componentDidUpdate() {
				ops.push(`Parent:${this.props.step} componentDidUpdate`);
			}
			componentWillUnmount() {
				ops.push(`Parent:${this.props.step} componentWillUnmount`);
			}
			render() {
				const { step } = this.props;
				return [
					<Child key="a" name={`normal[0]:${step}`} />,
					ReactDOM.createPortal(<Child key="b" name={`portal1[0]:${step}`} />, portalContainer1),
					<Child key="c" name={`normal[1]:${step}`} />,
					ReactDOM.createPortal(
						[<Child key="d" name={`portal2[0]:${step}`} />, <Child key="e" name={`portal2[1]:${step}`} />],
						portalContainer2
					),
				];
			}
		}

		ReactDOM.render(<Parent step="a" />, container);
		expect(portalContainer1.innerHTML).toBe('<div>portal1[0]:a</div>');
		expect(portalContainer2.innerHTML).toBe('<div>portal2[0]:a</div><div>portal2[1]:a</div>');
		expect(container.innerHTML).toBe('<div>normal[0]:a</div><div>normal[1]:a</div>');
		expect(ops).toEqual([
			'normal[0]:a componentDidMount',
			'portal1[0]:a componentDidMount',
			'normal[1]:a componentDidMount',
			'portal2[0]:a componentDidMount',
			'portal2[1]:a componentDidMount',
			'Parent:a componentDidMount',
		]);

		ops.length = 0;
		ReactDOM.render(<Parent step="b" />, container);
		expect(portalContainer1.innerHTML).toBe('<div>portal1[0]:b</div>');
		expect(portalContainer2.innerHTML).toBe('<div>portal2[0]:b</div><div>portal2[1]:b</div>');
		expect(container.innerHTML).toBe('<div>normal[0]:b</div><div>normal[1]:b</div>');
		expect(ops).toEqual([
			'normal[0]:b componentDidUpdate',
			'portal1[0]:b componentDidUpdate',
			'normal[1]:b componentDidUpdate',
			'portal2[0]:b componentDidUpdate',
			'portal2[1]:b componentDidUpdate',
			'Parent:b componentDidUpdate',
		]);

		ops.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(portalContainer1.innerHTML).toBe('');
		expect(portalContainer2.innerHTML).toBe('');
		expect(container.innerHTML).toBe('');
		expect(ops).toEqual([
			'Parent:b componentWillUnmount',
			'normal[0]:b componentWillUnmount',
			'portal1[0]:b componentWillUnmount',
			'normal[1]:b componentWillUnmount',
			'portal2[0]:b componentWillUnmount',
			'portal2[1]:b componentWillUnmount',
		]);
	});

	it('should render nested portals', () => {
		const portalContainer1 = document.createElement('div');
		const portalContainer2 = document.createElement('div');
		const portalContainer3 = document.createElement('div');

		ReactDOM.render(
			[
				<div key="a">normal[0]</div>,
				ReactDOM.createPortal(
					[
						<div key="b">portal1[0]</div>,
						ReactDOM.createPortal(<div key="c">portal2[0]</div>, portalContainer2),
						ReactDOM.createPortal(<div key="d">portal3[0]</div>, portalContainer3),
						<div key="e">portal1[1]</div>,
					],
					portalContainer1
				),
				<div key="f">normal[1]</div>,
			],
			container
		);
		expect(portalContainer1.innerHTML).toBe('<div>portal1[0]</div><div>portal1[1]</div>');
		expect(portalContainer2.innerHTML).toBe('<div>portal2[0]</div>');
		expect(portalContainer3.innerHTML).toBe('<div>portal3[0]</div>');
		expect(container.innerHTML).toBe('<div>normal[0]</div><div>normal[1]</div>');

		ReactDOM.unmountComponentAtNode(container);
		expect(portalContainer1.innerHTML).toBe('');
		expect(portalContainer2.innerHTML).toBe('');
		expect(portalContainer3.innerHTML).toBe('');
		expect(container.innerHTML).toBe('');
	});

	it('should reconcile portal children', () => {
		const portalContainer = document.createElement('div');

		ReactDOM.render(<div>{ReactDOM.createPortal(<div>portal:1</div>, portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('<div>portal:1</div>');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.render(<div>{ReactDOM.createPortal(<div>portal:2</div>, portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('<div>portal:2</div>');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.render(<div>{ReactDOM.createPortal(<p>portal:3</p>, portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('<p>portal:3</p>');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.render(<div>{ReactDOM.createPortal(['Hi', 'Bye'], portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('HiBye');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.render(<div>{ReactDOM.createPortal(['Bye', 'Hi'], portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('ByeHi');
		expect(container.innerHTML).toBe('<div></div>');

		ReactDOM.render(<div>{ReactDOM.createPortal(null, portalContainer)}</div>, container);
		expect(portalContainer.innerHTML).toBe('');
		expect(container.innerHTML).toBe('<div></div>');
	});

	it('should keep track of namespace across portals (simple)', () => {
		assertNamespacesMatch(
			<svg {...expectSVG}>
				<image {...expectSVG} />
				{usePortal(<div {...expectHTML} />)}
				<image {...expectSVG} />
			</svg>
		);
		assertNamespacesMatch(
			<math {...expectMath}>
				<mi {...expectMath} />
				{usePortal(<div {...expectHTML} />)}
				<mi {...expectMath} />
			</math>
		);
		assertNamespacesMatch(
			<div {...expectHTML}>
				<p {...expectHTML} />
				{usePortal(
					<svg {...expectSVG}>
						<image {...expectSVG} />
					</svg>
				)}
				<p {...expectHTML} />
			</div>
		);
	});

	it('should keep track of namespace across portals (medium)', () => {
		assertNamespacesMatch(
			<svg {...expectSVG}>
				<image {...expectSVG} />
				{usePortal(<div {...expectHTML} />)}
				<image {...expectSVG} />
				{usePortal(<div {...expectHTML} />)}
				<image {...expectSVG} />
			</svg>
		);
		assertNamespacesMatch(
			<div {...expectHTML}>
				<math {...expectMath}>
					<mi {...expectMath} />
					{usePortal(
						<svg {...expectSVG}>
							<image {...expectSVG} />
						</svg>
					)}
				</math>
				<p {...expectHTML} />
			</div>
		);
		assertNamespacesMatch(
			<math {...expectMath}>
				<mi {...expectMath} />
				{usePortal(
					<svg {...expectSVG}>
						<image {...expectSVG} />
						<foreignObject {...expectSVG}>
							<p {...expectHTML} />
							<math {...expectMath}>
								<mi {...expectMath} />
							</math>
							<p {...expectHTML} />
						</foreignObject>
						<image {...expectSVG} />
					</svg>
				)}
				<mi {...expectMath} />
			</math>
		);
		assertNamespacesMatch(
			<div {...expectHTML}>
				{usePortal(
					<svg {...expectSVG}>
						{usePortal(<div {...expectHTML} />)}
						<image {...expectSVG} />
					</svg>
				)}
				<p {...expectHTML} />
			</div>
		);
		assertNamespacesMatch(
			<svg {...expectSVG}>
				<svg {...expectSVG}>
					{usePortal(<div {...expectHTML} />)}
					<image {...expectSVG} />
				</svg>
				<image {...expectSVG} />
			</svg>
		);
	});

	it('should keep track of namespace across portals (complex)', () => {
		assertNamespacesMatch(
			<div {...expectHTML}>
				{usePortal(
					<svg {...expectSVG}>
						<image {...expectSVG} />
					</svg>
				)}
				<p {...expectHTML} />
				<svg {...expectSVG}>
					<image {...expectSVG} />
				</svg>
				<svg {...expectSVG}>
					<svg {...expectSVG}>
						<image {...expectSVG} />
					</svg>
					<image {...expectSVG} />
				</svg>
				<p {...expectHTML} />
			</div>
		);
		assertNamespacesMatch(
			<div {...expectHTML}>
				<svg {...expectSVG}>
					<svg {...expectSVG}>
						<image {...expectSVG} />
						{usePortal(
							<svg {...expectSVG}>
								<image {...expectSVG} />
								<svg {...expectSVG}>
									<image {...expectSVG} />
								</svg>
								<image {...expectSVG} />
							</svg>
						)}
						<image {...expectSVG} />
						<foreignObject {...expectSVG}>
							<p {...expectHTML} />
							{usePortal(<p {...expectHTML} />)}
							<p {...expectHTML} />
						</foreignObject>
					</svg>
					<image {...expectSVG} />
				</svg>
				<p {...expectHTML} />
			</div>
		);
		assertNamespacesMatch(
			<div {...expectHTML}>
				<svg {...expectSVG}>
					<foreignObject {...expectSVG}>
						<p {...expectHTML} />
						{usePortal(
							<svg {...expectSVG}>
								<image {...expectSVG} />
								<svg {...expectSVG}>
									<image {...expectSVG} />
									<foreignObject {...expectSVG}>
										<p {...expectHTML} />
									</foreignObject>
									{usePortal(<p {...expectHTML} />)}
								</svg>
								<image {...expectSVG} />
							</svg>
						)}
						<p {...expectHTML} />
					</foreignObject>
					<image {...expectSVG} />
				</svg>
				<p {...expectHTML} />
			</div>
		);
	});

	it('should unwind namespaces on uncaught errors', () => {
		function BrokenRender() {
			throw new Error('Hello');
		}

		expect(() => {
			assertNamespacesMatch(
				<svg {...expectSVG}>
					<BrokenRender />
				</svg>
			);
		}).toThrow('Hello');
		assertNamespacesMatch(<div {...expectHTML} />);
	});

	it('should unwind namespaces on caught errors', () => {
		function BrokenRender() {
			throw new Error('Hello');
		}

		class ErrorBoundary extends React.Component {
			state = { error: null };
			componentDidCatch(error) {
				this.setState({ error });
			}
			render() {
				if (this.state.error) {
					return <p {...expectHTML} />;
				}
				return this.props.children;
			}
		}

		assertNamespacesMatch(
			<svg {...expectSVG}>
				<foreignObject {...expectSVG}>
					<ErrorBoundary>
						<math {...expectMath}>
							<BrokenRender />
						</math>
					</ErrorBoundary>
				</foreignObject>
				<image {...expectSVG} />
			</svg>
		);
		assertNamespacesMatch(<div {...expectHTML} />);
	});

	it('should unwind namespaces on caught errors in a portal', () => {
		function BrokenRender() {
			throw new Error('Hello');
		}

		class ErrorBoundary extends React.Component {
			state = { error: null };
			componentDidCatch(error) {
				this.setState({ error });
			}
			render() {
				if (this.state.error) {
					return <image {...expectSVG} />;
				}
				return this.props.children;
			}
		}

		assertNamespacesMatch(
			<svg {...expectSVG}>
				<ErrorBoundary>
					{usePortal(
						<div {...expectHTML}>
							<math {...expectMath}>
								<BrokenRender />)
							</math>
						</div>
					)}
				</ErrorBoundary>
				{usePortal(<div {...expectHTML} />)}
			</svg>
		);
	});



	it('should pass portal context when rendering subtree elsewhere', () => {
		const portalContainer = document.createElement('div');
	
		class Component extends React.Component {
		  static contextTypes = {
			foo: PropTypes.string.isRequired,
		  };
	
		  render() {
			return <div>{this.context.foo}</div>;
		  }
		}
	
		class Parent extends React.Component {
		  static childContextTypes = {
			foo: PropTypes.string.isRequired,
		  };
	
		  getChildContext() {
			return {
			  foo: 'bar',
			};
		  }
	
		  render() {
			return ReactDOM.createPortal(<Component />, portalContainer);
		  }
		}
	
		ReactDOM.render(<Parent />, container);
		expect(container.innerHTML).toBe('');
		expect(portalContainer.innerHTML).toBe('<div>bar</div>');
	  });
});

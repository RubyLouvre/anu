'use strict';

let PropTypes;
let React;
let ReactDOM;
let ReactFeatureFlags;

describe('ReactErrorBoundaries', () => {
	let log;

	let BrokenConstructor;
	let BrokenComponentWillMount;
	let BrokenComponentDidMount;
	let BrokenComponentWillReceiveProps;
	let BrokenComponentWillUpdate;
	let BrokenComponentDidUpdate;
	let BrokenComponentWillUnmount;
	let BrokenRenderErrorBoundary;
	let BrokenComponentWillMountErrorBoundary;
	let BrokenComponentDidMountErrorBoundary;
	let BrokenRender;
	let ErrorBoundary;
	let ErrorMessage;
	let NoopErrorBoundary;
	let RetryErrorBoundary;
	let Normal;

	beforeEach(() => {
		jest.resetModules();
		PropTypes = require('prop-types');
		// ReactFeatureFlags = require('shared/ReactFeatureFlags');
		//  ReactFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback = false;
		ReactDOM = require('react-dom');
		React = require('react');

		log = [];

		BrokenConstructor = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenConstructor constructor [!]');
				throw new Error('Hello');
			}
			render() {
				log.push('BrokenConstructor render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenConstructor componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenConstructor componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenConstructor componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenConstructor componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenConstructor componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenConstructor componentWillUnmount');
			}
		};

		BrokenComponentWillMount = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenComponentWillMount constructor');
			}
			render() {
				log.push('BrokenComponentWillMount render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentWillMount componentWillMount [!]');
				throw new Error('Hello');
			}
			componentDidMount() {
				log.push('BrokenComponentWillMount componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentWillMount componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentWillMount componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenComponentWillMount componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenComponentWillMount componentWillUnmount');
			}
		};

		BrokenComponentDidMount = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenComponentDidMount constructor');
			}
			render() {
				log.push('BrokenComponentDidMount render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentDidMount componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentDidMount componentDidMount [!]');
				throw new Error('Hello');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentDidMount componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentDidMount componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenComponentDidMount componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenComponentDidMount componentWillUnmount');
			}
		};

		BrokenComponentWillReceiveProps = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenComponentWillReceiveProps constructor');
			}
			render() {
				log.push('BrokenComponentWillReceiveProps render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentWillReceiveProps componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentWillReceiveProps componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentWillReceiveProps componentWillReceiveProps [!]');
				throw new Error('Hello');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentWillReceiveProps componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenComponentWillReceiveProps componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenComponentWillReceiveProps componentWillUnmount');
			}
		};

		BrokenComponentWillUpdate = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenComponentWillUpdate constructor');
			}
			render() {
				log.push('BrokenComponentWillUpdate render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentWillUpdate componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentWillUpdate componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentWillUpdate componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentWillUpdate componentWillUpdate [!]');
				throw new Error('Hello');
			}
			componentDidUpdate() {
				log.push('BrokenComponentWillUpdate componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenComponentWillUpdate componentWillUnmount');
			}
		};

		BrokenComponentDidUpdate = class extends React.Component {
			static defaultProps = {
				errorText: 'Hello',
			};
			constructor(props) {
				super(props);
				log.push('BrokenComponentDidUpdate constructor');
			}
			render() {
				log.push('BrokenComponentDidUpdate render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentDidUpdate componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentDidUpdate componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentDidUpdate componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentDidUpdate componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenComponentDidUpdate componentDidUpdate [!]');
				throw new Error(this.props.errorText);
			}
			componentWillUnmount() {
				log.push('BrokenComponentDidUpdate componentWillUnmount');
			}
		};

		BrokenComponentWillUnmount = class extends React.Component {
			static defaultProps = {
				errorText: 'Hello',
			};
			constructor(props) {
				super(props);
				log.push('BrokenComponentWillUnmount constructor');
			}
			render() {
				log.push('BrokenComponentWillUnmount render');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentWillUnmount componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentWillUnmount componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenComponentWillUnmount componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenComponentWillUnmount componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenComponentWillUnmount componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenComponentWillUnmount componentWillUnmount [!]');
				throw new Error(this.props.errorText);
			}
		};

		BrokenComponentWillMountErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
				log.push('BrokenComponentWillMountErrorBoundary constructor');
			}
			render() {
				if (this.state.error) {
					log.push('BrokenComponentWillMountErrorBoundary render error');
					return <div>Caught an error: {this.state.error.message}.</div>;
				}
				log.push('BrokenComponentWillMountErrorBoundary render success');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentWillMountErrorBoundary componentWillMount [!]');
				throw new Error('Hello');
			}
			componentDidMount() {
				log.push('BrokenComponentWillMountErrorBoundary componentDidMount');
			}
			componentWillUnmount() {
				log.push('BrokenComponentWillMountErrorBoundary componentWillUnmount');
			}
			componentDidCatch(error) {
				log.push('BrokenComponentWillMountErrorBoundary componentDidCatch');
				this.setState({ error });
			}
		};

		BrokenComponentDidMountErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
				log.push('BrokenComponentDidMountErrorBoundary constructor');
			}
			render() {
				if (this.state.error) {
					log.push('BrokenComponentDidMountErrorBoundary render error');
					return <div>Caught an error: {this.state.error.message}.</div>;
				}
				log.push('BrokenComponentDidMountErrorBoundary render success');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenComponentDidMountErrorBoundary componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenComponentDidMountErrorBoundary componentDidMount [!]');
				throw new Error('Hello');
			}
			componentWillUnmount() {
				log.push('BrokenComponentDidMountErrorBoundary componentWillUnmount');
			}
			componentDidCatch(error) {
				log.push('BrokenComponentDidMountErrorBoundary componentDidCatch');
				this.setState({ error });
			}
		};

		BrokenRenderErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
				log.push('BrokenRenderErrorBoundary constructor');
			}
			render() {
				if (this.state.error) {
					log.push('BrokenRenderErrorBoundary render error [!]');
					throw new Error('Hello');
				}
				log.push('BrokenRenderErrorBoundary render success');
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenRenderErrorBoundary componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenRenderErrorBoundary componentDidMount');
			}
			componentWillUnmount() {
				log.push('BrokenRenderErrorBoundary componentWillUnmount');
			}
			componentDidCatch(error) {
				log.push('BrokenRenderErrorBoundary componentDidCatch');
				this.setState({ error });
			}
		};

		BrokenRender = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('BrokenRender constructor');
			}
			render() {
				log.push('BrokenRender render [!]');
				throw new Error('Hello');
			}
			UNSAFE_componentWillMount() {
				log.push('BrokenRender componentWillMount');
			}
			componentDidMount() {
				log.push('BrokenRender componentDidMount');
			}
			UNSAFE_componentWillReceiveProps() {
				log.push('BrokenRender componentWillReceiveProps');
			}
			UNSAFE_componentWillUpdate() {
				log.push('BrokenRender componentWillUpdate');
			}
			componentDidUpdate() {
				log.push('BrokenRender componentDidUpdate');
			}
			componentWillUnmount() {
				log.push('BrokenRender componentWillUnmount');
			}
		};

		NoopErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('NoopErrorBoundary constructor');
			}
			render() {
				log.push('NoopErrorBoundary render');
				return <BrokenRender />;
			}
			UNSAFE_componentWillMount() {
				log.push('NoopErrorBoundary componentWillMount');
			}
			componentDidMount() {
				log.push('NoopErrorBoundary componentDidMount');
			}
			componentWillUnmount() {
				log.push('NoopErrorBoundary componentWillUnmount');
			}
			componentDidCatch() {
				log.push('NoopErrorBoundary componentDidCatch');
			}
		};

		Normal = class extends React.Component {
			static defaultProps = {
				logName: 'Normal',
			};
			constructor(props) {
				super(props);
				log.push(`${this.props.logName} constructor`);
			}
			render() {
				log.push(`${this.props.logName} render`);
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				log.push(`${this.props.logName} componentWillMount`);
			}
			componentDidMount() {
				log.push(`${this.props.logName} componentDidMount`);
			}
			UNSAFE_componentWillReceiveProps() {
				log.push(`${this.props.logName} componentWillReceiveProps`);
			}
			UNSAFE_componentWillUpdate() {
				log.push(`${this.props.logName} componentWillUpdate`);
			}
			componentDidUpdate() {
				log.push(`${this.props.logName} componentDidUpdate`);
			}
			componentWillUnmount() {
				log.push(`${this.props.logName} componentWillUnmount`);
			}
		};

		ErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				this.state = { error: null };
				log.push(`${this.props.logName} constructor`);
			}
			render() {
				if (this.state.error && !this.props.forceRetry) {
					log.push(`${this.props.logName} render error`);
					return this.props.renderError(this.state.error, this.props);
				}
				log.push(`${this.props.logName} render success`);
				return <div>{this.props.children}</div>;
			}
			componentDidCatch(error) {
				log.push(`${this.props.logName} componentDidCatch`);
				this.setState({ error });
			}
			UNSAFE_componentWillMount() {
				log.push(`${this.props.logName} componentWillMount`);
			}
			componentDidMount() {
				log.push(`${this.props.logName} componentDidMount`);
			}
			UNSAFE_componentWillReceiveProps() {
				log.push(`${this.props.logName} componentWillReceiveProps`);
			}
			UNSAFE_componentWillUpdate() {
				log.push(`${this.props.logName} componentWillUpdate`);
			}
			componentDidUpdate() {
				log.push(`${this.props.logName} componentDidUpdate`);
			}
			componentWillUnmount() {
				log.push(`${this.props.logName} componentWillUnmount`);
			}
		};
		ErrorBoundary.defaultProps = {
			logName: 'ErrorBoundary',
			renderError(error, props) {
				return <div ref={props.errorMessageRef}>Caught an error: {error.message}.</div>;
			},
		};

		RetryErrorBoundary = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('RetryErrorBoundary constructor');
			}
			render() {
				log.push('RetryErrorBoundary render');
				return <BrokenRender />;
			}
			UNSAFE_componentWillMount() {
				log.push('RetryErrorBoundary componentWillMount');
			}
			componentDidMount() {
				log.push('RetryErrorBoundary componentDidMount');
			}
			componentWillUnmount() {
				log.push('RetryErrorBoundary componentWillUnmount');
			}
			componentDidCatch(error) {
				log.push('RetryErrorBoundary componentDidCatch [!]');
				// In Fiber, calling setState() (and failing) is treated as a rethrow.
				this.setState({});
			}
		};

		ErrorMessage = class extends React.Component {
			constructor(props) {
				super(props);
				log.push('ErrorMessage constructor');
			}
			UNSAFE_componentWillMount() {
				log.push('ErrorMessage componentWillMount');
			}
			componentDidMount() {
				log.push('ErrorMessage componentDidMount');
			}
			componentWillUnmount() {
				log.push('ErrorMessage componentWillUnmount');
			}
			render() {
				log.push('ErrorMessage render');
				return <div>Caught an error: {this.props.message}.</div>;
			}
		};
	});

	it('does not swallow exceptions on mounting without boundaries', () => {
		let container = document.createElement('div');
		expect(() => {
			ReactDOM.render(<BrokenRender />, container);
		}).toThrow('Hello');

		container = document.createElement('div');
		expect(() => {
			ReactDOM.render(<BrokenComponentWillMount />, container);
		}).toThrow('Hello');

		container = document.createElement('div');
		expect(() => {
			ReactDOM.render(<BrokenComponentDidMount />, container);
		}).toThrow('Hello');
	});

	it('does not swallow exceptions on updating without boundaries', () => {
		let container = document.createElement('div');
		ReactDOM.render(<BrokenComponentWillUpdate />, container);
		expect(() => {
			ReactDOM.render(<BrokenComponentWillUpdate />, container);
		}).toThrow('Hello');

		container = document.createElement('div');
		ReactDOM.render(<BrokenComponentWillReceiveProps />, container);
		expect(() => {
			ReactDOM.render(<BrokenComponentWillReceiveProps />, container);
		}).toThrow('Hello');

		container = document.createElement('div');
		ReactDOM.render(<BrokenComponentDidUpdate />, container);
		expect(() => {
			ReactDOM.render(<BrokenComponentDidUpdate />, container);
		}).toThrow('Hello');
	});

	it('does not swallow exceptions on unmounting without boundaries', () => {
		const container = document.createElement('div');
		ReactDOM.render(<BrokenComponentWillUnmount />, container);
		expect(() => {
			ReactDOM.unmountComponentAtNode(container);
		}).toThrow('Hello');
	});

	it('prevents errors from leaking into other roots', () => {
		const container1 = document.createElement('div');
		const container2 = document.createElement('div');
		const container3 = document.createElement('div');

		ReactDOM.render(<span>Before 1</span>, container1);
		expect(() => {
			ReactDOM.render(<BrokenRender />, container2);
		}).toThrow('Hello');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenRender />
			</ErrorBoundary>,
			container3,
		);
		expect(container1.firstChild.textContent).toBe('Before 1');
		expect(container2.firstChild).toBe(null);
		expect(container3.firstChild.textContent).toBe('Caught an error: Hello.');

		ReactDOM.render(<span>After 1</span>, container1);
		ReactDOM.render(<span>After 2</span>, container2);
		ReactDOM.render(
			<ErrorBoundary forceRetry={true}>After 3</ErrorBoundary>,
			container3,
		);
		expect(container1.firstChild.textContent).toBe('After 1');
		expect(container2.firstChild.textContent).toBe('After 2');
		expect(container3.firstChild.textContent).toBe('After 3');

		ReactDOM.unmountComponentAtNode(container1);
		ReactDOM.unmountComponentAtNode(container2);
		ReactDOM.unmountComponentAtNode(container3);
		expect(container1.firstChild).toBe(null);
		expect(container2.firstChild).toBe(null);
		expect(container3.firstChild).toBe(null);
	});

	it('renders an error state if child throws in render', () => {
		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenRender />
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
		expect(log).toEqual([
			'ErrorBoundary constructor',
			'ErrorBoundary componentWillMount',
			'ErrorBoundary render success',
			'BrokenRender constructor',
			'BrokenRender componentWillMount',
			'BrokenRender render [!]',
			// Fiber mounts with null children before capturing error
			'ErrorBoundary componentDidMount',
			// Catch and render an error message
			'ErrorBoundary componentDidCatch',
			'ErrorBoundary componentWillUpdate',
			'ErrorBoundary render error',
			'ErrorBoundary componentDidUpdate',
		]);

		log.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(log).toEqual(['ErrorBoundary componentWillUnmount']);
	});


	it('renders an error state if child throws in constructor', () => {
		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenConstructor />
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
		expect(log).toEqual([
			'ErrorBoundary constructor',
			'ErrorBoundary componentWillMount',
			'ErrorBoundary render success',
			'BrokenConstructor constructor [!]',
			// Fiber mounts with null children before capturing error
			'ErrorBoundary componentDidMount',
			// Catch and render an error message
			'ErrorBoundary componentDidCatch',
			'ErrorBoundary componentWillUpdate',
			'ErrorBoundary render error',
			'ErrorBoundary componentDidUpdate',
		]);

		log.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(log).toEqual(['ErrorBoundary componentWillUnmount']);
	});

	it('renders an error state if child throws in componentWillMount', () => {
		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenComponentWillMount />
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
		expect(log).toEqual([
			'ErrorBoundary constructor',
			'ErrorBoundary componentWillMount',
			'ErrorBoundary render success',
			'BrokenComponentWillMount constructor',
			'BrokenComponentWillMount componentWillMount [!]',
			'ErrorBoundary componentDidMount',
			'ErrorBoundary componentDidCatch',
			'ErrorBoundary componentWillUpdate',
			'ErrorBoundary render error',
			'ErrorBoundary componentDidUpdate',
		]);

		log.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(log).toEqual(['ErrorBoundary componentWillUnmount']);
	});


	it('renders an error state if context provider throws in componentWillMount', () => {
		class BrokenComponentWillMountWithContext extends React.Component {
			static childContextTypes = { foo: PropTypes.number };
			getChildContext() {
				return { foo: 42 };
			}
			render() {
				return <div>{this.props.children}</div>;
			}
			UNSAFE_componentWillMount() {
				throw new Error('Hello');
			}
		}

		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenComponentWillMountWithContext />
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
	});

	it('renders an error state if module-style context provider throws in componentWillMount', () => {
		function BrokenComponentWillMountWithContext() {
			return {
				getChildContext() {
					return { foo: 42 };
				},
				render() {
					return <div>{this.props.children}</div>;
				},
				UNSAFE_componentWillMount() {
					throw new Error('Hello');
				},
			};
		}
		BrokenComponentWillMountWithContext.childContextTypes = {
			foo: PropTypes.number,
		};

		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<BrokenComponentWillMountWithContext />
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
	});


	it('mounts the error message if mounting fails', () => {
		function renderError(error) {
			return <ErrorMessage message={error.message} />;
		}

		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary renderError={renderError}>
				<BrokenRender />
			</ErrorBoundary>,
			container,
		);
		expect(log).toEqual([
			'ErrorBoundary constructor',
			'ErrorBoundary componentWillMount',
			'ErrorBoundary render success',
			'BrokenRender constructor',
			'BrokenRender componentWillMount',
			'BrokenRender render [!]',
			'ErrorBoundary componentDidMount',
			'ErrorBoundary componentDidCatch',
			'ErrorBoundary componentWillUpdate',
			'ErrorBoundary render error',
			'ErrorMessage constructor',
			'ErrorMessage componentWillMount',
			'ErrorMessage render',
			'ErrorMessage componentDidMount',
			'ErrorBoundary componentDidUpdate',
		]);

		log.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(log).toEqual([
			'ErrorBoundary componentWillUnmount',
			'ErrorMessage componentWillUnmount',
		]);
	});
	it('propagates errors on retry on mounting', () => {
		const container = document.createElement('div');
		ReactDOM.render(
			<ErrorBoundary>
				<RetryErrorBoundary>
					<BrokenRender />
				</RetryErrorBoundary>
			</ErrorBoundary>,
			container,
		);
		expect(container.firstChild.textContent).toBe('Caught an error: Hello.');
		expect(log).toEqual([
			'ErrorBoundary constructor',
			'ErrorBoundary componentWillMount',
			'ErrorBoundary render success',
			'RetryErrorBoundary constructor',
			'RetryErrorBoundary componentWillMount',
			'RetryErrorBoundary render',
			'BrokenRender constructor',
			'BrokenRender componentWillMount',
			'BrokenRender render [!]',
			// In Fiber, failed error boundaries render null before attempting to recover
			'RetryErrorBoundary componentDidMount',
			'RetryErrorBoundary componentDidCatch [!]',
			'ErrorBoundary componentDidMount',
			// Retry
			'RetryErrorBoundary render',
			'BrokenRender constructor',
			'BrokenRender componentWillMount',
			'BrokenRender render [!]',
			// This time, the error propagates to the higher boundary
			'RetryErrorBoundary componentWillUnmount',
			'ErrorBoundary componentDidCatch',
			// Render the error
			'ErrorBoundary componentWillUpdate',
			'ErrorBoundary render error',
			'ErrorBoundary componentDidUpdate',
		]);

		log.length = 0;
		ReactDOM.unmountComponentAtNode(container);
		expect(log).toEqual(['ErrorBoundary componentWillUnmount']);
	});

});

import React from 'dist/React';
import sinon from 'sinon';

describe('keys', () => {
	let scratch;

	before( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		scratch.innerHTML = '';
	});

	after( () => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});

	// See developit/preact-compat#21
	it('should remove orphaned keyed nodes', () => {
		const root = React.render((
			<div>
				<div>1</div>
				<li key="a">a</li>
			</div>
		), scratch);

		React.render((
			<div>
				<div>2</div>
				<li key="b">b</li>
			</div>
		), scratch);

		expect(scratch.innerHTML.replace(/ data-reactroot=""/,'')).to.equal('<div><div>2</div><li>b</li></div>');
	});

	it('should set VNode#key property', () => {
		expect(<div />).to.have.property('key').that.is.empty;
		expect(<div a="a" />).to.have.property('key').that.is.empty;
		expect(<div key="1" />).to.have.property('key', '1');
	});

	it('should remove keyed nodes (#232)', () => {
		class App extends Component {
			componentDidMount() {
				setTimeout(() => this.setState({opened: true,loading: true}), 10);
				setTimeout(() => this.setState({opened: true,loading: false}), 20);
			}

			render() {
				return (
					<BusyIndicator id="app" busy={loading}>
						<div>This div needs to be here for this to break</div>
						{ this.state.opened && !this.state.loading && <div>{[]}</div> }
					</BusyIndicator>
				);
			}
		}

		class BusyIndicator extends Component {
			render({ children, busy }) {
				return <div class={busy ? "busy" : ""}>
					{ children && children.length ? children : <div class="busy-placeholder"></div> }
					<div class="indicator">
						<div>indicator</div>
						<div>indicator</div>
						<div>indicator</div>
					</div>
				</div>;
			}
		}

		let root;

		root = render(<App />, scratch);
		root = render(<App opened loading />, scratch);
		root = render(<App opened />, scratch);

		let html = String(root.innerHTML).replace(/ class=""/g, '');
		expect(html).to.equal('<div>This div needs to be here for this to break</div><div></div><div class="indicator"><div>indicator</div><div>indicator</div><div>indicator</div></div>');
	});
});
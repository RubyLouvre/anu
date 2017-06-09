import React from 'dist/React';
import sinon from 'sinon';

const CHILDREN_MATCHER = sinon.match( v => v==null || Array.isArray(v) && !v.length , '[empty children]');

describe('context', () => {
	let scratch;

	// before( () => {
	// 	scratch = document.createElement('div');
	// 	(document.body || document.documentElement).appendChild(scratch);
	// });	

	beforeEach( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
		scratch.innerHTML = '';
	});
	afterEach( () =>{
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	})

	// after( () => {
	// 	scratch.parentNode.removeChild(scratch);
	// 	scratch = null;
	// });

	it('should pass context to grandchildren', () => {
		const CONTEXT = { a:'a' };
		const PROPS = { b:'b' };

		class Outer extends React.Component {
			getChildContext() {
				return CONTEXT;
			}
			render() {
				return <div><Inner {...this.props} /></div>;
			}
		}
		sinon.spy(Outer.prototype, 'getChildContext');

		class Inner extends React.Component {
			
			shouldComponentUpdate() { return true; }
			componentWillReceiveProps() {}
			componentWillUpdate() {}
			componentDidUpdate() {}
			render() {
				return <div>{ this.CONTEXT && this.CONTEXT.a }</div>;
			}
		}
		sinon.spy(Inner.prototype, 'shouldComponentUpdate');
		sinon.spy(Inner.prototype, 'componentWillReceiveProps');
		sinon.spy(Inner.prototype, 'componentWillUpdate');
		sinon.spy(Inner.prototype, 'componentDidUpdate');
		sinon.spy(Inner.prototype, 'render');

        React.render(<Outer />, scratch);

		expect(Outer.prototype.getChildContext).to.have.been.calledOnce;

		expect(Inner.prototype.render).to.have.been.calledOnce;

		CONTEXT.foo = 'bar';
        React.render(<Outer {...PROPS} />, scratch);

		expect(Outer.prototype.getChildContext).to.have.been.calledTwice;

		let props = { children: CHILDREN_MATCHER, ...PROPS };
		expect(Inner.prototype.shouldComponentUpdate).to.have.been.calledOnce.and.calledWith(PROPS, {  }, CONTEXT);
		expect(Inner.prototype.componentWillReceiveProps).to.have.been.calledWith(PROPS, CONTEXT);
		expect(Inner.prototype.componentWillUpdate).to.have.been.calledWith(PROPS, {  }, CONTEXT);
		expect(Inner.prototype.componentDidUpdate).to.have.been.calledWith(PROPS, {  }, CONTEXT);
		expect(Inner.prototype.render).to.have.been.calledTwice;


		
	});

	it('should pass context to direct children', () => {
		const CONTEXT = { a:'a' };
		const PROPS = { b:'b' };
		class Outer extends React.Component {
			getChildContext() {
				return CONTEXT;
			}
			render() {
				return <Inner {...this.props} />;
			}
		}
		sinon.spy(Outer.prototype, 'getChildContext');

		class Inner extends React.Component {
			shouldComponentUpdate() { return true; }
			componentWillReceiveProps() {}
			componentWillUpdate() {}
			componentDidUpdate() {}
			render() {
				return <div>{ this.CONTEXT && this.CONTEXT.a }</div>;
			}
		}
		sinon.spy(Inner.prototype, 'shouldComponentUpdate');
		sinon.spy(Inner.prototype, 'componentWillReceiveProps');
		sinon.spy(Inner.prototype, 'componentWillUpdate');
		sinon.spy(Inner.prototype, 'componentDidUpdate');
		sinon.spy(Inner.prototype, 'render');

        React.render(<Outer />, scratch);

		expect(Outer.prototype.getChildContext).to.have.been.calledOnce;

		expect(Inner.prototype.render).to.have.been.calledOnce;

		CONTEXT.foo = 'bar';
        React.render(<Outer {...PROPS} />, scratch);

		expect(Outer.prototype.getChildContext).to.have.been.calledTwice;

		let props = { children: CHILDREN_MATCHER, ...PROPS };
		expect(Inner.prototype.shouldComponentUpdate).to.have.been.calledOnce.and.calledWith(PROPS, {}, CONTEXT);
		expect(Inner.prototype.componentWillReceiveProps).to.have.been.calledWith(PROPS, CONTEXT);
		expect(Inner.prototype.componentWillUpdate).to.have.been.calledWith(PROPS, {});
		expect(Inner.prototype.componentDidUpdate).to.have.been.calledWith(PROPS, {},CONTEXT);
		expect(Inner.prototype.render).to.have.been.calledTwice;

		//expect(Inner.prototype.render).to.have.returned(sinon.match({ children:['a'] }));
	});

	it('should preserve existing context properties when creating child contexts', () => {
		let outerContext = { outer:true },
			innerContext = { inner:true };
		class Outer extends React.Component {
			getChildContext() {
				return { outerContext };
			}
			render() {
				return <div><Inner /></div>;
			}
		}

		class Inner extends React.Component {
			getChildContext() {
				return { innerContext };
			}
			render() {
				return <InnerMost />;
			}
		}

		class InnerMost extends React.Component {
			render() {
				return <strong>test</strong>;
			}
		}

		sinon.spy(Inner.prototype, 'render');
		sinon.spy(InnerMost.prototype, 'render');

        React.render(<Outer />, scratch);
		//render(<Outer />, scratch);

		expect(Inner.prototype.render).to.have.been.calledOnce;
		expect(InnerMost.prototype.render).to.have.been.calledOnce;
	});
});
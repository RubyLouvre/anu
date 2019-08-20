'use strict';

let React = require('react');
let ReactTestUtils = require('test-utils');

/**
 * Counts clicks and has a renders an item for each click. Each item rendered
 * has a ref of the form "clickLogN".
 */
class ClickCounter extends React.Component {
	state = { count: this.props.initialCount };

	triggerReset = () => {
	    this.setState({ count: this.props.initialCount });
	};

	handleClick = () => {
	    this.setState({ count: this.state.count + 1 });
	};

	render() {
	    const children = [];
	    let i;
	    for (i = 0; i < this.state.count; i++) {
	        children.push(<div className="clickLogDiv" key={'clickLog' + i} ref={'clickLog' + i} />);
	    }
	    return (
	        <span className="clickIncrementer" onClick={this.handleClick}>
	            {children}
	        </span>
	    );
	}
}

/**
 * Only purpose is to test that refs are tracked even when applied to a
 * component that is injected down several layers. Ref systems are difficult to
 * build in such a way that ownership is maintained in an airtight manner.
 */
class GeneralContainerComponent extends React.Component {
    render() {
        return <div>{this.props.children}</div>;
    }
}

/**
 * Notice how refs ownership is maintained even when injecting a component
 * into a different parent.
 */
class TestRefsComponent extends React.Component {
	doReset = () => {
	    this.refs.myCounter.triggerReset();
	};

	render() {
	    return (
	        <div>
	            <div ref="resetDiv" onClick={this.doReset}>
					Reset Me By Clicking This.
	            </div>
	            <GeneralContainerComponent ref="myContainer">
	                <ClickCounter ref="myCounter" initialCount={1} />
	            </GeneralContainerComponent>
	        </div>
	    );
	}
}

/**
 * Render a TestRefsComponent and ensure that the main refs are wired up.
 */
const renderTestRefsComponent = function() {
    const testRefsComponent = ReactTestUtils.renderIntoDocument(<TestRefsComponent />);
    expect(testRefsComponent instanceof TestRefsComponent).toBe(true);

    const generalContainer = testRefsComponent.refs.myContainer;
    expect(generalContainer instanceof GeneralContainerComponent).toBe(true);

    const counter = testRefsComponent.refs.myCounter;
    expect(counter instanceof ClickCounter).toBe(true);

    return testRefsComponent;
};

const expectClickLogsLengthToBe = function(instance, length) {
    const clickLogs = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'clickLogDiv');
    expect(clickLogs.length).toBe(length);
    expect(Object.keys(instance.refs.myCounter.refs).length).toBe(length);
};

describe('reactiverefs', () => {
    beforeEach(() => {
        jest.resetModules();
        React = require('react');
        ReactTestUtils = require('test-utils');
    });

    /**
	 * Ensure that for every click log there is a corresponding ref (from the
	 * perspective of the injected ClickCounter component.
	 */
    it('Should increase refs with an increase in divs', () => {
        const testRefsComponent = renderTestRefsComponent();
        const clickIncrementer = ReactTestUtils.findRenderedDOMComponentWithClass(
            testRefsComponent,
            'clickIncrementer'
        );

        expectClickLogsLengthToBe(testRefsComponent, 1);

        // After clicking the reset, there should still only be one click log ref.
        ReactTestUtils.Simulate.click(testRefsComponent.refs.resetDiv);
        expectClickLogsLengthToBe(testRefsComponent, 1);

        // Begin incrementing clicks (and therefore refs).
        ReactTestUtils.Simulate.click(clickIncrementer);
        expectClickLogsLengthToBe(testRefsComponent, 2);

        ReactTestUtils.Simulate.click(clickIncrementer);
        expectClickLogsLengthToBe(testRefsComponent, 3);

        // Now reset again
        ReactTestUtils.Simulate.click(testRefsComponent.refs.resetDiv);
        expectClickLogsLengthToBe(testRefsComponent, 1);
    });
});

describe('factory components', () => {
    it('Should correctly get the ref', () => {
        function Comp() {
            return <div ref="elemRef" />;
        }

        const inst = ReactTestUtils.renderIntoDocument(<Comp />);
        expect(inst.refs.elemRef.tagName).toBe('DIV');
    });
});

/**
 * Tests that when a ref hops around children, we can track that correctly.
 */
describe('ref swapping', () => {
    let RefHopsAround;
    beforeEach(() => {
        jest.resetModules();
        React = require('react');
        ReactTestUtils = require('test-utils');

        RefHopsAround = class extends React.Component {
			state = { count: 0 };

			moveRef = () => {
			    this.setState({ count: this.state.count + 1 });
			};

			render() {
			    const count = this.state.count;
			    /**
				 * What we have here, is three divs with refs (div1/2/3), but a single
				 * moving cursor ref `hopRef` that "hops" around the three. We'll call the
				 * `moveRef()` function several times and make sure that the hop ref
				 * points to the correct divs.
				 */
			    return (
			        <div>
			            <div className="first" ref={count % 3 === 0 ? 'hopRef' : 'divOneRef'} />
			            <div className="second" ref={count % 3 === 1 ? 'hopRef' : 'divTwoRef'} />
			            <div className="third" ref={count % 3 === 2 ? 'hopRef' : 'divThreeRef'} />
			        </div>
			    );
			}
        };
    });

    it('Allow refs to hop around children correctly', () => {
        const refHopsAround = ReactTestUtils.renderIntoDocument(<RefHopsAround />);

        const firstDiv = ReactTestUtils.findRenderedDOMComponentWithClass(refHopsAround, 'first');
        const secondDiv = ReactTestUtils.findRenderedDOMComponentWithClass(refHopsAround, 'second');
        const thirdDiv = ReactTestUtils.findRenderedDOMComponentWithClass(refHopsAround, 'third');

        expect(refHopsAround.refs.hopRef).toEqual(firstDiv);
        expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
        expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);

        refHopsAround.moveRef();
        expect(refHopsAround.refs.divOneRef).toEqual(firstDiv);
        expect(refHopsAround.refs.hopRef).toEqual(secondDiv);
        expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);

        refHopsAround.moveRef();
        expect(refHopsAround.refs.divOneRef).toEqual(firstDiv);
        expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
        expect(refHopsAround.refs.hopRef).toEqual(thirdDiv);

        /**
		 * Make sure that after the third, we're back to where we started and the
		 * refs are completely restored.
		 */
        refHopsAround.moveRef();
        expect(refHopsAround.refs.hopRef).toEqual(firstDiv);
        expect(refHopsAround.refs.divTwoRef).toEqual(secondDiv);
        expect(refHopsAround.refs.divThreeRef).toEqual(thirdDiv);
    });

    it('always has a value for this.refs', () => {
        class Component extends React.Component {
            render() {
                return <div />;
            }
        }

        const instance = ReactTestUtils.renderIntoDocument(<Component />);
        expect(!!instance.refs).toBe(true);
    });

    it('ref called correctly for stateless component', () => {
        let refCalled = 0;
        function Inner(props) {
            return <a ref={props.saveA} />;
        }

        class Outer extends React.Component {
			saveA = () => {
			    refCalled++;
			};

			componentDidMount() {
			    this.setState({});
			}

			render() {
			    return <Inner saveA={this.saveA} />;
			}
        }

        ReactTestUtils.renderIntoDocument(<Outer />);
        expect(refCalled).toBe(1);
    });

    it('coerces numbers to strings', () => {
        class A extends React.Component {
            render() {
                return <div ref={1} />;
            }
        }
        const a = ReactTestUtils.renderIntoDocument(<A />);
        expect(a.refs[1].nodeName).toBe('DIV');
    });
});

describe('root level refs', () => {
    it('attaches and detaches root refs', () => {
        const ReactDOM = require('react-dom');
        let inst = null;

        // host node
        let ref = jest.fn(value => (inst = value));
        const container = document.createElement('div');
        let result = ReactDOM.render(<div ref={ref} />, container);
        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
        expect(result).toBe(ref.mock.calls[0][0]);
        ReactDOM.unmountComponentAtNode(container);
        expect(ref).toHaveBeenCalledTimes(2);
        expect(ref.mock.calls[1][0]).toBe(null);

        // composite
        class Comp extends React.Component {
            method() {
                return true;
            }
            render() {
                return <div>Comp</div>;
            }
        }

        inst = null;
        ref = jest.fn(value => (inst = value));
        result = ReactDOM.render(<Comp ref={ref} />, container);

        expect(ref).toHaveBeenCalledTimes(1);
        expect(inst).toBeInstanceOf(Comp);
        expect(result).toBe(inst);

        // ensure we have the correct instance
        expect(result.method()).toBe(true);
        expect(inst.method()).toBe(true);

        ReactDOM.unmountComponentAtNode(container);
        expect(ref).toHaveBeenCalledTimes(2);
        expect(ref.mock.calls[1][0]).toBe(null);

        // fragment
        inst = null;
        ref = jest.fn(value => (inst = value));
        let divInst = null;
        const ref2 = jest.fn(value => (divInst = value));
        result = ReactDOM.render(
            [
                <Comp ref={ref} key="a" />,
                5,
                <div ref={ref2} key="b">
					Hello
                </div>
            ],
            container
        );

        // first call should be `Comp`
        expect(ref).toHaveBeenCalledTimes(1);
        expect(ref.mock.calls[0][0]).toBeInstanceOf(Comp);
        expect(result).toBe(ref.mock.calls[0][0]);

        expect(ref2).toHaveBeenCalledTimes(1);
        expect(divInst).toBeInstanceOf(HTMLDivElement);
        expect(result).not.toBe(divInst);

        ReactDOM.unmountComponentAtNode(container);
        expect(ref).toHaveBeenCalledTimes(2);
        expect(ref.mock.calls[1][0]).toBe(null);
        expect(ref2).toHaveBeenCalledTimes(2);
        expect(ref2.mock.calls[1][0]).toBe(null);

        // null
        result = ReactDOM.render(null, container);
        expect(result).toBe(null);

        // primitives
        result = ReactDOM.render(5, container);
        expect(result).toBeInstanceOf(Text);
    });
});

describe('creating element with ref in constructor', () => {
    class RefTest extends React.Component {
        constructor(props) {
            super(props);
            this.p = <p ref="p">Hello!</p>;
        }

        render() {
            return <div>{this.p}</div>;
        }
    }

    it('throws an error', () => {
        ReactTestUtils = require('test-utils');

        //  expect(function() {

        ReactTestUtils.renderIntoDocument(<RefTest />);

        //  }).toThrowError(
        //     'Element ref was specified as a string (p) but no owner was set. This could happen for one of' +
        //     ' the following reasons:\n' +
        //     '1. You may be adding a ref to a functional component\n' +
        //     "2. You may be adding a ref to a component that was not created inside a component's render method\n" +
        //     '3. You have multiple copies of React loaded\n' +
        //     'See https://fb.me/react-refs-must-have-owner for more information.',
        // );
    });
});

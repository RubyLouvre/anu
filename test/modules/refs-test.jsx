import React from "dist/React";
import { beforeHook, afterHook, browser } from "karma-event-driver-ext/cjs/event-driver-hooks";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

//https://github.com/facebook/react/blob/master/src/renderers/dom/test/__tests__/ReactTestUtils-test.js
var ReactDOM = window.ReactDOM || React;

describe("reactiverefs", function() {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    });

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
            var children = [];
            var i;
            for (i = 0; i < this.state.count; i++) {
                children.push(<div className="clickLogDiv" key={"clickLog" + i} ref={"clickLog" + i} />);
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
    var renderTestRefsComponent = function() {
        var testRefsComponent = ReactTestUtils.renderIntoDocument(<TestRefsComponent />);
        expect(testRefsComponent instanceof TestRefsComponent).toBe(true);

        var generalContainer = testRefsComponent.refs.myContainer;
        expect(generalContainer instanceof GeneralContainerComponent).toBe(true);

        var counter = testRefsComponent.refs.myCounter;
        expect(counter instanceof ClickCounter).toBe(true);

        return testRefsComponent;
    };

    var expectClickLogsLengthToBe = function(instance, length) {
        var clickLogs = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, "clickLogDiv");
        expect(clickLogs.length).toBe(length);
        expect(Object.keys(instance.refs.myCounter.refs).length).toBe(length);
    };

    it("Should increase refs with an increase in divs", () => {
        var testRefsComponent = renderTestRefsComponent();
        var clickIncrementer = ReactTestUtils.findRenderedDOMComponentWithClass(testRefsComponent, "clickIncrementer");

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

    it("coerces numbers to strings", () => {
        class A extends React.Component {
            render() {
                return <div ref={1} />;
            }
        }
        const a = ReactTestUtils.renderIntoDocument(<A />);
        expect(a.refs[1].nodeName).toBe("DIV");
    });
});

describe("factory components", () => {
    it("Should correctly get the ref", () => {
        function Comp() {
            return <div ref="elemRef" />;
        }

        const inst = ReactTestUtils.renderIntoDocument(<Comp />);
        expect(inst.refs.elemRef.tagName).toBe("DIV");
    });
});

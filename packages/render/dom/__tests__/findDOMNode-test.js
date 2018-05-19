"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const ReactTestUtils = require("test-utils");

describe("findDOMNode", () => {
    it("findDOMNode should return null if passed null", () => {
        expect(ReactDOM.findDOMNode(null)).toBe(null);
    });
    it("findDOMNode should return null if passed undefined", () => {
        expect(ReactDOM.findDOMNode(void 666)).toBe(null);
    });

    it("findDOMNode should find dom element", () => {
        class MyNode extends React.Component {
            render() {
                return (
                    <div>
                        <span>Noise</span>
                    </div>
                );
            }
        }

        const myNode = ReactTestUtils.renderIntoDocument(<MyNode />);
        const myDiv = ReactDOM.findDOMNode(myNode);
        const mySameDiv = ReactDOM.findDOMNode(myDiv);
        expect(myDiv.tagName).toBe("DIV");
        expect(mySameDiv).toBe(myDiv);
    });

    it("findDOMNode should find dom element after an update from null", () => {
        function Bar({flag}) {
            if (flag) {
                return <span>A</span>;
            }
            return null;
        }
        class MyNode extends React.Component {
            render() {
                return <Bar flag={this.props.flag} />;
            }
        }

        const container = document.createElement("div");

        const myNodeA = ReactDOM.render(<MyNode />, container);
        const a = ReactDOM.findDOMNode(myNodeA);
        expect(a).toBe(null);

        const myNodeB = ReactDOM.render(<MyNode flag={true} />, container);
        expect(myNodeA === myNodeB).toBe(true);

        const b = ReactDOM.findDOMNode(myNodeB);
        expect(b.tagName).toBe("SPAN");
    });

    it("findDOMNode should reject random objects", () => {
        expect(function() {
            ReactDOM.findDOMNode({foo: "bar"});
        }).toThrowError(
            // 'Element appears to be neither ReactComponent nor DOMNode. Keys: foo',
        );
    });

    it("findDOMNode should reject unmounted objects with render func", () => {
        class Foo extends React.Component {
            render() {
                return <div />;
            }
        }

        const container = document.createElement("div");
        const inst = ReactDOM.render(<Foo />, container);
        ReactDOM.unmountComponentAtNode(container);
        //这里与官方不一致
        expect(() => ReactDOM.findDOMNode(inst)).not.toThrowError(
     
        );
    });

    it("findDOMNode should not throw an error when called within a component that is not mounted", () => {
        class Bar extends React.Component {
            UNSAFE_componentWillMount() {
                expect(ReactDOM.findDOMNode(this)).toBeNull();
            }

            render() {
                return <div />;
            }
        }

        expect(() => ReactTestUtils.renderIntoDocument(<Bar />)).not.toThrow();
    });
});

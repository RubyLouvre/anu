import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;
React.uuid = false;
describe("findDOMNode", function() {
    this.timeout(200000);



    it("findDOMNode should find dom element", () => {
        class MyNode extends React.Component {
            render() {
                return <div><span>Noise</span></div>;
            }
        }

        var myNode = ReactTestUtils.renderIntoDocument(<MyNode />);
        var myDiv = ReactDOM.findDOMNode(myNode);
        var mySameDiv = ReactDOM.findDOMNode(myDiv);
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

        var container = document.createElement("div");

        var myNodeA = ReactDOM.render(<MyNode />, container);
        var a = ReactDOM.findDOMNode(myNodeA);
        expect(a).toBe(null);

        var myNodeB = ReactDOM.render(<MyNode flag={true} />, container);
        expect(myNodeA === myNodeB).toBe(true);

        var b = ReactDOM.findDOMNode(myNodeB);
        expect(b.tagName).toBe("SPAN");
    });


});
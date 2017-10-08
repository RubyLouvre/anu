import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactDOMServer from "dist/ReactDOMServer";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

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
        expect(a && a.nodeType).toBe(8);

        var myNodeB = ReactDOM.render(<MyNode flag={true} />, container);
        expect(myNodeA === myNodeB).toBe(true);

        var b = ReactDOM.findDOMNode(myNodeB);
        expect(b.tagName).toBe("SPAN");
    });


});
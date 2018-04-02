import React from "dist/React";

//https://github.com/facebook/react/blob/master/src/renderers/dom/test/__tests__/ReactTestUtils-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactUpdates", function() {
    this.timeout(200000);
    var body = document.body, div;
    beforeEach(function () {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function () {
        body.removeChild(div);

    });
    /**
 * Counts clicks and has a renders an item for each click. Each item rendered
 * has a ref of the form "clickLogN".
 */
    it("should not reconcile children passed via props", () => {
        var numMiddleRenders = 0;
        var numBottomRenders = 0;

        class Top extends React.Component {
            render() {
                return <Middle><Bottom /></Middle>;
            }
        }

        class Middle extends React.Component {
            componentDidMount() {
                this.forceUpdate();
            }

            render() {
                numMiddleRenders++;
                return React.Children.only(this.props.children);
            }
        }

        class Bottom extends React.Component {
            render() {
                numBottomRenders++;
                return null;
            }
        }

        ReactDOM.render(<Top />,div);
        expect(numMiddleRenders).toBe(2);
        expect(numBottomRenders).toBe(1);
    });

});
import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactShallowRenderer from "lib/ReactShallowRenderer";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactComponent", function() {
    this.timeout(200000);

    it("should throw on invalid render targets", () => {
        var container = document.createElement("div");
        // jQuery objects are basically arrays; people often pass them in by mistake
        expect(function() {
            ReactDOM.render(<div />, [container]);
        }).toThrowError(/Target container is not a DOM element./);

        expect(function() {
            ReactDOM.render(<div />, null);
        }).toThrowError(/Target container is not a DOM element./);
    });

    it("should throw when supplying a ref outside of render method", () => {
        var instance = <div ref="badDiv" />;

        instance = ReactTestUtils.renderIntoDocument(instance);
        expect(instance.nodeName.toLowerCase()).toBe("div");
    });

    it("should warn when children are mutated during render", () => {
        function Wrapper(props) {
            props.children[1] = <p key={1} />; // Mutation is illegal
            return <div>{props.children}</div>;
        }

        var instance = ReactTestUtils.renderIntoDocument(
            <Wrapper>
                <span key={0} />
                <span key={1} />
                <span key={2} />
            </Wrapper>
        );
        expect(
            ReactTestUtils.scryRenderedDOMComponentsWithTag(instance, "p").length
        ).toBe(1);
    });
});

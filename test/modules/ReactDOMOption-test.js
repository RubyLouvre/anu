import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactDOMOption", function() {
    this.timeout(200000);

    it("should flatten children to a string", () => {
        let stub = (
            <option>
                {1} {"foo"}
            </option>
        );
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);
    
        expect(node.innerHTML).toBe("1 foo");
    });


    it("should ignore and warn invalid children types", () => {
       
        const el = (
            <option>
                {1} <div /> {2}
            </option>
        );
        const node = ReactTestUtils.renderIntoDocument(el);
        expect(node.innerHTML).toBe("1  2");
      
        
    });

    it("should ignore null/undefined/false children without warning", () => {
        let stub = (
            <option>
                {1} {false}
                {true}
                {null}
                {undefined} {2}
            </option>
        );
        stub = ReactTestUtils.renderIntoDocument(stub);
    
        const node = ReactDOM.findDOMNode(stub);
        expect(node.innerHTML).toBe("1  2");
    });
    it("should be able to use dangerouslySetInnerHTML on option", () => {
        let stub = <option dangerouslySetInnerHTML={{__html: "foobar"}} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
    
        const node = ReactDOM.findDOMNode(stub);
        expect(node.innerHTML).toBe("foobar");
    });

    it("should set attribute for empty value", () => {
        const container = document.createElement("div");
        const option = ReactDOM.render(<option value="" />, container);
        expect(option.hasAttribute("value")).toBe(true);
        expect(option.getAttribute("value")).toBe("");
    
        ReactDOM.render(<option value="lava" />, container);
        expect(option.hasAttribute("value")).toBe(true);
        expect(option.getAttribute("value")).toBe("lava");
    });
    
    it("should allow ignoring `value` on option", () => {
        const a = "a";
        let stub = (
            <select value="giraffe" onChange={() => {}}>
                <option>monkey</option>
                <option>gir{a}ffe</option>
                <option>gorill{a}</option>
            </select>
        );
        const options = stub.props.children;
        const container = document.createElement("div");
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);
    
        expect(node.selectedIndex).toBe(1);
    
        ReactDOM.render(<select value="gorilla">{options}</select>, container);
        expect(node.selectedIndex).toEqual(2);
    });
});
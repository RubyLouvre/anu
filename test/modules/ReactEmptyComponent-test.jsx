import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactEmptyComponent", function() {
    this.timeout(20000);

    
    it("should not produce child DOM nodes for null and false", function() {
       
        class Component1 extends React.Component {
            render() {
                return null;
            }
        }

        class Component2 extends React.Component {
            render() {
                return false;
            }
        }

        var container1 = document.createElement("div");
        ReactDOM.render(<Component1 />, container1);
        expect(container1.children.length).toBe(0);

        var container2 = document.createElement("div");
        ReactDOM.render(<Component2 />, container2);
        expect(container2.children.length).toBe(0);
        
    });

    it("works when switching components", function() {
        var assertions = 0;
        var div = document.createElement("div");
        class Inner extends React.Component {
            render() {
                return <span />;
            }
    
            componentDidMount() {
                // Make sure the DOM node resolves properly even if we're replacing a
                // `null` component
            
                expect(ReactDOM.findDOMNode(this).nodeName).toBe("SPAN");
                assertions++;
            }
    
            componentWillUnmount() {
                // Even though we're getting replaced by `null`, we haven't been
                // replaced yet!
                expect(ReactDOM.findDOMNode(this).nodeName).toBe("SPAN");
                assertions++;
            }
        }
    
        class Wrapper extends React.Component {
            render() {
                return this.props.showInner ? <Inner /> : null;
            }
        }
    
        var component;
    
        // Render the <Inner /> component...
        component = ReactDOM.render(<Wrapper showInner={true} />, div);
        expect(!!ReactDOM.findDOMNode(component)).toBe(true);
    
        // Switch to null...
        component = ReactDOM.render(<Wrapper showInner={false} />, div);
        expect(ReactDOM.findDOMNode(component)).toBe(null);
        // ...then switch back.
        component = ReactDOM.render(<Wrapper showInner={true} />, div);
        expect(!!ReactDOM.findDOMNode(component)).toBe(true);
    
        expect(assertions).toBe(3);
       
    });
    it("preserves the dom node during updates",function() {
        class Empty extends React.Component {
            render() {
                return null;
            }
        }

        var container = document.createElement("div");

        ReactDOM.render(<Empty />, container);
        var noscript1 = container.firstChild;
       
        expect(noscript1.nodeName).toBe("#comment");
       

        // This update shouldn't create a DOM node
        ReactDOM.render(<Empty />, container);
        var noscript2 = container.firstChild;
       
        expect(noscript2.nodeName).toBe("#comment");
       

        expect(noscript1).toBe(noscript2);
    });
});
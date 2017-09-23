import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactShallowRenderer from "lib/ReactShallowRenderer";
import ReactDOMServer from "dist/ReactDOMServer";

var createReactClass = React.createClass;
var PropTypes = React.PropTypes;

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("reconciliation", function() {
    this.timeout(200000);
    it('should update children when possible', () => {
        var container = document.createElement('div');
  
        var mockMount = spyOn.createSpy()
        var mockUpdate = spyOn.createSpy()
        var mockUnmount = spyOn.createSpy()
  
        class MockComponent extends React.Component {
          componentDidMount = mockMount;
          componentDidUpdate = mockUpdate;
          componentWillUnmount = mockUnmount;
          render() {
            return <span />;
          }
        }
  
        expect(mockMount.calls.length).toBe(0);
        expect(mockUpdate.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);
  
        ReactDOM.render(<div><MockComponent /></div>, container);
  
        expect(mockMount.calls.length).toBe(1);
        expect(mockUpdate.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);
  
        ReactDOM.render(<div><MockComponent /></div>, container);
  
        expect(mockMount.calls.length).toBe(1);
        expect(mockUpdate.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);
      });

      it('should replace children with different constructors', () => {
      var container = document.createElement('div');

      var mockMount = spyOn.createSpy()
      var mockUnmount = spyOn.createSpy()

      class MockComponent extends React.Component {
        componentDidMount = mockMount;
        componentWillUnmount = mockUnmount;
        render() {
          return <span />;
        }
      }

      expect(mockMount.calls.length).toBe(0);
      expect(mockUnmount.calls.length).toBe(0);

      ReactDOM.render(<div><MockComponent /></div>, container);

      expect(mockMount.calls.length).toBe(1);
      expect(mockUnmount.calls.length).toBe(0);

      ReactDOM.render(<div><span /></div>, container);

      expect(mockMount.calls.length).toBe(1);
      expect(mockUnmount.calls.length).toBe(1);
    });
  

});
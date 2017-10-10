import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("isEventSupported", function() {
    this.timeout(200000);


    it('should prevent non-function listeners, at dispatch', () => {
      spyOn(console, 'error');
      var node = ReactTestUtils.renderIntoDocument(
        <div onClick="not a function" />,
      );
      expect(function() {
        ReactTestUtils.SimulateNative.click(node);
      }).toThrowError(
        'Expected `onClick` listener to be a function, instead got a value of `string` type.',
      );
    });

    it('should not prevent null listeners, at dispatch', () => {
    var node = ReactTestUtils.renderIntoDocument(<div onClick={null} />);
    expect(function() {
      ReactTestUtils.SimulateNative.click(node);
    }).not.toThrow('Expected `onClick` listener to be a function, instead got a value of `null` type.');
  });


});
import React from "dist/React";
import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

//https://github.com/facebook/react/blob/master/src/renderers/dom/test/__tests__/ReactTestUtils-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactUpdates", function() {
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
it('should not reconcile children passed via props', () => {
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

    ReactTestUtils.renderIntoDocument(<Top />);
    expect(numMiddleRenders).toBe(2);
    expect(numBottomRenders).toBe(1);
  });

})
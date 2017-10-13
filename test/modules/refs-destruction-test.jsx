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



describe("refs-destruction", function() {
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
 var TestComponent = class extends React.Component {
    render() {
      return (
        <div>
          {this.props.destroy
            ? null
            : <div ref="theInnerDiv">
                Lets try to destroy this.
              </div>}
        </div>
      );
    }
  };

  it('should remove refs when destroying the parent', () => {
    var container = document.createElement('div');
    var testInstance = ReactDOM.render(<TestComponent />, container);
    expect(ReactTestUtils.isDOMComponent(testInstance.refs.theInnerDiv)).toBe(
      true,
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(1);
    ReactDOM.unmountComponentAtNode(container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toEqual(0);
  });

  it('should remove refs when destroying the child', () => {
    var container = document.createElement('div');
    var testInstance = ReactDOM.render(<TestComponent />, container);
    expect(testInstance.refs.theInnerDiv.tagName).toBe(
      "DIV",
    );
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toBe(1);
    ReactDOM.render(<TestComponent destroy={true} />, container);
    expect(
      Object.keys(testInstance.refs || {}).filter(key => testInstance.refs[key])
        .length,
    ).toBe(0);
  });

  it('should not error when destroying child with ref asynchronously', () => {
    class Modal extends React.Component {
      componentDidMount() {
        this.div = document.createElement('div');
        document.body.appendChild(this.div);
        this.componentDidUpdate();
      }

      componentDidUpdate() {
        ReactDOM.render(<div>{this.props.children}</div>, this.div);
      }

      componentWillUnmount() {
        var self = this;
        // some async animation
        setTimeout(function() {
          expect(function() {
            ReactDOM.unmountComponentAtNode(self.div);
          }).not.toThrow();
          document.body.removeChild(self.div);
        }, 0);
      }

      render() {
        return null;
      }
    }

    class AppModal extends React.Component {
      render() {
        return (
          <Modal>
            <a ref="ref" />
          </Modal>
        );
      }
    }

    class App extends React.Component {
      render() {
        return this.props.hidden ? null : <AppModal onClose={this.close} />;
      }
    }

    var container = document.createElement('div');
    ReactDOM.render(<App />, container);
    ReactDOM.render(<App hidden={true} />, container);
  });

 

})
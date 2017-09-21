import React from "dist/React";
var ReactDOM = window.ReactDOM || React;
import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";

import ReactTestUtils from "lib/ReactTestUtils";

describe("ReactTestUtils", function() {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });

  var body = document.body,
    div;
  beforeEach(function() {
    div = document.createElement("div");
    body.appendChild(div);
  });
  afterEach(function() {
    body.removeChild(div);
  });
  it("can scryRenderedDOMComponentsWithClass with TextComponent", () => {
    class Wrapper extends React.Component {
      render() {
        return (
          <div>
            Hello <span>Jim</span>
          </div>
        );
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />);
    const scryResults = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      "NonExistentClass"
    );
    expect(scryResults.length).toBe(0);
  });

  it("can scryRenderedDOMComponentsWithClass with className contains \\n", () => {
    class Wrapper extends React.Component {
      render() {
        return (
          <div>
            Hello <span className={"x\ny"}>Jim</span>
          </div>
        );
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />);
    const scryResults = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      "x"
    );
    expect(scryResults.length).toBe(1);
  });

  it("can scryRenderedDOMComponentsWithClass with multiple classes", () => {
    class Wrapper extends React.Component {
      render() {
        return (
          <div>
            Hello <span className={"x y z"}>Jim</span>
          </div>
        );
      }
    }

    const renderedComponent = ReactTestUtils.renderIntoDocument(<Wrapper />);
    const scryResults1 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      "x y"
    );
    expect(scryResults1.length).toBe(1);

    const scryResults2 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      "x z"
    );
    expect(scryResults2.length).toBe(1);

    const scryResults3 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ["x", "y"]
    );
    expect(scryResults3.length).toBe(1);

    expect(scryResults1[0]).toBe(scryResults2[0]);
    expect(scryResults1[0]).toBe(scryResults3[0]);

    const scryResults4 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ["x", "a"]
    );
    expect(scryResults4.length).toBe(0);

    const scryResults5 = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      renderedComponent,
      ["x a"]
    );
    expect(scryResults5.length).toBe(0);
  });

  it("traverses children in the correct order", () => {
    class Wrapper extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    const container = document.createElement("div");
    ReactDOM.render(
      <Wrapper>
        {null}
        <div>purple</div>
      </Wrapper>,
      container
    );
    const tree = ReactDOM.render(
      <Wrapper>
        <div>orange</div>
        <div>purple</div>
      </Wrapper>,
      container
    );

    const log = [];
    ReactTestUtils.findAllInRenderedTree(tree, function(child) {
      if (ReactTestUtils.isDOMComponent(child)) {
        log.push(ReactDOM.findDOMNode(child).textContent);
      }
    });

    // Should be document order, not mount order (which would be purple, orange)
    expect(log).toEqual(["orangepurple", "orange", "purple"]);
  });

  it("should support injected wrapper components as DOM components", () => {
    const injectedDOMComponents = [
      "button",
      "form",
      "iframe",
      "img",
      "input",
      "option",
      "select",
      "textarea"
    ];

    injectedDOMComponents.forEach(function(type) {
      const testComponent = ReactTestUtils.renderIntoDocument(
        React.createElement(type)
      );
     
      expect(testComponent.tagName).toBe(type.toUpperCase());
      expect(ReactTestUtils.isDOMComponent(testComponent)).toBe(true);
      console.log('0000')
    });
  });
});

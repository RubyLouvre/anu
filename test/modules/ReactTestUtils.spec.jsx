import React from "dist/React";
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
});

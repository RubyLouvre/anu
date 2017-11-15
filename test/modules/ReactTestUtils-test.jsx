import React from "dist/React";
import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactShallowRenderer from "lib/ReactShallowRenderer";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/renderers/dom/test/__tests__/ReactTestUtils-test.js
var ReactDOM = window.ReactDOM || React;

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
    });
    // Full-page components (html, head, body) can't be rendered into a div
    // directly...
    class Root extends React.Component {
      render() {
        return (
          <html ref="html">
            <head ref="head">
              <title>hello</title>
            </head>
            <body ref="body">hello, world</body>
          </html>
        );
      }
    }
    const markup = ReactDOMServer.renderToString(<Root />);
    const testDocument = getTestDocument(markup);
    const component = ReactDOM.render(<Root />, testDocument.body);
    expect(component.refs.html.tagName).toBe("HTML");
    expect(component.refs.head.tagName).toBe("HEAD");
    expect(component.refs.body.tagName).toBe("BODY");
    expect(ReactTestUtils.isDOMComponent(component.refs.html)).toBe(true);
    expect(ReactTestUtils.isDOMComponent(component.refs.head)).toBe(true);
    expect(ReactTestUtils.isDOMComponent(component.refs.body)).toBe(true);
  });
  it("can scry with stateless components involved", () => {
    const Stateless = () => (
      <div>
        <hr />
      </div>
    );

    class SomeComponent extends React.Component {
      render() {
        return (
          <div>
            <Stateless />
            <hr />
          </div>
        );
      }
    }

    const inst = ReactTestUtils.renderIntoDocument(<SomeComponent />);
    const hrs = ReactTestUtils.scryRenderedDOMComponentsWithTag(inst, "hr");
    expect(hrs.length).toBe(2);
  });

  it("should change the value of an input field", () => {
    const obj = {
      handler: function(e) {
        e.persist();
      }
    };
    spyOn(obj, "handler").and.callThrough();
    const container = document.createElement("div");
    const instance = ReactDOM.render(
      <input type="text" onChange={obj.handler} />,
      container
    );

    const node = ReactDOM.findDOMNode(instance);
    node.value = "giraffe";
    ReactTestUtils.Simulate.change(node);

    expect(obj.handler).toHaveBeenCalledWith({ target: node });
  });

  it("should change the value of an input field in a component", () => {
    class SomeComponent extends React.Component {
      render() {
        return (
          <div>
            <input type="text" ref="input" onChange={this.props.handleChange} />
          </div>
        );
      }
    }

    const obj = {
      handler: function(e) {
        e.persist();
      }
    };
    spyOn(obj, "handler").and.callThrough();
    const container = document.createElement("div");
    const instance = ReactDOM.render(
      <SomeComponent handleChange={obj.handler} />,
      container
    );

    const node = ReactDOM.findDOMNode(instance.refs.input);
    node.value = "zebra";
    ReactTestUtils.Simulate.change(node);

    expect(obj.handler).toHaveBeenCalledWith({ target: node });
  });

  it("should throw when attempting to use a React element", () => {
    class SomeComponent extends React.Component {
      render() {
        return <div onClick={this.props.handleClick}>hello, world.</div>;
      }
    }

    const handler = spyOn.createSpy();

    const shallowRenderer = ReactShallowRenderer();
    const result = shallowRenderer.render(
      <SomeComponent handleClick={handler} />
    );
   // "TestUtils.Simulate expected a DOM node as the first argument but received " +
   // "a React element. Pass the DOM node you wish to simulate the event on instead. " +
   // "Note that TestUtils.Simulate will not work if you are using shallow rendering."
    expect(() => ReactTestUtils.Simulate.click(result)).toThrowError(
    "第一个参数必须为元素节点"
    );
    expect(handler).toNotHaveBeenCalled();
  });

  it("should throw when attempting to use a component instance", () => {
    class SomeComponent extends React.Component {
      render() {
        return <div onClick={this.props.handleClick}>hello, world.</div>;
      }
    }

    let handler = spyOn.createSpy("spy");
    let container = document.createElement("div");
    let instance = ReactDOM.render(
      <SomeComponent handleClick={handler} />,
      container
    );
//  "TestUtils.Simulate expected a DOM node as the first argument but received " +
// "a component instance. Pass the DOM node you wish to simulate the event on instead."
    expect(() => ReactTestUtils.Simulate.click(instance)).toThrowError(
      "第一个参数必须为元素节点"
    );

    expect(handler).toNotHaveBeenCalled();
  });

  it("should not warn when used with extra properties", () => {
    spyOn(console, "error");

    const CLIENT_X = 100;

    class Component extends React.Component {
      handleClick(e) {
        expect(e.clientX).toBe(CLIENT_X);
      }

      render() {
        return <div onClick={this.handleClick} />;
      }
    }

    const element = document.createElement("div");
    const instance = ReactDOM.render(<Component />, element);
    ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(instance), {
      clientX: CLIENT_X
    });
    console.log(!!console.error.spyArgs);

    expect(console.error.spyArgs).toBe(undefined);
  });
  it("should set the type of the event", () => {
    let event;
    const stub = function(e) {
      e.persist();
      event = e;
    };

    const container = document.createElement("div");
    const instance = ReactDOM.render(<div onKeyDown={stub} />, container);
    const node = ReactDOM.findDOMNode(instance);

    ReactTestUtils.Simulate.keyDown(node);

    expect(event.type).toBe("keydown");
    expect(event.nativeEvent.type).toBe("keydown");
  });

  it("should work with renderIntoDocument", () => {
    var target;
    var i = 0;
    const onChange = spyOn.createSpy();

    class MyComponent extends React.Component {
      render() {
        return (
          <div>
            <input type="text" onChange={onChange} />
          </div>
        );
      }
    }

    const instance = ReactTestUtils.renderIntoDocument(<MyComponent />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
      instance,
      "input"
    );
    input.value = "giraffe";
    ReactTestUtils.Simulate.change(input);
    expect(onChange).toHaveBeenCalledWith({ target: input });
  });

  it("should call setState callback with no arguments", () => {
    let mockArgs;
    class Component extends React.Component {
      componentDidMount() {
        this.setState({}, (...args) => (mockArgs = args));
      }
      render() {
        return false;
      }
    }

    ReactTestUtils.renderIntoDocument(<Component />);
    expect(mockArgs.length).toEqual(0);
  });
});

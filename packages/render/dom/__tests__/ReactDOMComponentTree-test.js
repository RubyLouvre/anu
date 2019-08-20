describe("ReactDOMComponentTree", () => {
  let React;
  let ReactDOM;
  let container;

  beforeEach(() => {
    jest.resetModules();
    React = require("react");
    ReactDOM = require("react-dom");
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    //  document.body.removeChild(container);
    container = null;
  });

  it("finds nodes for instances on events", () => {
    const mouseOverID = "mouseOverID";
    const clickID = "clickID";
    let currentTargetID = null;
    // the current target of an event is set to result of getNodeFromInstance
    // when an event is dispatched so we can test behavior by invoking
    // events on elements in the tree and confirming the expected node is
    // set as the current target
    class Component extends React.Component {
      handler = e => {
        currentTargetID = e.currentTarget.id;
      };
      render() {
        return (
          <div id={mouseOverID} onMouseOver={this.handler}>
            <div id={clickID} onClick={this.handler} />
          </div>
        );
      }
    }

    function simulateMouseEvent(elem, type) {
      const event = new MouseEvent(type, {
        bubbles: true
      });
      elem.dispatchEvent(event);
    }

    const component = <Component />;
    ReactDOM.render(component, container);
    expect(currentTargetID).toBe(null);
    simulateMouseEvent(document.getElementById(mouseOverID), "mouseover");
    expect(currentTargetID).toBe(mouseOverID);
    simulateMouseEvent(document.getElementById(clickID), "click");
    expect(currentTargetID).toBe(clickID);
  });

  it("finds closest instance for node when an event happens", () => {
    const nonReactElemID = "aID";
    const innerHTML = { __html: `<div id="${nonReactElemID}"></div>` };
    const closestInstanceID = "closestInstance";
    let currentTargetID = null;

    class ClosestInstance extends React.Component {
      _onClick = e => {
        currentTargetID = e.currentTarget.id;
      };
      render() {
        return (
          <div
            id={closestInstanceID}
            onClick={this._onClick}
            dangerouslySetInnerHTML={innerHTML}
          />
        );
      }
    }

    function simulateClick(elem) {
      const event = new MouseEvent("click", {
        bubbles: true
      });
      elem.dispatchEvent(event);
    }

    const component = <ClosestInstance />;
    ReactDOM.render(<section>{component}</section>, container);
    expect(currentTargetID).toBe(null);
    simulateClick(document.getElementById(nonReactElemID));
    expect(currentTargetID).toBe(closestInstanceID);
  });

  it("updates event handlers from fiber props", () => {
    let action = "";
    let instance;
    const handlerA = () => (action = "A");
    const handlerB = () => (action = "B");

    function simulateMouseOver(target) {
      const event = new MouseEvent("mouseover", {
        bubbles: true
      });
      target.dispatchEvent(event);
    }

    class HandlerFlipper extends React.Component {
      state = { flip: false };
      flip() {
        this.setState({ flip: true });
      }
      render() {
        return (
          <div
            id="update"
            onMouseOver={this.state.flip ? handlerB : handlerA}
          />
        );
      }
    }

    ReactDOM.render(
      <HandlerFlipper key="1" ref={n => (instance = n)} />,
      container
    );
    const node = container.firstChild;
    simulateMouseOver(node);
    expect(action).toEqual("A");
    action = "";
    // Render with the other event handler.
    instance.flip();
    simulateMouseOver(node);
    expect(action).toEqual("B");
  });

  it("finds a controlled instance from node and gets its current fiber props", () => {
    const inputID = "inputID";
    const startValue = undefined;
    const finishValue = "finish";

    class Controlled extends React.Component {
      state = { value: startValue };
      a = null;
      _onChange = e => this.setState({ value: e.currentTarget.value });
      render() {
        return (
          <input
            id={inputID}
            type="text"
            ref={n => (this.a = n)}
            value={this.state.value}
            onChange={this._onChange}
          />
        );
      }
    }

    const setUntrackedInputValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    function simulateInput(elem, value) {
      const inputEvent = new Event("input", {
        bubbles: true
      });
      setUntrackedInputValue.call(elem, value);
      elem.dispatchEvent(inputEvent);
    }

    const component = <Controlled />;
    const instance = ReactDOM.render(component, container);
    expect(() => simulateInput(instance.a, finishValue)).toWarnDev(
      "Warning: A component is changing an uncontrolled input of " +
        "type text to be controlled. Input elements should not " +
        "switch from uncontrolled to controlled (or vice versa). " +
        "Decide between using a controlled or uncontrolled input " +
        "element for the lifetime of the component. More info: " +
        "https://fb.me/react-controlled-components"
    );
  });

  it("finds instance of node that is attempted to be unmounted", () => {
    const component = <div />;
    const node = ReactDOM.render(<div>{component}</div>, container);
    expect(() => ReactDOM.unmountComponentAtNode(node)).toWarnDev(
      "unmountComponentAtNode(): The node you're attempting to unmount " +
        "was rendered by React and is not a top-level container. You may " +
        "have accidentally passed in a React root node instead of its " +
        "container."
    );
  });

  it("finds instance from node to stop rendering over other react rendered components", () => {
    const component = (
      <div>
        <span>Hello</span>
      </div>
    );
    const anotherComponent = <div />;
    const instance = ReactDOM.render(component, container);
    expect(() => ReactDOM.render(anotherComponent, instance)).toWarnDev(
      "render(...): Replacing React-rendered children with a new root " +
        "component. If you intended to update the children of this node, " +
        "you should instead have the existing children update their state " +
        "and render the new components instead of calling ReactDOM.render."
    );
  });

  it("属性操作应该与插入操作提前到所有effects之前", () => {
    class DifferentParent extends React.Component {
      box = React.createRef();
      componentDidMount() {
        expect(this.box.current.parentElement.style.height).toBe("400px");
      }
      render() {
        return <div ref={this.box}>box</div>;
      }
    }
    ReactDOM.render(
      <div style={{ height: 400 }}>
        <DifferentParent />
      </div>,
      container
    );
  });
});

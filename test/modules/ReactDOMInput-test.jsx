import React from "dist/React";
import ReactDOMServer from "dist/ReactDOMServer";

import ReactTestUtils from "lib/ReactTestUtils";
var ReactDOM = window.ReactDOM || React;
function normalizeCodeLocInfo(str) {
    return str && str.replace(/\(at .+?:\d+\)/g, "(at **)");
}

function dispatchEventOnNode(node, type) {
    node.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
}
function emptyFunction(){}
var setUntrackedValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;

describe("ReactDOMInput", function() {
    this.timeout(200000);
    //受控组件分成两种，完整的受控组件与残缺的受控组件，它们都产生一个 顽固的内部 值
    it("should properly control a value even if no event listener exists", () => {
        const container = document.createElement("div");
        const stub = ReactDOM.render(<input type="text" value="lion" />, container);

        document.body.appendChild(container);

        const node = ReactDOM.findDOMNode(stub);

        setUntrackedValue.call(node, "giraffe");

        // This must use the native event dispatching. If we simulate, we will
        // bypass the lazy event attachment system so we won't actually test this.
        dispatchEventOnNode(node, "change");

        expect(node.value).toBe("lion");

        document.body.removeChild(container);
    });

    it("should control a value in reentrant events", () => {
        class ControlledInputs extends React.Component {
            state = { value: "lion" };
            a = null;
            b = null;
            switchedFocus = false;
            change(newValue) {
                this.setState({ value: newValue });
                // Calling focus here will blur the text box which causes a native
                // change event. Ideally we shouldn't have to fire this ourselves.
                // Don't remove unless you've verified the fix in #8240 is still covered.
                dispatchEventOnNode(this.a, "change");
                this.b.focus();
            }
            blur(currentValue) {
                this.switchedFocus = true;
                // currentValue should be 'giraffe' here because we should not have
                // restored it on the target yet.
                this.setState({ value: currentValue });
            }
            render() {
                return (
                    <div>
                        <input type="text" ref={n => (this.a = n)} value={this.state.value} onChange={e => this.change(e.target.value)} onBlur={e => this.blur(e.target.value)} />
                        <input type="text" ref={n => (this.b = n)} />
                    </div>
                );
            }
        }

        const container = document.createElement("div");
        const instance = ReactDOM.render(<ControlledInputs />, container);

        // We need it to be in the body to test native event dispatching.
        document.body.appendChild(container);

        // Focus the field so we can later blur it.
        // Don't remove unless you've verified the fix in #8240 is still covered.
        instance.a.focus();
        setUntrackedValue.call(instance.a, "giraffe");
        // This must use the native event dispatching. If we simulate, we will
        // bypass the lazy event attachment system so we won't actually test this.
        dispatchEventOnNode(instance.a, "change");
        dispatchEventOnNode(instance.a, "blur");

        expect(instance.a.value).toBe("giraffe");
        expect(instance.switchedFocus).toBe(true);

        document.body.removeChild(container);
    });
    it("should control values in reentrant events with different targets", () => {
        class ControlledInputs extends React.Component {
            state = { value: "lion" };
            a = null;
            b = null;
            change(newValue) {
                // This click will change the checkbox's value to false. Then it will
                // invoke an inner change event. When we finally, flush, we need to
                // reset the checkbox's value to true since that is its controlled
                // value.
                this.b.click();
            }
            render() {
                return (
                    <div>
                        <input type="text" ref={n => (this.a = n)} value="lion" onChange={e => this.change(e.target.value)} />
                        <input type="checkbox" ref={n => (this.b = n)} checked={true} onChange={() => {}} />
                    </div>
                );
            }
        }

        const container = document.createElement("div");
        const instance = ReactDOM.render(<ControlledInputs />, container);

        // We need it to be in the body to test native event dispatching.
        document.body.appendChild(container);

        setUntrackedValue.call(instance.a, "giraffe");
        // This must use the native event dispatching. If we simulate, we will
        // bypass the lazy event attachment system so we won't actually test this.
        dispatchEventOnNode(instance.a, "input");

        expect(instance.a.value).toBe("lion");
        expect(instance.b.checked).toBe(true);

        document.body.removeChild(container);
    });
});
var jest = {
    fn: function() {
        return function() {};
    }
};

describe("switching text inputs between numeric and string numbers", () => {
    it('does change the number 2 to "2.0" with no change handler', () => {
        let stub = <input type="text" value={2} onChange={null} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        node.value = "2.0";

        ReactTestUtils.Simulate.change(stub);

        expect(node.getAttribute("value")).toBe("2");
        expect(node.value).toBe("2");
    });

    it('does change the string "2" to "2.0" with no change handler', () => {
        let stub = <input type="text" value={"2"} onChange={null} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        node.value = "2.0";

        ReactTestUtils.Simulate.change(stub);

        expect(node.getAttribute("value")).toBe("2");
        expect(node.value).toBe("2");
    });

    it('changes the number 2 to "2.0" using a change handler', () => {
        class Stub extends React.Component {
            state = {
                value: 2
            };
            onChange = event => {
                this.setState({ value: event.target.value });
            };
            render() {
                const { value } = this.state;

                return <input type="text" value={value} onChange={this.onChange} />;
            }
        }

        const stub = ReactTestUtils.renderIntoDocument(<Stub />);
        const node = ReactDOM.findDOMNode(stub);

        node.value = "2.0";

        ReactTestUtils.Simulate.change(node);

        expect(node.getAttribute("value")).toBe("2.0");
        expect(node.value).toBe("2.0");
    });

    it('does change the string ".98" to "0.98" with no change handler', () => {
        class Stub extends React.Component {
            state = {
                value: ".98"
            };
            render() {
                return <input type="number" value={this.state.value} />;
            }
        }

        const stub = ReactTestUtils.renderIntoDocument(<Stub />);
        const node = ReactDOM.findDOMNode(stub);
        stub.setState({ value: "0.98" });

        expect(node.value).toEqual("0.98");
    });

    it('performs a state change from "" to 0', () => {
        class Stub extends React.Component {
            state = {
                value: ""
            };
            render() {
                return <input type="number" value={this.state.value} readOnly={true} />;
            }
        }

        const stub = ReactTestUtils.renderIntoDocument(<Stub />);
        const node = ReactDOM.findDOMNode(stub);
        stub.setState({ value: 0 });

        expect(node.value).toEqual("0");
    });

    it("distinguishes precision for extra zeroes in string number values", () => {
        class Stub extends React.Component {
            state = {
                value: "3.0000"
            };
            render() {
                return <input type="number" value={this.state.value} />;
            }
        }

        const stub = ReactTestUtils.renderIntoDocument(<Stub />);
        const node = ReactDOM.findDOMNode(stub);
        stub.setState({ value: "3" });

        expect(node.value).toEqual("3");
    });

    it("should display `defaultValue` of number 0", () => {
        let stub = <input type="text" defaultValue={0} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.getAttribute("value")).toBe("0");
        expect(node.value).toBe("0");
    });

    it("only assigns defaultValue if it changes", () => {
        class Test extends React.Component {
            render() {
                return <input defaultValue="0" />;
            }
        }

        const component = ReactTestUtils.renderIntoDocument(<Test />);
        const node = ReactDOM.findDOMNode(component);

        Object.defineProperty(node, "defaultValue", {
            get() {
                return "0";
            },
            set(value) {
                throw new Error(`defaultValue was assigned ${value}, but it did not change!`);
            }
        });

        component.forceUpdate();
    });

    it('should display "true" for `defaultValue` of `true`', () => {
        let stub = <input type="text" defaultValue={true} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("true");
    });

    it('should display "false" for `defaultValue` of `false`', () => {
        let stub = <input type="text" defaultValue={false} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("false");
    });

    it("should update `defaultValue` for uncontrolled input", () => {
        // input元素的value/defaultValue 都会产生一个value的特性
        const container = document.createElement("div");

        const node = ReactDOM.render(<input type="text" defaultValue="0" />, container);

        expect(node.value).toBe("0");

        ReactDOM.render(<input type="text" defaultValue="1" />, container);

        expect(node.value).toBe("0");
        expect(node.defaultValue).toBe("1");
    });

    it("should update `defaultValue` for uncontrolled date/time input", () => {
        const container = document.createElement("div");

        const node = ReactDOM.render(<input type="date" defaultValue="1980-01-01" />, container);

        expect(node.value).toBe("1980-01-01");

        ReactDOM.render(<input type="date" defaultValue="2000-01-01" />, container);

        expect(node.value).toBe("1980-01-01");
        expect(node.defaultValue).toBe("2000-01-01");

        ReactDOM.render(<input type="date" />, container);
    });

    it("should take `defaultValue` when changing to uncontrolled input", () => {
        const container = document.createElement("div");
        const node = ReactDOM.render(<input type="text" value="0" readOnly="true" />, container);
        expect(node.value).toBe("0");
        ReactDOM.render(<input type="text" defaultValue="1" />, container);
        expect(node.value).toBe("0");
    });

    it("should render defaultValue for SSR", () => {
        const markup = ReactDOMServer.renderToString(<input type="text" defaultValue="1" />);
        const div = document.createElement("div");
        div.innerHTML = markup;
        expect(div.firstChild.getAttribute("value")).toBe("1");
        expect(div.firstChild.getAttribute("defaultValue")).toBe(null);
    });

    it("should render value for SSR", () => {
        const element = <input type="text" value="1" onChange={() => {}} />;
        const markup = ReactDOMServer.renderToString(element);
        const div = document.createElement("div");
        div.innerHTML = markup;
        expect(div.firstChild.getAttribute("value")).toBe("1");
        expect(div.firstChild.getAttribute("defaultValue")).toBe(null);
    });

    it("should render name attribute if it is supplied", () => {
        const container = document.createElement("div");
        const node = ReactDOM.render(<input type="text" name="name" />, container);
        expect(node.name).toBe("name");
        expect(container.firstChild.getAttribute("name")).toBe("name");
    });

    it("should render name attribute if it is supplied for SSR", () => {
        const element = <input type="text" name="name" />;
        const markup = ReactDOMServer.renderToString(element);
        const div = document.createElement("div");
        div.innerHTML = markup;
        expect(div.firstChild.getAttribute("name")).toBe("name");
    });

    it("should not render name attribute if it is not supplied", () => {
        const container = document.createElement("div");
        ReactDOM.render(<input type="text" />, container);
        expect(container.firstChild.getAttribute("name")).toBe(null);
    });

    it('should not render name attribute if it is not supplied for SSR', () => {
        const element = <input type="text" />;
        const markup = ReactDOMServer.renderToString(element);
        const div = document.createElement('div');
        div.innerHTML = markup;
        expect(div.firstChild.getAttribute('name')).toBe(null);
      });
    
      it('should display "foobar" for `defaultValue` of `objToString`', () => {
        const objToString = {
          toString: function() {
            return 'foobar';
          },
        };
    
        let stub = <input type="text" defaultValue={objToString} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);
    
        expect(node.value).toBe('foobar');
      });


      it('should display `value` of number 0', () => {
        let stub = <input type="text" value={0} />;
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);
    
        expect(node.value).toBe('0');
      });
    
      it('should allow setting `value` to `true`', () => {
        const container = document.createElement('div');
        let stub = <input type="text" value="yolo" onChange={emptyFunction} />;
        const node = ReactDOM.render(stub, container);
    
        expect(node.value).toBe('yolo');
    
        stub = ReactDOM.render(
          <input type="text" value={true} onChange={emptyFunction} />,
          container,
        );
        expect(node.value).toEqual('true');
      });
    
      it('should allow setting `value` to `false`', () => {
        const container = document.createElement('div');
        let stub = <input type="text" value="yolo" onChange={emptyFunction} />;
        const node = ReactDOM.render(stub, container);
    
        expect(node.value).toBe('yolo');
    
        stub = ReactDOM.render(
          <input type="text" value={false} onChange={emptyFunction} />,
          container,
        );
        expect(node.value).toEqual('false');
      });
    
      it('should allow setting `value` to `objToString`', () => {
        const container = document.createElement('div');
        let stub = <input type="text" value="foo" onChange={emptyFunction} />;
        const node = ReactDOM.render(stub, container);
    
        expect(node.value).toBe('foo');
    
        const objToString = {
          toString: function() {
            return 'foobar';
          },
        };
        stub = ReactDOM.render(
          <input type="text" value={objToString} onChange={emptyFunction} />,
          container,
        );
        expect(node.value).toEqual('foobar');
      });
    
});

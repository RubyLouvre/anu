import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import PropTypes from "lib/ReactPropTypes";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactES6Class", function() {
    this.timeout(200000);
    var container;
    var freeze = function(expectation) {
        Object.freeze(expectation);
        return expectation;
    };
    var Inner;
    var attachedListener = null;
    var renderedName = null;
    beforeEach(() => {

        container = document.createElement("div");
        attachedListener = null;
        renderedName = null;
        Inner = class extends React.Component {
            getName() {
                return this.props.name;
            }
            render() {
                attachedListener = this.props.onClick;
                renderedName = this.props.name;
                return <div className={this.props.name} />;
            }
        };
    });
    function test(element, expectedTag, expectedClassName) {
        var instance = ReactDOM.render(element, container);
        expect(container.firstChild).not.toBeNull();
        expect(container.firstChild.tagName).toBe(expectedTag);
        expect(container.firstChild.className).toBe(expectedClassName);
        return instance;
    }

    it("preserves the name of the class for use in error messages", () => {
        class Foo extends React.Component {}
        expect(Foo.name).toBe("Foo");
    });
    it("renders a simple stateless component with prop", () => {
        class Foo extends React.Component {
            render() {
                return <Inner name={this.props.bar} />;
            }
        }
        test(<Foo bar="foo" />, "DIV", "foo");
        test(<Foo bar="bar" />, "DIV", "bar");
    });
    it("renders based on state using initial values in this.props", () => {
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.state = {bar: this.props.initialValue};
            }
            render() {
                return <span className={this.state.bar} />;
            }
        }
        test(<Foo initialValue="foo" />, "SPAN", "foo");
    });
    it("renders based on state using props in the constructor", () => {
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.state = {bar: props.initialValue};
            }
            changeState() {
                this.setState({bar: "bar"});
            }
            render() {
                if (this.state.bar === "foo") {
                    return <div className="foo" />;
                }
                return <span className={this.state.bar} />;
            }
        }
        var instance = test(<Foo initialValue="foo" />, "DIV", "foo");
        instance.changeState();
        test(<Foo />, "SPAN", "bar");
    });
    it("renders based on context in the constructor", () => {
        class Foo extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.state = {tag: context.tag, className: this.context.className};
            }
            render() {
                var Tag = this.state.tag;
                return <Tag className={this.state.className} />;
            }
        }
        Foo.contextTypes = {
            tag: PropTypes.string,
            className: PropTypes.string,
        };

        class Outer extends React.Component {
            getChildContext() {
                return {tag: "span", className: "foo"};
            }
            render() {
                return <Foo />;
            }
        }
        Outer.childContextTypes = {
            tag: PropTypes.string,
            className: PropTypes.string,
        };
        test(<Outer />, "SPAN", "foo");
    });

    it("renders only once when setting state in componentWillMount", () => {
        var renderCount = 0;
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.state = {bar: props.initialValue};
            }
            componentWillMount() {
                this.setState({bar: "bar"});
            }
            render() {
                renderCount++;
                return <span className={this.state.bar} />;
            }
        }
        test(<Foo initialValue="foo" />, "SPAN", "bar");
        expect(renderCount).toBe(1);
    });
    it("should render with null in the initial state property", () => {
        class Foo extends React.Component {
            constructor() {
                super();
                this.state = null;
            }
            render() {
                return <span />;
            }
        }
        test(<Foo />, "SPAN", "");
    });
    it("setState through an event handler", () => {
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.state = {bar: props.initialValue};
            }
            handleClick() {
                this.setState({bar: "bar"});
            }
            render() {
                return (
                    <Inner name={this.state.bar} onClick={this.handleClick.bind(this)} />
                );
            }
        }
        test(<Foo initialValue="foo" />, "DIV", "foo");
        attachedListener();
        expect(renderedName).toBe("bar");
    });
    it("should not implicitly bind event handlers", () => {
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.state = {bar: props.initialValue};
            }
            handleClick() {
                this.setState({bar: "bar"});
            }
            render() {
                return <Inner name={this.state.bar} onClick={this.handleClick} />;
            }
        }
        test(<Foo initialValue="foo" />, "DIV", "foo");
        expect(attachedListener).toThrow();
    });
    it("renders using forceUpdate even when there is no state", () => {
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.mutativeValue = props.initialValue;
            }
            handleClick() {
                this.mutativeValue = "bar";
                this.forceUpdate();
            }
            render() {
                return (
                    <Inner
                        name={this.mutativeValue}
                        onClick={this.handleClick.bind(this)}
                    />
                );
            }
        }
        test(<Foo initialValue="foo" />, "DIV", "foo");
        attachedListener();
        expect(renderedName).toBe("bar");
    });
    it("will call all the normal life cycle methods", () => {
        var lifeCycles = [];
        class Foo extends React.Component {
            constructor() {
                super();
                this.state = {};
            }
            componentWillMount() {
                lifeCycles.push("will-mount");
            }
            componentDidMount() {
                lifeCycles.push("did-mount");
            }
            componentWillReceiveProps(nextProps) {
                lifeCycles.push("receive-props", nextProps);
            }
            shouldComponentUpdate(nextProps, nextState) {
                lifeCycles.push("should-update", nextProps, nextState);
                return true;
            }
            componentWillUpdate(nextProps, nextState) {
                lifeCycles.push("will-update", nextProps, nextState);
            }
            componentDidUpdate(prevProps, prevState) {
                lifeCycles.push("did-update", prevProps, prevState);
            }
            componentWillUnmount() {
                lifeCycles.push("will-unmount");
            }
            render() {
                return <span className={this.props.value} />;
            }
        }
        test(<Foo value="foo" />, "SPAN", "foo");
        expect(lifeCycles).toEqual(["will-mount", "did-mount"]);
        lifeCycles = []; // reset
        test(<Foo value="bar" />, "SPAN", "bar");
        // prettier-ignore
        expect(lifeCycles).toEqual([
            "receive-props", freeze({value: "bar"}),
            "should-update", freeze({value: "bar"}), {},
            "will-update", freeze({value: "bar"}), {},
            "did-update", freeze({value: "foo"}), {},
        ]);
        lifeCycles = []; // reset
        ReactDOM.unmountComponentAtNode(container);
        expect(lifeCycles).toEqual(["will-unmount"]);
    });
    it("warns when classic properties are defined on the instance, but does not invoke them.", () => {
      
        var getDefaultPropsWasCalled = false;
        var getInitialStateWasCalled = false;
        class Foo extends React.Component {
            constructor() {
                super();
                this.contextTypes = {};
                this.propTypes = {};
            }
            getInitialState() {
                getInitialStateWasCalled = true;
                return {};
            }
            getDefaultProps() {
                getDefaultPropsWasCalled = true;
                return {};
            }
            render() {
                return <span className="foo" />;
            }
        }
        test(<Foo />, "SPAN", "foo");
        expect(getInitialStateWasCalled).toBe(false);
        expect(getDefaultPropsWasCalled).toBe(false);
    });

    it('does not warn about getInitialState() on class components if state is also defined.', () => {
    spyOn(console, 'error');
    class Foo extends React.Component {
      state = this.getInitialState();
      getInitialState() {
        return {};
      }
      render() {
        return <span className="foo" />;
      }
    }
    test(<Foo />, 'SPAN', 'foo');
    expect(console.error.calls.count()).toBe(0);
  });
  it('should warn when misspelling shouldComponentUpdate', () => {
   

    class NamedComponent extends React.Component {
      componentShouldUpdate() {
        return false;
      }
      render() {
        return <span className="foo" />;
      }
    }
    test(<NamedComponent />, 'SPAN', 'foo');

  });
  it('should warn when misspelling componentWillReceiveProps', () => {

    class NamedComponent extends React.Component {
      componentWillRecieveProps() {
        return false;
      }
      render() {
        return <span className="foo" />;
      }
    }
    test(<NamedComponent />, 'SPAN', 'foo');

  });
  it('supports this.context passed via getChildContext', () => {
    class Bar extends React.Component {
      render() {
        return <div className={this.context.bar} />;
      }
    }
    Bar.contextTypes = {bar: PropTypes.string};
    class Foo extends React.Component {
      getChildContext() {
        return {bar: 'bar-through-context'};
      }
      render() {
        return <Bar />;
      }
    }
    Foo.childContextTypes = {bar: PropTypes.string};
    test(<Foo />, 'DIV', 'bar-through-context');
  });

  it('supports classic refs', () => {
    class Foo extends React.Component {
      render() {
        return <Inner name="foo" ref="inner" />;
      }
    }
    var instance = test(<Foo />, 'DIV', 'foo');
    expect(instance.refs.inner.getName()).toBe('foo');
  });

  it('supports drilling through to the DOM using findDOMNode', () => {
    var instance = test(<Inner name="foo" />, 'DIV', 'foo');
    var node = ReactDOM.findDOMNode(instance);
    expect(node).toBe(container.firstChild);
  });


});
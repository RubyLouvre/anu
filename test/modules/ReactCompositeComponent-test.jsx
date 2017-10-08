import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
var shallowCompare = require("../../lib/shallowCompare");
//shallowCompare = shallowCompare.shallowCompare

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;
var PropTypes = React.PropTypes;

describe("ReactCompositeComponent", function() {
    this.timeout(200000);

    it("should support module pattern components", () => {
        function Child({ test }) {
            return {
                render() {
                    return <div>{test}</div>;
                }
            };
        }

        var el = document.createElement("div");
        ReactDOM.render(<Child test="test" />, el);

        expect(el.textContent).toBe("test");
    });

    it("should support rendering to different child types over time", () => {
        var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);
        var el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");

        instance._toggleActivatedState();
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("B");

        instance._toggleActivatedState();
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");
    });
    var MorphingComponent = class extends React.Component {
        state = { activated: false };

        _toggleActivatedState = () => {
            this.setState({ activated: !this.state.activated });
        };

        render() {
            var toggleActivatedState = this._toggleActivatedState;
            return !this.state.activated ? <a ref="x" onClick={toggleActivatedState} /> : <b ref="x" onClick={toggleActivatedState} />;
        }
    };
    it("should react to state changes from callbacks", () => {
        var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);
        var el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("A");

        ReactTestUtils.Simulate.click(el);
        el = ReactDOM.findDOMNode(instance);
        expect(el.tagName).toBe("B");
    });

    it("should rewire refs when rendering to different child types", () => {
        var instance = ReactTestUtils.renderIntoDocument(<MorphingComponent />);

        expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe("A");
        instance._toggleActivatedState();
        expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe("B");
        instance._toggleActivatedState();
        expect(ReactDOM.findDOMNode(instance.refs.x).tagName).toBe("A");
    });
    var ChildUpdates = class extends React.Component {
        getAnchor = () => {
            return this.refs.anch;
        };

        render() {
            var className = this.props.anchorClassOn ? "anchorClass" : "";
            return this.props.renderAnchor ? <a ref="anch" className={className} /> : <b />;
        }
    };
    it("should not cache old DOM nodes when switching constructors", () => {
        var container = document.createElement("div");
        var instance = ReactDOM.render(<ChildUpdates renderAnchor={true} anchorClassOn={false} />, container);
        ReactDOM.render(
            // Warm any cache
            <ChildUpdates renderAnchor={true} anchorClassOn={true} />,
            container
        );
        ReactDOM.render(
            // Clear out the anchor
            <ChildUpdates renderAnchor={false} anchorClassOn={true} />,
            container
        );
        ReactDOM.render(
            // rerender
            <ChildUpdates renderAnchor={true} anchorClassOn={false} />,
            container
        );
        expect(instance.getAnchor().className).toBe("");
    });

    it("should use default values for undefined props", () => {
        class Component extends React.Component {
            static defaultProps = { prop: "testKey" };

            render() {
                return <span />;
            }
        }

        var instance1 = ReactTestUtils.renderIntoDocument(<Component />);
        expect(instance1.props).toEqual({ prop: "testKey" });

        var instance2 = ReactTestUtils.renderIntoDocument(<Component prop={undefined} />);
        expect(instance2.props).toEqual({ prop: "testKey" });

        var instance3 = ReactTestUtils.renderIntoDocument(<Component prop={null} />);
        expect(instance3.props).toEqual({ prop: null });
    });

    it("should not mutate passed-in props object", () => {
        class Component extends React.Component {
            static defaultProps = { prop: "testKey" };

            render() {
                return <span />;
            }
        }

        var inputProps = {};
        var instance1 = <Component {...inputProps} />;
        instance1 = ReactTestUtils.renderIntoDocument(instance1);
        expect(instance1.props.prop).toBe("testKey");

        // We don't mutate the input, just in case the caller wants to do something
        // with it after using it to instantiate a component
        expect(inputProps.prop).toBe(void 666);
    });

    it("should warn about `forceUpdate` on unmounted components", () => {
        var container = document.createElement("div");
        document.body.appendChild(container);

        class Component extends React.Component {
            render() {
                return <div />;
            }
        }

        var instance = <Component />;
        expect(instance.forceUpdate).toBe(void 666);

        instance = ReactDOM.render(instance, container);
        instance.forceUpdate();

        ReactDOM.unmountComponentAtNode(container);

        instance.forceUpdate();
    });

    it("should warn about `setState` on unmounted components", () => {
        var container = document.createElement("div");
        document.body.appendChild(container);

        var renders = 0;

        class Component extends React.Component {
            state = { value: 0 };

            render() {
                renders++;
                return <div />;
            }
        }

        var instance = <Component />;
        expect(instance.setState).toBe(void 666);

        instance = ReactDOM.render(instance, container);

        expect(renders).toBe(1);

        instance.setState({ value: 1 });

        expect(renders).toBe(2);

        ReactDOM.unmountComponentAtNode(container);
        instance.setState({ value: 2 });

        expect(renders).toBe(2);
    });

    it("should silently allow `setState`, not call cb on unmounting components", () => {
        var cbCalled = false;
        var container = document.createElement("div");
        document.body.appendChild(container);

        class Component extends React.Component {
            state = { value: 0 };

            componentWillUnmount() {
                expect(() => {
                    this.setState({ value: 2 }, function() {
                        cbCalled = true;
                    });
                }).not.toThrow();
            }

            render() {
                return <div />;
            }
        }

        var instance = ReactDOM.render(<Component />, container);
        instance.setState({ value: 1 });

        ReactDOM.unmountComponentAtNode(container);
        expect(cbCalled).toBe(false);
    });

    it("should warn about `setState` in render", () => {
        spyOn(console, "error");

        var container = document.createElement("div");

        var renderedState = -1;
        var renderPasses = 0;

        class Component extends React.Component {
            state = { value: 0 };

            render() {
                renderPasses++;
                renderedState = this.state.value;
                if (this.state.value === 0) {
                    this.setState({ value: 1 });
                }
                return <div />;
            }
        }

        var instance = ReactDOM.render(<Component />, container);

        // The setState call is queued and then executed as a second pass. This
        // behavior is undefined though so we're free to change it to suit the
        // implementation details.
        expect(renderPasses).toBe(2);
        expect(renderedState).toBe(1);
        expect(instance.state.value).toBe(1);

        // Forcing a rerender anywhere will cause the update to happen.
        var instance2 = ReactDOM.render(<Component prop={123} />, container);
        expect(instance).toBe(instance2);
        expect(renderedState).toBe(1);
        expect(instance2.state.value).toBe(1);
    });

    it("should warn about `setState` in getChildContext", () => {
        spyOn(console, "error");

        var container = document.createElement("div");

        var renderPasses = 0;

        class Component extends React.Component {
            state = { value: 0 };

            getChildContext() {
                if (this.state.value === 0) {
                    this.setState({ value: 4 });
                }
            }

            render() {
                renderPasses++;
                return <div />;
            }
        }
        Component.childContextTypes = {};

        var instance = ReactDOM.render(<Component />, container);
        expect(renderPasses).toBe(2);
        expect(instance.state.value).toBe(4);
    });

    it("should call componentWillUnmount before unmounting", () => {
        var container = document.createElement("div");
        var innerUnmounted = false;

        class Component extends React.Component {
            render() {
                return (
                    <div>
                        <Inner />
                        Text
                    </div>
                );
            }
        }

        class Inner extends React.Component {
            componentWillUnmount() {
                innerUnmounted = true;
            }

            render() {
                return <div />;
            }
        }

        ReactDOM.render(<Component />, container);
        ReactDOM.unmountComponentAtNode(container);
        expect(innerUnmounted).toBe(true);
    });

    it("should warn when shouldComponentUpdate() returns undefined", () => {
        var container = document.createElement("div");
        class Component extends React.Component {
            state = { bogus: false };

            shouldComponentUpdate() {
                return undefined;
            }

            render() {
                return <div>{this.state.bogus}</div>;
            }
        }

        var instance = ReactDOM.render(<Component />, container);
        instance.setState({ bogus: true });
        expect(container.textContent).toBe(""); //布尔会转换为空字符串
    });
    //https://github.com/facebook/react/blob/master/src/renderers/__tests__/ReactCompositeComponent-test.js#L526
    it("should pass context to children when not owner", () => {
        class Parent extends React.Component {
            render() {
                return (
                    <Child>
                        <Grandchild />
                    </Child>
                );
            }
        }

        class Child extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string
            };

            getChildContext() {
                return {
                    foo: "bar"
                };
            }

            render() {
                return React.Children.only(this.props.children);
            }
        }

        class Grandchild extends React.Component {
            static contextTypes = {
                foo: PropTypes.string
            };

            render() {
                return <div>{this.context.foo}</div>;
            }
        }

        var component = ReactTestUtils.renderIntoDocument(<Parent />);
        expect(ReactDOM.findDOMNode(component).innerHTML).toBe("bar");
    });

    it("should skip update when rerendering element in container", () => {
        class Parent extends React.Component {
            render() {
                return <div>{this.props.children}</div>;
            }
        }

        var childRenders = 0;

        class Child extends React.Component {
            render() {
                childRenders++;
                return <div />;
            }
        }

        var container = document.createElement("div");
        var child = <Child />;

        ReactDOM.render(<Parent>{child}</Parent>, container);
        ReactDOM.render(<Parent>{child}</Parent>, container);
        expect(childRenders).toBe(1);
    });

    //context穿透更新
    it("should pass context when re-rendered for static child", () => {
        var parentInstance = null;
        var childInstance = null;

        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string,
                flag: PropTypes.bool
            };

            state = {
                flag: false
            };

            getChildContext() {
                return {
                    foo: "bar",
                    flag: this.state.flag
                };
            }

            render() {
                return React.Children.only(this.props.children);
            }
        }

        class Middle extends React.Component {
            render() {
                return this.props.children;
            }
        }

        class Child extends React.Component {
            static contextTypes = {
                foo: PropTypes.string,
                flag: PropTypes.bool
            };

            render() {
                childInstance = this;
                return <span>Child</span>;
            }
        }

        parentInstance = ReactTestUtils.renderIntoDocument(
            <Parent>
                <Middle>
                    <Child />
                </Middle>
            </Parent>
        );

        expect(parentInstance.state.flag).toBe(false);
        expect(childInstance.context).toEqual({ foo: "bar", flag: false });

        parentInstance.setState({ flag: true });
        expect(parentInstance.state.flag).toBe(true);
        expect(childInstance.context).toEqual({ foo: "bar", flag: true });
    });
    //context穿透更新
    it("should pass context when re-rendered for static child within a composite component", () => {
        class Parent extends React.Component {
            static childContextTypes = {
                flag: PropTypes.bool
            };

            state = {
                flag: true
            };

            getChildContext() {
                return {
                    flag: this.state.flag
                };
            }

            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Child extends React.Component {
            static contextTypes = {
                flag: PropTypes.bool
            };

            render() {
                return <div />;
            }
        }

        class Wrapper extends React.Component {
            render() {
                return (
                    <Parent ref="parent">
                        <Child ref="child" />
                    </Parent>
                );
            }
        }

        var wrapper = ReactTestUtils.renderIntoDocument(<Wrapper />);

        expect(wrapper.refs.parent.state.flag).toEqual(true);
        expect(wrapper.refs.child.context).toEqual({ flag: true });

        // We update <Parent /> while <Child /> is still a static prop relative to this update
        wrapper.refs.parent.setState({ flag: false });

        expect(wrapper.refs.parent.state.flag).toEqual(false);
        expect(wrapper.refs.child.context).toEqual({ flag: false });
    });

    it("should pass context transitively", () => {
        var childInstance = null;
        var grandchildInstance = null;

        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string,
                depth: PropTypes.number
            };

            getChildContext() {
                return {
                    foo: "bar",
                    depth: 0
                };
            }

            render() {
                return <Child />;
            }
        }

        class Child extends React.Component {
            static contextTypes = {
                foo: PropTypes.string,
                depth: PropTypes.number
            };

            static childContextTypes = {
                depth: PropTypes.number
            };

            getChildContext() {
                return {
                    depth: this.context.depth + 1
                };
            }

            render() {
                childInstance = this;
                return <Grandchild />;
            }
        }

        class Grandchild extends React.Component {
            static contextTypes = {
                foo: PropTypes.string,
                depth: PropTypes.number
            };

            render() {
                grandchildInstance = this;
                return <div />;
            }
        }

        ReactTestUtils.renderIntoDocument(<Parent />);
        expect(childInstance.context).toEqual({ foo: "bar", depth: 0 });
        expect(grandchildInstance.context).toEqual({ foo: "bar", depth: 1 });
    });

    it("should pass context when re-rendered", () => {
        var parentInstance = null;
        var childInstance = null;

        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string,
                depth: PropTypes.number
            };

            state = {
                flag: false
            };

            getChildContext() {
                return {
                    foo: "bar",
                    depth: 0
                };
            }

            render() {
                var output = <Child />;
                if (!this.state.flag) {
                    output = <span>Child</span>;
                }
                return output;
            }
        }

        class Child extends React.Component {
            static contextTypes = {
                foo: PropTypes.string,
                depth: PropTypes.number
            };

            render() {
                childInstance = this;
                return <span>Child</span>;
            }
        }

        parentInstance = ReactTestUtils.renderIntoDocument(<Parent />);
        expect(childInstance).toBeNull();

        expect(parentInstance.state.flag).toBe(false);
        /*
    ReactDOM.unstable_batchedUpdates(function() {
      parentInstance.setState({flag: true});
    });
    expect(parentInstance.state.flag).toBe(true);

    expect(childInstance.context).toEqual({foo: 'bar', depth: 0});
    */
    });

    it("unmasked context propagates through updates", () => {
        class Leaf extends React.Component {
            static contextTypes = {
                foo: PropTypes.string.isRequired
            };

            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);
            }

            shouldComponentUpdate(nextProps, nextState, nextContext) {
                expect("foo" in nextContext).toBe(true);
                return true;
            }

            render() {
                return <span>{this.context.foo}</span>;
            }
        }

        class Intermediary extends React.Component {
            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(false);
            }

            shouldComponentUpdate(nextProps, nextState, nextContext) {
                expect("foo" in nextContext).toBe(false);
                return true;
            }

            render() {
                return <Leaf />;
            }
        }

        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string
            };

            getChildContext() {
                return {
                    foo: this.props.cntxt
                };
            }

            render() {
                return <Intermediary />;
            }
        }

        var div = document.createElement("div");
        ReactDOM.render(<Parent cntxt="noise" />, div);
        expect(div.children[0].innerHTML).toBe("noise");
        div.children[0].innerHTML = "aliens";
        div.children[0].id = "aliens";
        expect(div.children[0].innerHTML).toBe("aliens");
        expect(div.children[0].id).toBe("aliens");
        ReactDOM.render(<Parent cntxt="bar" />, div);
        expect(div.children[0].innerHTML).toBe("bar");
        expect(div.children[0].id).toBe("aliens");
    });

    it("should trigger componentWillReceiveProps for context changes", () => {
        var contextChanges = 0;
        var propChanges = 0;

        class GrandChild extends React.Component {
            static contextTypes = {
                foo: PropTypes.string.isRequired
            };

            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <span className="grand-child">{this.props.children}</span>;
            }
        }

        class ChildWithContext extends React.Component {
            static contextTypes = {
                foo: PropTypes.string.isRequired
            };

            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(true);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <div className="child-with">{this.props.children}</div>;
            }
        }

        class ChildWithoutContext extends React.Component {
            componentWillReceiveProps(nextProps, nextContext) {
                expect("foo" in nextContext).toBe(false);

                if (nextProps !== this.props) {
                    propChanges++;
                }

                if (nextContext !== this.context) {
                    contextChanges++;
                }
            }

            render() {
                return <div className="child-without">{this.props.children}</div>;
            }
        }

        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string
            };

            state = {
                foo: "abc"
            };

            getChildContext() {
                return {
                    foo: this.state.foo
                };
            }

            render() {
                return <div className="parent">{this.props.children}</div>;
            }
        }

        var div = document.createElement("div");

        var parentInstance = null;
        ReactDOM.render(
            <Parent ref={inst => (parentInstance = inst)}>
                <ChildWithoutContext>
                    A1
                    <GrandChild>A2</GrandChild>
                </ChildWithoutContext>

                <ChildWithContext>
                    B1
                    <GrandChild>B2</GrandChild>
                </ChildWithContext>
            </Parent>,
            div
        );

        parentInstance.setState({
            foo: "def"
        });

        expect(propChanges).toBe(0);
        expect(contextChanges).toBe(3); // ChildWithContext, GrandChild x 2
    });

    it("only renders once if updated in componentWillReceiveProps", () => {
        var renders = 0;

        class Component extends React.Component {
            state = { updated: false };

            componentWillReceiveProps(props) {
                expect(props.update).toBe(1);
                expect(renders).toBe(1);
                this.setState({ updated: true });
                expect(renders).toBe(1);
            }

            render() {
                renders++;
                return <div />;
            }
        }

        var container = document.createElement("div");
        var instance = ReactDOM.render(<Component update={0} />, container);
        expect(renders).toBe(1);
        expect(instance.state.updated).toBe(false);
        ReactDOM.render(<Component update={1} />, container);
        expect(renders).toBe(2);
        expect(instance.state.updated).toBe(true);
    });

    it("only renders once if updated in componentWillReceiveProps when batching", () => {
        var renders = 0;

        class Component extends React.Component {
            state = { updated: false };

            componentWillReceiveProps(props) {
                expect(props.update).toBe(1);
                expect(renders).toBe(1);
                this.setState({ updated: true });
                expect(renders).toBe(1);
            }

            render() {
                renders++;
                return <div />;
            }
        }

        var container = document.createElement("div");
        var instance = ReactDOM.render(<Component update={0} />, container);
        expect(renders).toBe(1);
        expect(instance.state.updated).toBe(false);
        /*
    ReactDOM.unstable_batchedUpdates(() => {
      ReactDOM.render(<Component update={1} />, container);
    });
    expect(renders).toBe(2);
    expect(instance.state.updated).toBe(true);
    */
    });

    it("should update refs if shouldComponentUpdate gives false", () => {
        class Static extends React.Component {
            shouldComponentUpdate() {
                return false;
            }

            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Component extends React.Component {
            render() {
                if (this.props.flipped) {
                    return (
                        <div>
                            <Static ref="static0" key="B">
                                B (ignored)
                            </Static>
                            <Static ref="static1" key="A">
                                A (ignored)
                            </Static>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <Static ref="static0" key="A">
                                A
                            </Static>
                            <Static ref="static1" key="B">
                                B
                            </Static>
                        </div>
                    );
                }
            }
        }

        var container = document.createElement("div");
        var comp = ReactDOM.render(<Component flipped={false} />, container);
        //keyA <> instance0  <> static0 <> contentA
        //keyB <> instance1  <> static1 <> contentB
        expect(ReactDOM.findDOMNode(comp.refs.static0).textContent).toBe("A");
        expect(ReactDOM.findDOMNode(comp.refs.static1).textContent).toBe("B");
        //keyA <> instance0  <> static1 <> contentA
        //keyB <> instance1  <> static1 <> contentB
        // When flipping the order, the refs should update even though the actual
        // contents do not
        ReactDOM.render(<Component flipped={true} />, container);
        expect(ReactDOM.findDOMNode(comp.refs.static0).textContent).toBe("B");
        expect(ReactDOM.findDOMNode(comp.refs.static1).textContent).toBe("A");
    });

    it("should allow access to findDOMNode in componentWillUnmount", () => {
        var a = null;
        var b = null;

        class Component extends React.Component {
            componentDidMount() {
                a = ReactDOM.findDOMNode(this);
                expect(a).not.toBe(null);
            }

            componentWillUnmount() {
                b = ReactDOM.findDOMNode(this);
                expect(b).not.toBe(null);
            }

            render() {
                return <div />;
            }
        }

        var container = document.createElement("div");
        expect(a).toBe(container.firstChild);
        ReactDOM.render(<Component />, container);
        ReactDOM.unmountComponentAtNode(container);
        expect(a).toBe(b);
    });

    it("context should be passed down from the parent", () => {
        class Parent extends React.Component {
            static childContextTypes = {
                foo: PropTypes.string
            };

            getChildContext() {
                return {
                    foo: "bar"
                };
            }

            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Component extends React.Component {
            static contextTypes = {
                foo: PropTypes.string.isRequired
            };

            render() {
                return <div />;
            }
        }

        var div = document.createElement("div");
        ReactDOM.render(
            <Parent>
                <Component />
            </Parent>,
            div
        );
    });

    it("should replace state", () => {
        class Moo extends React.Component {
            state = { x: 1 };
            render() {
                return <div />;
            }
        }

        var moo = ReactTestUtils.renderIntoDocument(<Moo />);
        // No longer a public API, but we can test that it works internally by
        // reaching into the updater.
        // moo.updater.enqueueReplaceState(moo, {y: 2});
        //  expect('x' in moo.state).toBe(false);
        expect(moo.state.y).toBe(void 666);
    });

    it("should support objects with prototypes as state", () => {
        var NotActuallyImmutable = function(str) {
            this.str = str;
        };
        NotActuallyImmutable.prototype.amIImmutable = function() {
            return true;
        };
        class Moo extends React.Component {
            state = new NotActuallyImmutable("first");
            // No longer a public API, but we can test that it works internally by
            // reaching into the updater.
            _replaceState = function(a) {
                this.state = a;
                this.forceUpdate();
            };
            render() {
                return <div />;
            }
        }

        var moo = ReactTestUtils.renderIntoDocument(<Moo />);
        expect(moo.state.str).toBe("first");
        expect(moo.state.amIImmutable()).toBe(true);

        var secondState = new NotActuallyImmutable("second");
        moo._replaceState(secondState);
        expect(moo.state.str).toBe("second");
        expect(moo.state.amIImmutable()).toBe(true);
        expect(moo.state).toBe(secondState);

        moo.setState({ str: "third" });
        expect(moo.state.str).toBe("third");
        // Here we lose the prototype.
        expect(moo.state.amIImmutable).toBe(undefined);
    });
    it("props对象不能在构造器里被重写", () => {
        var container = document.createElement("div");
        class Foo extends React.Component {
            constructor(props) {
                super(props);
                this.props = { idx: "xxx" };
            }

            render() {
                return <span>{this.props.idx}</span>;
            }
        }

        ReactDOM.render(<Foo idx="aaa" />, container);

        expect(container.textContent).toBe("aaa");
    });

    it("should warn when mutated props are passed", () => {
        var container = document.createElement("div");

        class Foo extends React.Component {
            constructor(props) {
                var _props = { idx: props.idx + "!" };
                super(_props);
            }

            render() {
                return <span>{this.props.idx}</span>;
            }
        }

        ReactDOM.render(<Foo idx="qwe" />, container);

        expect(container.textContent).toBe("qwe");
    });

    it("should only call componentWillUnmount once", () => {
        var app;
        var count = 0;

        class App extends React.Component {
            render() {
                if (this.props.stage === 1) {
                    return <UnunmountableComponent />;
                } else {
                    return null;
                }
            }
        }

        class UnunmountableComponent extends React.Component {
            componentWillUnmount() {
                app.setState({});
                count++;
                throw Error("always fails");
            }

            render() {
                return <div>Hello {this.props.name}</div>;
            }
        }

        var container = document.createElement("div");

        var setRef = ref => {
            if (ref) {
                app = ref;
            }
        };

        expect(function() {
            ReactDOM.render(<App ref={setRef} stage={1} />, container);
            ReactDOM.render(<App ref={setRef} stage={2} />, container);
        }).toThrow();
        expect(count).toBe(1);
    });
    it("prepares new child before unmounting old", () => {
        var log = [];

        class Spy extends React.Component {
            componentWillMount() {
                log.push(this.props.name + " componentWillMount");
            }
            render() {
                log.push(this.props.name + " render");
                return <div />;
            }
            componentDidMount() {
                log.push(this.props.name + " componentDidMount");
            }
            componentWillUnmount() {
                log.push(this.props.name + " componentWillUnmount");
            }
        }

        class Wrapper extends React.Component {
            render() {
                return <Spy key={this.props.name} name={this.props.name} />;
            }
        }

        var container = document.createElement("div");
        ReactDOM.render(<Wrapper name="A" />, container);
        ReactDOM.render(<Wrapper name="B" />, container);

        expect(log).toEqual(["A componentWillMount", "A render", "A componentDidMount", "A componentWillUnmount", "B componentWillMount", "B render", "B componentDidMount"]);
    });

    it("respects a shallow shouldComponentUpdate implementation", () => {
        var renderCalls = 0;
        class PlasticWrap extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.state = {
                    color: "green"
                };
            }

            render() {
                return <Apple color={this.state.color} ref="apple" />;
            }
        }

        class Apple extends React.Component {
            state = {
                cut: false,
                slices: 1
            };

            shouldComponentUpdate(nextProps, nextState) {
                return shallowCompare(this, nextProps, nextState);
            }

            cut() {
                this.setState({
                    cut: true,
                    slices: 10
                });
            }

            eatSlice() {
                this.setState({
                    slices: this.state.slices - 1
                });
            }

            render() {
                renderCalls++;
                return <div />;
            }
        }

        var container = document.createElement("div");
        var instance = ReactDOM.render(<PlasticWrap />, container);
        expect(renderCalls).toBe(1);

        // Do not re-render based on props
        instance.setState({ color: "green" });
        expect(renderCalls).toBe(1);

        // Re-render based on props
        instance.setState({ color: "red" });
        expect(renderCalls).toBe(2);

        // Re-render base on state
        instance.refs.apple.cut();
        expect(renderCalls).toBe(3);

        // No re-render based on state
        instance.refs.apple.cut();
        expect(renderCalls).toBe(3);

        // Re-render based on state again
        instance.refs.apple.eatSlice();
        expect(renderCalls).toBe(4);
    });

    it("does not do a deep comparison for a shallow shouldComponentUpdate implementation", () => {
        function getInitialState() {
            return {
                foo: [1, 2, 3],
                bar: { a: 4, b: 5, c: 6 }
            };
        }

        var renderCalls = 0;
        var initialSettings = getInitialState();

        class Component extends React.Component {
            state = initialSettings;

            shouldComponentUpdate(nextProps, nextState) {
                var a = shallowCompare(this, nextProps, nextState);
                console.log(a, "!!!");
                return a;
            }

            render() {
                renderCalls++;
                return <div />;
            }
        }

        var container = document.createElement("div");
        var instance = ReactDOM.render(<Component />, container);
        expect(renderCalls).toBe(1);

        // Do not re-render if state is equal
        var settings = {
            foo: initialSettings.foo,
            bar: initialSettings.bar
        };
        instance.setState(settings);
        expect(renderCalls).toBe(1);

        // Re-render because one field changed
        initialSettings.foo = [1, 2, 3];
        instance.setState(initialSettings);
        expect(renderCalls).toBe(2);

        // Re-render because the object changed
        instance.setState(getInitialState());
        expect(renderCalls).toBe(3);
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

    it("确保子组件即便更新被阻止，新虚拟DOM也要移值旧的虚拟DOM的_hostNode过来", () => {
        class Component extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    a: 1
                };
            }
            render() {
                return <Child />;
            }
        }
        class Child extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    a: 1
                };
            }
            shouldComponentUpdate() {
                return false;
            }
            render() {
                return <div>{new Date() - 0}</div>;
            }
        }
        var b = <Component />;
        var container = document.createElement("div")
        var s = ReactDOM.render(b, container);
        expect(!!s.updater._hostNode).toBe(true)
        s.setState({a:2})
        expect(!!s.updater._hostNode).toBe(true)
    });
});

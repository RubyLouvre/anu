import React from "dist/React";
//https://github.com/facebook/react/blob/master/src/renderers/dom/test/__tests__/ReactTestUtils-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactStatelessComponent", function() {
    this.timeout(200000);

    var body = document.body,
        div;
    beforeEach(function() {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function() {
        body.removeChild(div);
    });

    function StatelessComponent(props) {
        return <div>{props.name}</div>;
    }
    it("should render stateless component", () => {
        ReactDOM.render(<StatelessComponent name="A" />, div);

        expect(div.textContent).toBe("A");
    });

    it("should update stateless component", () => {
        class Parent extends React.Component {
            render() {
                return <StatelessComponent {...this.props} />;
            }
        }

        ReactDOM.render(<Parent name="A" />, div);
        expect(div.textContent).toBe("A");

        ReactDOM.render(<Parent name="B" />, div);
        expect(div.textContent).toBe("B");
    });

    it("should unmount stateless component", () => {
        ReactDOM.render(<StatelessComponent name="A" />, div);
        expect(div.textContent).toBe("A");

        ReactDOM.unmountComponentAtNode(div);
        expect(div.textContent).toBe("");
    });

    it("should pass context thru stateless component", () => {
        class Child extends React.Component {
            static contextTypes = {
                test: React.PropTypes.string
            };

            render() {
                return <div>{this.context.test}</div>;
            }
        }

        function Parent() {
            return <Child />;
        }

        class GrandParent extends React.Component {
            static childContextTypes = {
                test: React.PropTypes.string
            };

            getChildContext() {
                return { test: this.props.test };
            }

            render() {
                return <Parent />;
            }
        }

        ReactDOM.render(<GrandParent test="test" />, div);

        expect(div.textContent).toBe("test");

        ReactDOM.render(<GrandParent test="mest" />, div);

        expect(div.textContent).toBe("mest");
    });

    it("should use correct name in key warning", () => {
        function Child() {
            return <div>{[<span>3</span>]}</div>;
        }

        var s = ReactDOM.render(<Child />, div);
        expect(ReactDOM.findDOMNode(s).textContent).toBe("3");
    });
    it("should support default props and prop types", () => {
        function Child(props) {
            return <div>{props.test}</div>;
        }
        Child.defaultProps = { test: 2 };
        Child.propTypes = { test: React.PropTypes.string };

        spyOn(console, "error");
        var s = ReactDOM.render(<Child />, div);
        expect(ReactDOM.findDOMNode(s).textContent).toBe("2");
    });
    it("should receive context", () => {
        class Parent extends React.Component {
            static childContextTypes = {
                lang: React.PropTypes.string
            };

            getChildContext() {
                return { lang: "en" };
            }

            render() {
                return <Child />;
            }
        }

        function Child(props, context) {
            return <div>{context.lang}</div>;
        }
        Child.contextTypes = { lang: React.PropTypes.string };

        ReactDOM.render(<Parent />, div);
        expect(div.textContent).toBe("en");
    });
    it("should work with arrow functions", () => {
        var Child = function() {
            return <div />;
        };
        // Will create a new bound function without a prototype, much like a native
        // arrow function.
        Child = Child.bind(this);
        var ok = true;
        try {
            ReactDOM.render(<Child />, div);
        } catch (e) {
            ok = false;
        }
        expect(ok).toBe(true);
    });

    it("should allow simple functions to return null", () => {
        var Child = function() {
            return null;
        };
        var ok = true;
        try {
            ReactDOM.render(<Child />, div);
        } catch (e) {
            ok = false;
        }
        expect(ok).toBe(true);
    });

    it("should allow simple functions to return false", () => {
        function Child() {
            return false;
        }
        var ok = true;
        try {
            ReactDOM.render(<Child />, div);
        } catch (e) {
            ok = false;
        }
        expect(ok).toBe(true);
    });
});

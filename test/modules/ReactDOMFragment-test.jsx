import React from "dist/React";
import { createReactNoop } from "lib/createReactNoop";

var ReactDOM = window.ReactDOM || React;

describe("ReactDOMFragment", function () {
    this.timeout(200000);
    var body = document.body,ReactNoop,
        div1;

   
    function span(...children) {
        return { type: "span", children: children };
    }
    function div(...children) {
        return { type: "div", children: children };
    }

    beforeEach(function () {
        div1 = document.createElement("div");
        body.appendChild(div1);
        ReactNoop = createReactNoop(div1, ReactDOM);
    });
    afterEach(function () {
        body.removeChild(div1);
    });
    it("should render a single child via noop renderer", () => {
        const element = (
            <React.Fragment>
                <span>foo</span>
            </React.Fragment>
        );

        ReactNoop.render(element);
        ReactNoop.flush();

        expect(ReactNoop.getChildren()).toEqual( [span("foo")]);
    });
    it("should render zero children via noop renderer", () => {
        const element = <React.Fragment />;

        ReactNoop.render(element);
        ReactNoop.flush();

        expect(ReactNoop.getChildren()).toEqual([]);
    });
    it("should render multiple children via noop renderer", () => {
        const element = (
            <React.Fragment>
                hello <span>world</span>
            </React.Fragment>
        );

        ReactNoop.render(element);
        ReactNoop.flush();
        expect(ReactNoop.getChildren()).toEqual(["hello ",span("world")]);
    });

    it("should render an iterable via noop renderer", () => {
        const element = (
            <React.Fragment>
                {new Set([<span key="a">hi</span>, <span key="b">bye</span>])}
            </React.Fragment>
        );
        ReactNoop.render(element);
        ReactNoop.flush();
        expect(ReactNoop.getChildren()).toEqual([ span("hi"),span("bye") ]);
    });

    it("should preserve state of children with 1 level nesting", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <Stateful key="a" />
            ) : (
                <React.Fragment>
                    <Stateful key="a" />
                    <div key="b">World</div>
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello"),div("World")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });
    it("should preserve state between top-level fragments", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>
                    <Stateful />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Stateful />
                </React.Fragment>
            );
        }


        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should preserve state of children nested at same level", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>
                    <React.Fragment>
                        <React.Fragment>
                            <Stateful key="a" />
                        </React.Fragment>
                    </React.Fragment>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <React.Fragment>
                        <React.Fragment>
                            <div />
                            <Stateful key="a" />
                        </React.Fragment>
                    </React.Fragment>
                </React.Fragment>
            );
        }


        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div(),div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should not preserve state in non-top-level fragment nesting", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>
                    <React.Fragment>
                        <Stateful key="a" />
                    </React.Fragment>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Stateful key="a" />
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should not preserve state of children if nested 2 levels without siblings", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <Stateful key="a" />
            ) : (
                <React.Fragment>
                    <React.Fragment>
                        <Stateful key="a" />
                    </React.Fragment>
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

    });
    it("should not preserve state of children if nested 2 levels with siblings", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <Stateful key="a" />
            ) : (
                <React.Fragment>
                    <React.Fragment>
                        <Stateful key="a" />
                    </React.Fragment>
                    <div />
                </React.Fragment>
            );
        }


        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello"),div()]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

    });

    it("should preserve state between array nested in fragment and fragment", function () {


        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>
                    <Stateful key="a" />
                </React.Fragment>
            ) : (
                <React.Fragment>{[<Stateful key="a" />]}</React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should preserve state between top level fragment and array", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                [<Stateful key="a" />]
            ) : (
                <React.Fragment>
                    <Stateful key="a" />
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should not preserve state between array nested in fragment and double nested fragment", function () {

        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }


        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>{[<Stateful key="a" />]}</React.Fragment>
            ) : (
                <React.Fragment>
                    <React.Fragment>
                        <Stateful key="a" />
                    </React.Fragment>
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
         
    });
    it("should not preserve state between array nested in fragment and double nested array", function () {

        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }


        function Foo({ condition }) {
            return condition ? (
                <React.Fragment>{[<Stateful key="a" />]}</React.Fragment>
            ) : (
                [[<Stateful key="a" />]]
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

    });


    it("should not preserve state of children when the keys are different", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment key="a">
                    <Stateful />
                </React.Fragment>
            ) : (
                <React.Fragment key="b">
                    <Stateful />
                    <div>World</div>
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello"),div("World")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });


    it("should not preserve state between unkeyed and keyed fragment", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <React.Fragment key="a">
                    <Stateful />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Stateful />
                </React.Fragment>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([div("Hello")]);
    });

    it("should preserve state with reordering in multiple levels", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <div>
                    <React.Fragment key="c">
                        <span>foo</span>
                        <div key="b">
                            <Stateful key="a" />
                        </div>
                    </React.Fragment>
                    <span>boop</span>
                </div>
            ) : (
                <div>
                    <span>beep</span>
                    <React.Fragment key="c">
                        <div key="b">
                            <Stateful key="a" />
                        </div>
                        <span>bar</span>
                    </React.Fragment>
                </div>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div( span("beep"), div(div("Hello")), span("bar") )]);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([div( span("foo"), div(div("Hello")), span("boop") )]);

    });


    it("should not preserve state when switching to a keyed fragment to an array", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition ? (
                <div>
                    {
                        <React.Fragment key="foo">
                            <Stateful />
                        </React.Fragment>
                    }
                    <span />
                </div>
            ) : (
                <div>
                    {[<Stateful />]}
                    <span />
                </div>
            );
        }

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        ReactNoop.render(<Foo condition={false} />);

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([ div( div("Hello"), span() ) ]);


        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual([ div( div("Hello"), span() ) ]);

    });

    it("should preserve state when it does not change positions", function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }

            render() {
                return <div>Hello</div>;
            }
        }

        function Foo({ condition }) {
            return condition
                ? [
                    <span />,
                    <React.Fragment>
                        <Stateful />
                    </React.Fragment>,
                ]
                : [
                    <span />,
                    <React.Fragment>
                        <Stateful />
                    </React.Fragment>,
                ];
        }

        ReactNoop.render(<Foo condition={true} />);


        ReactNoop.render(<Foo condition={false} />);


        expect(ops).toEqual(["Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([ span(), div("Hello") ]);


        ReactNoop.render(<Foo condition={true} />);


        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(ReactNoop.getChildren()).toEqual([ span(), div("Hello") ]);


    });
});
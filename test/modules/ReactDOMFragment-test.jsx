import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
var ReactDOM = window.ReactDOM || React;

describe("ReactDOMFragment", function () {
    this.timeout(200000);
    var body = document.body,
        div;
    var ReactNoop = {
        render(vdom) {
            ReactDOM.render(vdom, div);
        },
        flush() { },
        getChildren() {

            return div.getElementsByTagName("div").length;
        },
        getText() {
            return div.innerHTML.toLowerCase();
        }
    }
    beforeEach(function () {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function () {
        body.removeChild(div);
    });
    it("should render a single child via noop renderer", () => {
        const element = (
            <React.Fragment>
                <span>foo</span>
            </React.Fragment>
        );

        ReactNoop.render(element);
        ReactNoop.flush();

        expect(ReactNoop.getText()).toEqual("<span>foo</span>");
    });
    it("should render zero children via noop renderer", () => {
        const element = <React.Fragment />;

        ReactNoop.render(element);
        ReactNoop.flush();

        expect(ReactNoop.getText()).toEqual("");
    });
    it("should render multiple children via noop renderer", () => {
        const element = (
            <React.Fragment>
                hello <span>world</span>
            </React.Fragment>
        );

        ReactNoop.render(element);
        ReactNoop.flush();
        expect(ReactNoop.getText()).toEqual("hello <span>world</span>");
    });

    it("should render an iterable via noop renderer", () => {
        const element = (
            <React.Fragment>
                {new Set([<span key="a">hi</span>, <span key="b">bye</span>])}
            </React.Fragment>
        );
        ReactNoop.render(element);
        ReactNoop.flush();

        expect(ReactNoop.getText()).toBe("<span>hi</span><span>bye</span>");
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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(2);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);
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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);
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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(2);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);
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
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);
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
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);

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
        expect(ReactNoop.getChildren()).toEqual(2);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);

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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);
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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getChildren()).toEqual(1);
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
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);
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
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);

    });


    it('should not preserve state of children when the keys are different', function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push('Update Stateful');
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
        expect(ReactNoop.getChildren()).toEqual(2);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);
    });


    it('should not preserve state between unkeyed and keyed fragment', function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push('Update Stateful');
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
        expect(ReactNoop.getChildren()).toEqual(1);

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getChildren()).toEqual(1);
    });

    it('should preserve state with reordering in multiple levels', function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push('Update Stateful');
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

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getText()).toEqual("<div><span>beep</span><div><div>hello</div></div><span>bar</span></div>");

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getText()).toEqual("<div><span>foo</span><div><div>hello</div></div><span>boop</span></div>");
    });


    it('should not preserve state when switching to a keyed fragment to an array', function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push('Update Stateful');
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
        expect(ReactNoop.getText()).toEqual("<div><div>hello</div><span></span></div>");

        ReactNoop.render(<Foo condition={true} />);
        ReactNoop.flush();

        expect(ops).toEqual([]);
        expect(ReactNoop.getText()).toEqual("<div><div>hello</div><span></span></div>");
    });

    it('should preserve state when it does not change positions', function () {
        const ops = [];

        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push('Update Stateful');
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
      

        expect(ops).toEqual(['Update Stateful']);
        expect(ReactNoop.getText()).toEqual("<span></span><div>hello</div>");

        ReactNoop.render(<Foo condition={true} />);


        expect(ops).toEqual(['Update Stateful', 'Update Stateful']);
        expect(ReactNoop.getText()).toEqual("<span></span><div>hello</div>");

    });
});
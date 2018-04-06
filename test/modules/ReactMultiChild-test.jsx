import React from "dist/React";
//import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

var createReactClass = React.createClass;
var PropTypes = React.PropTypes;

//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactMultiChild", function() {
    this.timeout(200000);
    it("should update children when possible", () => {
        var container = document.createElement("div");

        var mockMount = spyOn.createSpy()
        var mockUpdate = spyOn.createSpy();
        var mockUnmount = spyOn.createSpy();

        class MockComponent extends React.Component {
            componentDidMount = mockMount;
            componentDidUpdate = mockUpdate;
            componentWillUnmount = mockUnmount;
            render() {
                return <span />;
            }
        }

        expect(mockMount.calls.length).toBe(0);
        expect(mockUpdate.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <MockComponent />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUpdate.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <MockComponent />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUpdate.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);
    });
    var LetterInner = class extends React.Component {
        render() {
            return <div>{this.props.char}</div>;
        }
    };

    var Letter = class extends React.Component {
        render() {
            return <LetterInner char={this.props.char} />;
        }
        shouldComponentUpdate() {
            return false;
        }
    };

    var Letters = class extends React.Component {
        render() {
            const letters = this.props.letters.split("");
            return <div>{letters.map(c => <Letter key={c} char={c} />)}</div>;
        }
    };
    
    it("should replace children with different constructors", () => {
        var container = document.createElement("div");

        var mockMount = spyOn.createSpy();
        var mockUnmount = spyOn.createSpy();

        class MockComponent extends React.Component {
            componentDidMount = mockMount;
            componentWillUnmount = mockUnmount;
            render() {
                return <span />;
            }
        }

        expect(mockMount.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <MockComponent />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <span />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(1);
    });

    it("should NOT replace children with different owners", () => {
        var container = document.createElement("div");

        var mockMount = spyOn.createSpy();
        var mockUnmount = spyOn.createSpy();

        class MockComponent extends React.Component {
            componentDidMount = mockMount;
            componentWillUnmount = mockUnmount;
            render() {
                return <span />;
            }
        }

        class WrapperComponent extends React.Component {
            render() {
                return this.props.children || <MockComponent />;
            }
        }

        expect(mockMount.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(<WrapperComponent />, container);

        expect(mockMount.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <WrapperComponent>
                <MockComponent />
            </WrapperComponent>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);
    });
    it("should replace children with different keys", () => {
        var container = document.createElement("div");

        var mockMount = spyOn.createSpy();
        var mockUnmount = spyOn.createSpy();

        class MockComponent extends React.Component {
            componentDidMount = mockMount;
            componentWillUnmount = mockUnmount;
            render() {
                return <span />;
            }
        }

        expect(mockMount.calls.length).toBe(0);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <MockComponent key="A" />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(1);
        expect(mockUnmount.calls.length).toBe(0);

        ReactDOM.render(
            <div>
                <MockComponent key="B" />
            </div>,
            container
        );

        expect(mockMount.calls.length).toBe(2);
        expect(mockUnmount.calls.length).toBe(1);
    });

    it("should warn for duplicated array keys with component stack info", () => {
        class WrapperComponent extends React.Component {
            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Parent extends React.Component {
            render() {
                return (
                    <div>
                        <WrapperComponent>{this.props.children}</WrapperComponent>
                    </div>
                );
            }
        }

        var instance = ReactTestUtils.renderIntoDocument(<Parent>{[<div className="child" />]}</Parent>);
        var array = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, "child");
        expect(array.length).toBe(1);

        var instance2 = ReactTestUtils.renderIntoDocument(<Parent>{[<div className="aaa" />, <div className="aaa" />]}</Parent>);
        var array2 = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance2, "aaa");
        expect(array2.length).toBe(2);
    });

    it("should warn for duplicated iterable keys with component stack info", () => {
        class WrapperComponent extends React.Component {
            render() {
                return <div>{this.props.children}</div>;
            }
        }

        class Parent extends React.Component {
            render() {
                return (
                    <div>
                        <WrapperComponent>{this.props.children}</WrapperComponent>
                    </div>
                );
            }
        }

        function createIterable(array) {
            return {
                "@@iterator": function() {
                    var i = 0;
                    return {
                        next() {
                            const next = {
                                value: i < array.length ? array[i] : undefined,
                                done: i === array.length
                            };
                            i++;
                            return next;
                        }
                    };
                }
            };
        }

        var instance = ReactTestUtils.renderIntoDocument(<Parent>{createIterable([<div className="aaa" />])}</Parent>);
        var array = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, "aaa");
        expect(array.length).toBe(1);
        var instance = ReactTestUtils.renderIntoDocument(<Parent>{createIterable([<div className="aaa" />, <div className="aaa" />])}</Parent>);
        var array = ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, "aaa");
        expect(array.length).toBe(2);
    });
    it("should warn for using maps as children with owner info", () => {
        if (typeof Map === "function") {
            class Parent extends React.Component {
                render() {
                    return <div>{new Map([["foo", 0], ["bar", 1]])}</div>;
                }
            }
            var container = document.createElement("div");
            ReactDOM.render(<Parent />, container);
            expect(container.innerText || container.textContent).toBe("01");
        }
    });

    it("should reorder bailed-out children", () => {
        var container = document.createElement("div");

        // Two random strings -- some additions, some removals, some moves
        ReactDOM.render(<Letters letters="XKwHomsNjIkBcQWFbiZU" />, container);
        expect(container.textContent).toBe("XKwHomsNjIkBcQWFbiZU");
        ReactDOM.render(<Letters letters="EHCjpdTUuiybDvhRJwZt" />, container);
        expect(container.textContent).toBe("EHCjpdTUuiybDvhRJwZt");
    });

    it("添加增删改", () => {
        var container = document.createElement("div");

        // Two random strings -- some additions, some removals, some moves
        ReactDOM.render(<Letters letters="8ABC4D5EFGH" />, container);
        expect(container.textContent).toBe("8ABC4D5EFGH");
        ReactDOM.render(<Letters letters="GFE9DBACH" />, container);
        expect(container.textContent).toBe("GFE9DBACH");
        ReactDOM.render(<Letters letters="AERCHOG" />, container);
        expect(container.textContent).toBe("AERCHOG");
    });

    it("prepares new children before unmounting old", () => {
        var list = [];
        function logger(e){
            list.push(e)
        }
        class Spy extends React.Component {
            componentWillMount() {
                logger(this.props.name + " componentWillMount");
            }
            render() {
                logger(this.props.name + " render");
                return <div />;
            }
            componentDidMount() {
                logger(this.props.name + " componentDidMount");
            }
            componentWillUnmount() {
                logger(this.props.name + " componentWillUnmount");
            }
        }

        // These are reference-unequal so they will be swapped even if they have
        // matching keys
        var SpyA = props => <Spy {...props} />;
        var SpyB = props => <Spy {...props} />;

        var container = document.createElement("div");
        ReactDOM.render(
            <div>
                <SpyA key="one" name="oneA" />
                <SpyA key="two" name="twoA" />
            </div>,
            container
        );
        ReactDOM.render(
            <div>
                <SpyB key="one" name="oneB" />
                <SpyB key="two" name="twoB" />
            </div>,
            container
        );
        expect(list.join("\n")).toBe([
            "oneA componentWillMount",
            "oneA render",
            "twoA componentWillMount",
            "twoA render",
            "oneA componentDidMount",
            "twoA componentDidMount",

            "oneB componentWillMount",
            "oneB render",
          
            "twoB componentWillMount",
            "twoB render",
            "oneA componentWillUnmount",
            "twoA componentWillUnmount",
            "oneB componentDidMount",
            "twoB componentDidMount"
        ].join("\n"));
    });
});

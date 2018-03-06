import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
var ReactDOM = window.ReactDOM || React;

describe("ReactDOMFragment", function() {
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
    it("should render a single child via noop renderer", () => {
        const element = (
            <React.Fragment>
                <span>foo</span>
            </React.Fragment>
        );
        ReactDOM.render(element, div);
        expect(div.innerHTML.toLowerCase()).toBe("<span>foo</span>");
    });
    it("should render zero children via noop renderer", () => {
        const element = <React.Fragment />;
    
        var ret = ReactDOM.render(element, div);
        expect(ret).toBe(null);
    
        expect(div.innerHTML).toEqual("");
    });
    it("should render multiple children via noop renderer", () => {
        const element = (
            <React.Fragment>
            hello <span>world</span>
            </React.Fragment>
        );
    
        ReactDOM.render(element, div);
       
    
        expect(div.innerHTML.toLowerCase()).toBe("hello <span>world</span>");
    });

    it("should render an iterable via noop renderer", () => {
        const element = (
            <React.Fragment>
                {new Set([<span key="a">hi</span>, <span key="b">bye</span>])}
            </React.Fragment>
        );
    
        ReactDOM.render(element, div);
    
        expect(div.innerHTML.toLowerCase()).toBe("<span>hi</span><span>bye</span>");
    });

    it("should preserve state of children with 1 level nesting", function() {
        const ops = [];
    
        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }
    
            render() {
                return <div>Hello</div>;
            }
        }
    
        function Foo({condition}) {
            return condition ? (
                <Stateful key="a" />
            ) : (
                <React.Fragment>
                    <Stateful key="a" />
                    <div key="b">World</div>
                </React.Fragment>
            );
        }
    
        ReactDOM.render(<Foo condition={true} />,div);
      
    
        ReactDOM.render(<Foo condition={false} />,div);
      
        expect(ops).toEqual(["Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(2);
    
        ReactDOM.render(<Foo condition={true} />,div);
    
        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    });
    it("should preserve state between top-level fragments", function() {
        const ops = [];
    
        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }
    
            render() {
                return <div>Hello</div>;
            }
        }
    
        function Foo({condition}) {
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
    
        ReactDOM.render(<Foo condition={true} />,div);
       
    
        ReactDOM.render(<Foo condition={false} />, div);
       
    
        expect(ops).toEqual(["Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    
        ReactDOM.render(<Foo condition={true} />, div);
      
    
        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    });

    it("should preserve state of children nested at same level", function() {
        const ops = [];
    
        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }
    
            render() {
                return <div>Hello</div>;
            }
        }
    
        function Foo({condition}) {
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
    
        ReactDOM.render(<Foo condition={true} />,div);
      
    
        ReactDOM.render(<Foo condition={false} />, div);
      
        expect(ops).toEqual(["Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(2);
    
        ReactDOM.render(<Foo condition={true} />,div);
        
    
        expect(ops).toEqual(["Update Stateful", "Update Stateful"]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    });

    it("should not preserve state in non-top-level fragment nesting", function() {
        const ops = [];
    
        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }
    
            render() {
                return <div>Hello</div>;
            }
        }
    
        function Foo({condition}) {
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
    
        ReactDOM.render(<Foo condition={true} />,div);
     
    
        ReactDOM.render(<Foo condition={false} />,div);
      
    
        expect(ops).toEqual([]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    
        ReactDOM.render(<Foo condition={true} />,div);
      
    
        expect(ops).toEqual([]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    });

    it("should not preserve state of children if nested 2 levels without siblings", function() {
        const ops = [];
    
        class Stateful extends React.Component {
            componentDidUpdate() {
                ops.push("Update Stateful");
            }
    
            render() {
                return <div>Hello</div>;
            }
        }
    
        function Foo({condition}) {
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
    
        ReactDOM.render(<Foo condition={true} />,div);
    
        ReactDOM.render(<Foo condition={false} />,div);
     
    
        expect(ops).toEqual([]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    
    
        ReactDOM.render(<Foo condition={true} />,div);
    
        expect(ops).toEqual([]);
        expect(div.getElementsByTagName("div").length).toEqual(1);
    
    });
    
});
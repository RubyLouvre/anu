import React from "dist/React";
import ReactDOMServer from "dist/ReactDOMServer";
//这里的测试可能与官方的有点不一样，因为不会产生多个文本节点
describe("ReactDOMTextarea", function() {
    this.timeout(200000);
    function filterOutComments(nodeList) {
        return [].slice.call(nodeList).filter(node => node.nodeType < 8);
    }

    var body = document.body,
        div;
    beforeEach(function() {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function() {
        body.removeChild(div);
    });
    var emptyFunction = function(){};
    var renderTextarea = function(component, container) {
        if (!container) {
            container = document.createElement("div");
        }
        const node = ReactDOM.render(component, container);

        // Fixing jsdom's quirky behavior -- in reality, the parser should strip
        // off the leading newline but we need to do it by hand here.
        node.defaultValue = node.innerHTML.replace(/^\n/, "");
        return node;
    };

    it("should allow setting `defaultValue`", () => {
        const container = document.createElement("div");
        const node = renderTextarea(<textarea defaultValue="giraffe" />, container);

        expect(node.value).toBe("giraffe");

        // Changing `defaultValue` should do nothing.
        renderTextarea(<textarea defaultValue="gorilla" />, container);
        //  expect(node.value).toEqual("giraffe");

        node.value = "cat";

        renderTextarea(<textarea defaultValue="monkey" />, container);
        expect(node.value).toEqual("cat");
    });

    it("should display `defaultValue` of number 0", () => {
        const stub = <textarea defaultValue={0} />;
        const node = renderTextarea(stub);

        expect(node.value).toBe("0");
    });

    it("should display \"false\" for `defaultValue` of `false`", () => {
        const stub = <textarea defaultValue={false} />;
        const node = renderTextarea(stub);

        expect(node.value).toBe("false");
    });

    it("should display \"foobar\" for `defaultValue` of `objToString`", () => {
        const objToString = {
            toString: function() {
                return "foobar";
            }
        };

        const stub = <textarea defaultValue={objToString} />;
        const node = renderTextarea(stub);

        expect(node.value).toBe("foobar");
    });

    it("should set defaultValue", () => {
        const container = document.createElement("div");
        ReactDOM.render(<textarea defaultValue="foo" />, container);
        ReactDOM.render(<textarea defaultValue="bar" />, container);
        ReactDOM.render(<textarea defaultValue="noise" />, container);
        expect(container.firstChild.defaultValue).toBe("noise");
    });

    it("should not render value as an attribute", () => {
        const stub = <textarea value="giraffe" onChange={emptyFunction} />;
        const node = renderTextarea(stub);

        expect(node.getAttribute("value")).toBe(null);
    });

    it("should display `value` of number 0", () => {
        const stub = <textarea value={0} />;
        const node = renderTextarea(stub);

        expect(node.value).toBe("0");
    });

    it("should update defaultValue to empty string", () => {
        const container = document.createElement("div");
        ReactDOM.render(<textarea defaultValue={"foo"} />, container);
        ReactDOM.render(<textarea defaultValue={""} />, container);
        expect(container.firstChild.defaultValue).toBe("");
    });

    it("should allow setting `value` to `giraffe`", () => {
        const container = document.createElement("div");
        let stub = <textarea value="giraffe" onChange={emptyFunction} />;
        const node = renderTextarea(stub, container);

        expect(node.value).toBe("giraffe");

        stub = ReactDOM.render(<textarea value="gorilla" onChange={emptyFunction} />, container);
        expect(node.value).toEqual("gorilla");
    });
});

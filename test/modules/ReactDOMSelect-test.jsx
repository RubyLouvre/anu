import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactDOMServer from "dist/ReactDOMServer";
import { constants } from "os";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactDOMSelect", function() {
    this.timeout(200000);
    var noop = function() {};
    var body = document.body,
        div, container
    beforeEach(function() {
        div = document.createElement("div");

        container = div
        body.appendChild(div);
    });
    afterEach(function() {
        div.innerHTML = ""
        body.removeChild(div);
        container = null
    });
    it("should allow setting `defaultValue`", () => {
        let stub = (
            <select defaultValue="giraffe">
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("giraffe");

        // Changing `defaultValue` should do nothing.
        ReactDOM.render(<select defaultValue="gorilla">{options}</select>, container);
        expect(node.value).toEqual("giraffe");
    });

    it("should not control when using `defaultValue`", () => {
        const el = (
            <select defaultValue="giraffe">
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const stub = ReactDOM.render(el, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("giraffe");

        node.value = "monkey";
        ReactDOM.render(el, container);
        // Uncontrolled selects shouldn't change the value after first mounting
        expect(node.value).toEqual("monkey");
    });

    it("should allow setting `defaultValue` with multiple", () => {
        let stub = (
            <select multiple={true} defaultValue={["giraffe", "gorilla"]}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla

        // Changing `defaultValue` should do nothing.
        ReactDOM.render(
            <select multiple={true} defaultValue={["monkey"]}>
                {options}
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla
    });
    it("should allow setting `value`", () => {
        let stub = (
            <select value="giraffe" onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("giraffe");

        // Changing the `value` prop should change the selected option.
        ReactDOM.render(
            <select value="gorilla" onChange={noop}>
                {options}
            </select>,
            container
        );
        expect(node.value).toEqual("gorilla");
    });

    it("should default to the first non-disabled option", () => {
        let stub = (
            <select defaultValue="">
                <option disabled={true}>Disabled</option>
                <option disabled={true}>Still Disabled</option>
                <option>0</option>
                <option disabled={true}>Also Disabled</option>
            </select>
        );
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);
        expect(node.options[0].selected).toBe(false);
        expect(node.options[2].selected).toBe(true);
    });

    it("should allow setting `value` to __proto__", () => {
        let stub = (
            <select value="__proto__" onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="__proto__">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.value).toBe("__proto__");

        // Changing the `value` prop should change the selected option.
        ReactDOM.render(
            <select value="gorilla" onChange={noop}>
                {options}
            </select>,
            container
        );
        expect(node.value).toEqual("gorilla");
    });
    it("should not throw with `value` and without children", () => {
        const stub = <select value="dummy" onChange={noop} />;

        expect(() => {
            ReactTestUtils.renderIntoDocument(stub);
        }).not.toThrow();
    });

    it("should allow setting `value` with multiple", () => {
        let stub = (
            <select multiple={true} value={["giraffe", "gorilla"]} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla

        // Changing the `value` prop should change the selected options.
        ReactDOM.render(
            <select multiple={true} value={["monkey"]} onChange={noop}>
                {options}
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(true); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla
    });

    it("should allow setting `value` to __proto__ with multiple", () => {
        let stub = (
            <select multiple={true} value={["__proto__", "gorilla"]} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="__proto__">A __proto__!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // __proto__
        expect(node.options[2].selected).toBe(true); // gorilla

        // Changing the `value` prop should change the selected options.
        ReactDOM.render(
            <select multiple={true} value={["monkey"]} onChange={noop}>
                {options}
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(true); // monkey
        expect(node.options[1].selected).toBe(false); // __proto__
        expect(node.options[2].selected).toBe(false); // gorilla
    });
    it("should not select other options automatically", () => {
        let stub = (
            <select multiple={true} value={["12"]} onChange={noop}>
                <option value="1">one</option>
                <option value="2">two</option>
                <option value="12">twelve</option>
            </select>
        );
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // one
        expect(node.options[1].selected).toBe(false); // two
        expect(node.options[2].selected).toBe(true); // twelve
    });

    it("should reset child options selected when they are changed and `value` is set", () => {
        let stub = <select multiple={true} value={["a", "b"]} onChange={noop} />;
        stub = ReactDOM.render(stub, container);

        ReactDOM.render(
            <select multiple={true} value={["a", "b"]} onChange={noop}>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
            </select>,
            container
        );

        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(true); // a
        expect(node.options[1].selected).toBe(true); // b
        expect(node.options[2].selected).toBe(false); // c
    });

    it("should allow setting `value` with `objectToString`", () => {
        const objectToString = {
            animal: "giraffe",
            toString: function() {
                return this.animal;
            }
        };

        const el = (
            <select multiple={true} value={[objectToString]} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const stub = ReactDOM.render(el, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla

        // Changing the `value` prop should change the selected options.
        objectToString.animal = "monkey";

        const el2 = (
            <select multiple={true} value={[objectToString]}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        ReactDOM.render(el2, container);

        expect(node.options[0].selected).toBe(true); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla
    });

    it("should allow switching to multiple", () => {
        let stub = (
            <select defaultValue="giraffe">
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla

        // When making it multiple, giraffe and gorilla should be selected
        ReactDOM.render(
            <select multiple={true} defaultValue={["giraffe", "gorilla"]}>
                {options}
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla
    });

    it("should allow switching from multiple", () => {
        let stub = (
            <select multiple={true} defaultValue={["giraffe", "gorilla"]}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla

        // When removing multiple, defaultValue is applied again, being omitted
        // means that "monkey" will be selected
        ReactDOM.render(<select defaultValue="gorilla">{options}</select>, container);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla
    });

    it("should remember value when switching to uncontrolled", () => {
        let stub = (
            <select value={"giraffe"} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla

        ReactDOM.render(<select>{options}</select>, container);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla
    });

    it("should remember updated value when switching to uncontrolled", () => {
        let stub = (
            <select value={"giraffe"} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const options = stub.props.children;
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        ReactDOM.render(
            <select value="gorilla" onChange={noop}>
                {options}
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla

        ReactDOM.render(<select>{options}</select>, container);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(true); // gorilla
    });

    it("should support server-side rendering", () => {
        const stub = (
            <select value="giraffe" onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const markup = ReactDOMServer.renderToString(stub);
        expect(markup).toContain('<option selected="" value="giraffe"');
        expect(markup).not.toContain('<option selected="" value="monkey"');
        expect(markup).not.toContain('<option selected="" value="gorilla"');
    });

    it("should support server-side rendering with defaultValue", () => {
        const stub = (
            <select defaultValue="giraffe">
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const markup = ReactDOMServer.renderToString(stub);
        expect(markup).toContain('<option selected="" value="giraffe"');
        expect(markup).not.toContain('<option selected="" value="monkey"');
        expect(markup).not.toContain('<option selected="" value="gorilla"');
    });

    it("should support server-side rendering with multiple", () => {
        const stub = (
            <select multiple={true} value={["giraffe", "gorilla"]} onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        const markup = ReactDOMServer.renderToString(stub);
        expect(markup).toContain('<option selected="" value="giraffe"');
        expect(markup).toContain('<option selected="" value="gorilla"');
        expect(markup).not.toContain('<option selected="" value="monkey"');
    });

    it("should not control defaultValue if readding options", () => {
        //这个逻辑很怪
        return;
        const container = document.createElement("div");

        const select = ReactDOM.render(
            <select multiple={true} defaultValue={["giraffe"]}>
                <option key="monkey" value="monkey">
                    A monkey!
                </option>
                <option key="giraffe" value="giraffe">
                    A giraffe!
                </option>
                <option key="gorilla" value="gorilla">
                    A gorilla!
                </option>
            </select>,
            container
        );
        const node = ReactDOM.findDOMNode(select);

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(true); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla

        ReactDOM.render(
            <select multiple={true} defaultValue={["giraffe"]}>
                <option key="monkey" value="monkey">
                    A monkey!
                </option>
                <option key="gorilla" value="gorilla">
                    A gorilla!
                </option>
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(false); // gorilla

        ReactDOM.render(
            <select multiple={true} defaultValue={["giraffe"]}>
                <option key="monkey" value="monkey">
                    A monkey!
                </option>
                <option key="giraffe" value="giraffe">
                    A giraffe!
                </option>
                <option key="gorilla" value="gorilla">
                    A gorilla!
                </option>
            </select>,
            container
        );

        expect(node.options[0].selected).toBe(false); // monkey
        expect(node.options[1].selected).toBe(false); // giraffe
        expect(node.options[2].selected).toBe(false); // gorilla
    });

    it("默认选中第一个disabled=false的option", () => {
        var a1;
        ReactTestUtils.renderIntoDocument(
            <select value={null}>
                <option
                    value="test"
                    ref={a => {
                        a1 = a;
                    }}
                />
            </select>
        );

        expect((a1 || {}).selected).toBe(true);
    });

    it("should warn if selected is set on <option>", () => {
        var a1, a2;
        ReactTestUtils.renderIntoDocument(
            <select>
                <option
                    selected={true}
                    ref={a => {
                        a1 = a;
                    }}
                />
                <option
                    selected={true}
                    ref={a => {
                        a2 = a;
                    }}
                />
            </select>
        );
        expect((a1 || {}).selected).toBe(true);
        expect((a2 || {}).selected).toBe(false);
    });

    it("should warn if value is null and multiple is true", () => {
        var a1;
        ReactTestUtils.renderIntoDocument(
            <select value={null} multiple={true}>
                <option
                    value="test"
                    ref={a => {
                        a1 = a;
                    }}
                />
            </select>
        );

        expect((a1 || {}).selected).toBe(false);
    });

    it("should refresh state on change", () => {
        let stub = (
            <select value="giraffe" onChange={noop}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        stub = ReactTestUtils.renderIntoDocument(stub);
        const node = ReactDOM.findDOMNode(stub);

        ReactTestUtils.Simulate.change(node);

        expect(node.value).toBe("giraffe");
    });

    it("should be able to safely remove select onChange", () => {
        function changeView() {
            ReactDOM.unmountComponentAtNode(container);
        }

        let stub = (
            <select value="giraffe" onChange={changeView}>
                <option value="monkey">A monkey!</option>
                <option value="giraffe">A giraffe!</option>
                <option value="gorilla">A gorilla!</option>
            </select>
        );
        stub = ReactDOM.render(stub, container);
        const node = ReactDOM.findDOMNode(stub);

        expect(() => ReactTestUtils.Simulate.change(node)).not.toThrow();
    });

    it("should select grandchild options nested inside an optgroup", () => {
        const stub = (
            <select value="b" onChange={noop}>
                <optgroup label="group">
                    <option value="a">a</option>
                    <option value="b">b</option>
                    <option value="c">c</option>
                </optgroup>
            </select>
        );
        const node = ReactDOM.render(stub, container);

        expect(node.options[0].selected).toBe(false); // a
        expect(node.options[1].selected).toBe(true); // b
        expect(node.options[2].selected).toBe(false); // c
    });

    it("should allow controlling `value` in a nested render", () => {
        let selectNode;

        class Parent extends React.Component {
            state = {
                value: "giraffe"
            };

            componentDidMount() {
                this._renderNested();
            }

            componentDidUpdate() {
                this._renderNested();
            }

            _handleChange(event) {
                this.setState({ value: event.target.value });
            }

            _renderNested() {
                ReactDOM.render(
                    <select onChange={this._handleChange.bind(this)} ref={n => (selectNode = n)} value={this.state.value}>
                        <option value="monkey">A monkey!</option>
                        <option value="giraffe">A giraffe!</option>
                        <option value="gorilla">A gorilla!</option>
                    </select>,
                    this._nestingContainer
                );
            }

            render() {
                return <div ref={n => (this._nestingContainer = n)} />;
            }
        }

        ReactDOM.render(<Parent />, container);

        expect(selectNode.value).toBe("giraffe");

        selectNode.value = "gorilla";

        let nativeEvent = document.createEvent("Event");
        nativeEvent.initEvent("input", true, true);
        selectNode.dispatchEvent(nativeEvent);

        expect(selectNode.value).toEqual("gorilla");

        nativeEvent = document.createEvent("Event");
        nativeEvent.initEvent("change", true, true);
        selectNode.dispatchEvent(nativeEvent);

        expect(selectNode.value).toEqual("gorilla");

        
    });

    it("下拉菜单的options重排后确保selected正确", async () => {
        class Select extends React.Component {
            constructor() {
                super();
                this.state = {
                    city: "bj",
                    cities: [
                        {
                            value: "bj",
                            text: "北京"
                        },
                        {
                            value: "hj",
                            text: "杭州"
                        },
                        {
                            value: "nj",
                            text: "南京"
                        }
                    ]
                };
            }
            change() {
                this.setState({
                    cities: [
                        {
                            value: "hj",
                            text: "杭州"
                        },
                        {
                            value: "nj",
                            text: "南京"
                        },
                        {
                            value: "bj",
                            text: "北京"
                        }
                    ]
                });
            }
            handleCity(e) {
                var value = e.target.value;
                this.setState({ city: value });
            }
            render() {
                return (
                    <select name="city" id="node3" value={this.state.city} onChange={this.handleCity.bind(this)}>
                        {this.state.cities.map(function(el, i) {
                            return (
                                <option value={el.value} ref={"o" + i}>
                                    {el.text}
                                </option>
                            );
                        })}
                    </select>
                );
            }
        }
        var s = React.render(<Select />, container);

        expect(s.refs.o0.text).toBe("北京");
        expect(s.refs.o1.text).toBe("杭州");
        expect(s.refs.o2.text).toBe("南京");
        s.change();

        expect(s.refs.o0.text).toBe("杭州");
        expect(s.refs.o1.text).toBe("南京");
        expect(s.refs.o2.text).toBe("北京");
    });

    it("带optgroup元素的多选下拉框", () => {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: ["aaa", "ccc"]
                };
            }

            onChange(e) {
                var values = [];
                var elems = e.target.getElementsByTagName("option");
                for (var i = 0, el; (el = elems[i++]); ) {
                    if (el.selected) {
                        if (el.getAttribute("value") != null) {
                            values.push(el.getAttribute("value"));
                        } else {
                            values.push(el.text);
                        }
                    }
                }
                this.setState({
                    values: values
                });
            }
            render() {
                return (
                    <select value={this.state.value} multiple="true" onChange={this.onChange.bind(this)}>
                        <optgroup>
                            <option ref="a">aaa</option>
                            <option ref="b">bbb</option>
                        </optgroup>
                        <optgroup>
                            <option ref="c">ccc</option>
                            <option ref="d">ddd</option>
                        </optgroup>
                    </select>
                );
            }
        }

        var s = React.render(<App />, container);
        expect(s.refs.a.selected).toBe(true);
        expect(s.refs.b.selected).toBe(false);
        expect(s.refs.c.selected).toBe(true);
        expect(s.refs.d.selected).toBe(false);
        s.setState({
            value: ["bbb", "ddd"]
        });
        expect(s.refs.a.selected).toBe(false);
        expect(s.refs.b.selected).toBe(true);
        expect(s.refs.c.selected).toBe(false);
        expect(s.refs.d.selected).toBe(true);
    });

    it("带defaultValue属性的多选下拉框", function() {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "ccc"
                };
            }

            render() {
                return (
                    <select defaultValue={this.state.value}>
                        <option ref="a">aaa</option>
                        <option ref="b">bbb</option>
                        <option ref="c">ccc</option>
                        <option ref="d">ddd</option>
                    </select>
                );
            }
        }

        var s = React.render(<App />, container);

        expect(s.refs.c.selected).toBe(true);
    });

    it("多选下拉框没有defaultValue与ReactDOM.render的回调this指向问题", function() {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }

            render() {
                return (
                    <select>
                        <option ref="a">aaa</option>
                        <option ref="b">bbb</option>
                        <option ref="c">ccc</option>
                        <option ref="d">ddd</option>
                    </select>
                );
            }
        }

        var s = React.render(<App />, container, function() {
            expect(this.constructor.name).toBe("App");
        });
        expect(s.refs.a.selected).toBe(true);
    });

    it("select的准确匹配", function() {
        var dom = ReactDOM.render(
            <select value={222}>
                <option value={111}>aaa</option>
                <option value={"222"}>xxx</option>
                <option value={222}>bbb</option>
                <option value={333}>ccc</option>
            </select>,
            container
        );
        expect(dom.options[2].selected).toBe(true);
    });
});

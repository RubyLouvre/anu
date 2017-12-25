import { beforeHook, afterHook, browser } from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
import { SyntheticEvent, addEvent } from "src/event";
import ReactTestUtils from "lib/ReactTestUtils";

import { DOMElement } from "src/browser";

describe("事件系统模块", function() {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    });
    var body = document.body,
        div;
    beforeEach(function() {
        div = document.createElement("div");
        body.appendChild(div);
    });
    afterEach(function() {
        body.removeChild(div);
    });
    it("事件与样式", function() {
        class App extends React.Component {
            constructor() {
                super();
                this.state = {
                    aaa: 111
                };
            }
            click(e) {
                expect(e.currentTarget.nodeType).toBe(1);
                this.setState({
                    aaa: this.state.aaa + 1
                });
            }

            render() {
                return (
                    <div
                        style={{
                            height: this.state.aaa
                        }}
                        onClick={this.click.bind(this)}
                    >
                        {this.state.aaa}
                    </div>
                );
            }
        }
        var vnode = <App />;
        var s = ReactDOM.render(vnode, div);

        expect(s.state.aaa).toBe(111);
        ReactTestUtils.Simulate.click(React.findDOMNode(vnode));

        expect(s.state.aaa).toBe(112);
        ReactTestUtils.Simulate.click(React.findDOMNode(vnode));

        expect(s.state.aaa).toBe(113);
        //确保存在eventSystem对象
        expect(React.eventSystem).toA("object");
    });

    it("冒泡", function() {
        var aaa = "";
        class App extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: {
                        a: 7
                    }
                };
            }

            click() {
                aaa += "aaa ";
            }
            click2(e) {
                aaa += "bbb ";
                e.stopPropagation();
            }
            click3(e) {
                aaa += "ccc ";
            }
            render() {
                return (
                    <div onClick={this.click}>
                        <p>=========</p>
                        <div onClick={this.click2}>
                            <p>=====</p>
                            <div ref="bubble" onClick={this.click3}>
                                {this.state.aaa.a}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);
        ReactTestUtils.Simulate.click(s.refs.bubble);

        expect(aaa.trim()).toBe("ccc bbb");
    });
    it("捕获", function() {
        var aaa = "";
        class App extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: {
                        a: 7
                    }
                };
            }

            click() {
                aaa += "aaa ";
            }
            click2(e) {
                aaa += "bbb ";
                e.preventDefault();
                e.stopPropagation();
            }
            click3(e) {
                aaa += "ccc ";
            }
            render() {
                return (
                    <div onClickCapture={this.click}>
                        <p>=========</p>
                        <div onClickCapture={this.click2}>
                            <p>=====</p>
                            <div ref="capture" onClickCapture={this.click3}>
                                {this.state.aaa.a}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);

        ReactTestUtils.Simulate.click(s.refs.capture);
        expect(aaa.trim()).toBe("aaa bbb");
    });
    it("1.1.2checkbox绑定onChange事件会触发两次", async () => {
        var logIndex = 0;
        function refFn(e) {
            logIndex++;
        }

        var dom = ReactDOM.render(<input type="checkbox" onChange={refFn} />, div);
        await browser
            .click(dom)
            .pause(100)
            .$apply();

        expect(logIndex).toBe(1);
    });
    it("模拟mouseover,mouseout", async () => {
        var aaa = "";
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: {
                        a: 7
                    }
                };
            }

            mouseover() {
                aaa += "aaa ";
            }
            mouseout(e) {
                aaa += "bbb ";
            }

            render() {
                return (
                    <div>
                        <div
                            id="mouse1"
                            onMouseOver={this.mouseover}
                            onMouseOut={this.mouseout}
                            style={{
                                width: 200,
                                height: 200
                            }}
                        />
                        <div id="mouse2" />
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);
        await browser
            .pause(100)
            .moveToObject("#mouse1")
            .pause(100)
            .moveToObject("#mouse2")
            .$apply();

        expect(aaa.trim()).toBe("aaa bbb");
    });

    it("模拟mouseenter,mouseleave", async () => {
        var aaa = "";
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: {
                        a: 7
                    }
                };
            }

            mouseover() {
                aaa += "aaa ";
            }
            mouseout(e) {
                aaa += "bbb ";
            }

            render() {
                return (
                    <div>
                        <div
                            id="mouse3"
                            onMouseEnter={this.mouseover}
                            onMouseLeave={this.mouseout}
                            style={{
                                width: 200,
                                height: 200
                            }}
                        />
                        <div id="mouse4" />
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);
        await browser
            .pause(100)
            .moveToObject("#mouse3")
            .pause(100)
            .moveToObject("#mouse4")
            .$apply();

        expect(aaa.trim()).toBe("aaa bbb");
    });

    it("让focus能冒泡", async () => {
        var aaa = "";
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: {
                        a: 7
                    }
                };
            }

            onFocus1() {
                console.log("focus 1")
                aaa += "aaa ";
            }
            onFocus2(e) {
                console.log("focus 2")
                aaa += "bbb ";
            }

            render() {
                return (
                    <div
                        onFocus={this.onFocus2}
                        style={{
                            width: 200,
                            height: 200
                        }}
                    >
                        <div
                            ref="focus2"
                            tabIndex={-1}
                            onFocus={this.onFocus1}
                            style={{
                                width: 100,
                                height: 100
                            }}
                        >
                            222
                        </div>
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);
        s.refs.focus2.focus()

        expect(aaa.trim()).toBe("aaa bbb");
    });
    it("测试事件对象的属性", function() {
        var obj = {
            type: "change",
            srcElement: 1
        };
        var e = new SyntheticEvent(obj);
        expect(e.type).toBe("change");
        expect(e.timeStamp).toA("number");
        expect(e.target).toBe(1);
        expect(e.nativeEvent).toBe(obj);
        e.stopImmediatePropagation();
        expect(e._stopPropagation).toBe(true);
        expect(e.toString()).toBe("[object Event]");
        var e2 = new SyntheticEvent(e);
        expect(e2).toBe(e);

        var p = new DOMElement();
        p.addEventListener = false;
        addEvent(p, "type", "xxx");
    });

    it("合并点击事件中的setState", async () => {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.__merge = true
                this.state = {
                    path: "111"
                };
            }

            render() {
                list.push("render " + this.state.path);
                return (
                    <div>
                        <span ref="click2time" onClick={this.onClick.bind(this)}>
                            {this.state.path}
                        </span>
                    </div>
                );
            }

            onClick() {
                this.setState(
                    {
                        path: "click"
                    },
                    function() {
                        list.push("click....");
                    }
                );
                this.setState(
                    {
                        path: "click2"
                    },
                    function() {
                        list.push("click2....");
                    }
                );
            }
            componentWillUpdate() {
                list.push("will update");
            }
            componentDidUpdate() {
                list.push("did update");
            }
        }

        var s = ReactDOM.render(<App />, div, function() {
            list.push("ReactDOM cb");
        });
        var list2 = ["render 111", "ReactDOM cb", "will update", "render click2", "did update", "click....", "click2...."];
        ReactTestUtils.Simulate.click(s.refs.click2time);
        expect(list).toEqual(list2);
       
    });

   

    it("非受控组件select的value不可变", async () => {
        class Com extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: "bbb"
                };
            }
            render() {
                return (
                    <select id="node8" value={this.state.value}>
                        <option value="aaa">aaa</option>
                        <option value="bbb">bbb</option>
                        <option value="ccc">ccc</option>
                    </select>
                );
            }
        }

        var s = React.render(<Com />, div);
        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[1].selected).toBe(true);
        await browser
            .selectByVisibleText("#node8", "ccc")
            .pause(200)
            .$apply();

        expect(ReactDOM.findDOMNode(s).children[2].selected).toBe(false);
        expect(ReactDOM.findDOMNode(s).children[1].selected).toBe(true);
    });

    it("父子组件间的通信", async () => {
        class Select extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    value: props.value
                };
                this.onUpdate = props.onUpdate;
                this.onChange = this.onChange.bind(this);
            }
            componentWillReceiveProps(props) {
                this.state = {
                    //更新自己
                    value: props.value
                };
            }
            onChange(e) {
                //让父组件更新自己
                this.onUpdate(e.target.value);
            }
            render() {
                return (
                    <select id="communicate" value={this.state.value} onChange={this.onChange}>
                        <option>北京</option>
                        <option>南京</option>
                        <option>东京</option>
                    </select>
                );
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "南京"
                };
            }
            onUpdate(value) {
                //让子组件调用这个父组件的方法
                this.setState({
                    value: value
                });
            }
            onChange(e) {
                this.onUpdate(e.target.value);
            }
            render() {
                return (
                    <div>
                        <Select onUpdate={this.onUpdate.bind(this)} value={this.state.value} />
                        <input ref="sss" value={this.state.value} onChange={this.onChange.bind(this)} />
                    </div>
                );
            }
        }

        var s = React.render(<App />, div);
        await browser.pause(100).$apply();
        expect(s.refs.sss.value).toBe("南京");
        await browser
            .selectByVisibleText("#communicate", "北京")
            .pause(100)
            .$apply();
        expect(s.refs.sss.value).toBe("北京");
    });
    it("输入内容", async () => {
        class Empty extends React.Component {
            render() {
                return null;
            }
        }
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "南京"
                };
            }
            onUpdate(value) {
                //让子组件调用这个父组件的方法
                this.setState({
                    value: value
                });
            }
            onChange(e) {
                //让父组件更新自己
                this.onUpdate(e.target.value);
            }
            render() {
                return (
                    <div>
                        <Empty />
                        <input ref="a" value={this.state.value} onInput={this.onChange.bind(this)} />
                    </div>
                );
            }
        }

        var s = React.render(<App />, div);
        expect(s.refs.a.value).toBe("南京");
        await browser
            .setValue(s.refs.a, "北京")
            .pause(100)
            .$apply();
        expect(s.refs.a.value).toBe("北京");
    });

    it("测试textarea元素的oninput事件", async () => {
        var values = ["y", "yy", "yyy", "yyyy"];
        var el = "";
        class TextArea extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: 4
                };
            }
            onInput(e) {
                el = values.shift();
                console.log(el)
                this.setState({ value: e.target.value });
            }

            componentDidUpdate() {
                expect(ReactDOM.findDOMNode(s).children[0].value).toBe(el);
            }
            render() {
                return (
                    <div>
                        <textarea id="node5" onInput={this.onInput.bind(this)}>
                            {this.state.value}
                        </textarea>
                        {this.state.value}
                    </div>
                );
            }
        }

        var s = React.render(<TextArea />, div);

        expect(ReactDOM.findDOMNode(s).children[0].value).toBe("4");

        await browser
            .setValue("#node5", "yyyy")
            .pause(300)
            .$apply();
    });
    it("非受控组件textarea的value不可变", async () => {
        class TextArea extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: 5
                };
            }
            render() {
                return (
                    <div>
                        <textarea id="node6" value={this.state.value} />
                        {this.state.value}
                    </div>
                );
            }
        }

        var s = React.render(<TextArea />, div);

        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[0].value).toBe("5");

        await browser
            .setValue("#node6", "xxxx")
            .pause(100)
            .$apply();

        expect(ReactDOM.findDOMNode(s).children[0].value).toBe("5");
    });
    it("非受控组件checkbox的checked不可变", async () => {
        class Checkbox extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: true
                };
            }
            render() {
                return (
                    <div>
                        <input id="node7" type="checkbox" name="xxx" checked={this.state.value} />
                    </div>
                );
            }
        }

        var s = React.render(<Checkbox />, div);
        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(true);

        await browser
            .click("#node7")
            .pause(300)
            .$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(true);
    });
    it("非受控组件radio的checked不可变", async () => {
        class Radio extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: false
                };
            }
            render() {
                return (
                    <div>
                        <input id="radio7" type="checkbox" name="xxx" checked={this.state.value} />
                    </div>
                );
            }
        }

        var s = React.render(<Radio />, div);
        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(false);

        await browser
            .click("#radio7")
            .pause(300)
            .$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(false);
    });

    it("下拉菜单的选择", async () => {
        class Select extends React.Component {
            constructor() {
                super();
                this.state = {
                    city: "bj"
                };
            }
            handleCity(e) {
                expect(e.type).toBe("change");
                var value = e.target.value;
                this.setState({ city: value });
            }
            render() {
                return (
                    <select name="city" id="node2" value={this.state.city} onChange={this.handleCity.bind(this)}>
                        <option value="hz">杭州</option>
                        <option value="bj">北京</option>
                        <option value="sh">上海</option>
                    </select>
                );
            }
        }

        var s = React.render(<Select />, div);
        await browser.pause(100).$apply();

        expect(div.firstChild.children[1].selected).toBe(true);
        await browser
            .selectByVisibleText("#node2", "上海")
            .pause(100)
            .$apply();

        expect(div.firstChild.children[2].selected).toBe(true);
        await browser
            .selectByVisibleText("#node2", "杭州")
            .pause(100)
            .$apply();

        expect(div.firstChild.children[0].selected).toBe(true);
    });

    it("测试radio的onchange事件", async () => {
        class Radio extends React.Component {
            constructor() {
                super();
                this.state = {
                    checkedIndex: 2
                };
            }
            handleChange(index) {
                this.setState({ checkedIndex: index });
            }
            // webdriver.io不支持触发
            // checkbox的onchange事件，只能browsers.click它，然后在一个onClick回调中手动调用onChange回调
            onClick(index) {
                var me = this;
                setTimeout(function() {
                    me.handleChange(index);
                });
            }

            render() {
                return (
                    <div>
                        {[1, 2, 3].map(function(el) {
                            return (
                                <input
                                    type="radio"
                                    id={"radio" + el}
                                    name="xxx"
                                    key={el}
                                    value={el}
                                    checked={this.state.checkedIndex === el}
                                    onClick={this.onClick.bind(this, el)}
                                    onChange={this.handleChange.bind(this, el)}
                                />
                            );
                        }, this)}
                    </div>
                );
            }
        }

        var s = React.render(<Radio />, div);
        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(false);
        expect(ReactDOM.findDOMNode(s).children[1].checked).toBe(true);
        expect(ReactDOM.findDOMNode(s).children[2].checked).toBe(false);
        await browser
            .click("#radio3")
            .pause(100)
            .$apply();

        expect(ReactDOM.findDOMNode(s).children[0].checked).toBe(false);
        expect(ReactDOM.findDOMNode(s).children[1].checked).toBe(false);
        expect(ReactDOM.findDOMNode(s).children[2].checked).toBe(true);
    });

    it("测试input元素的oninput事件", async () => {
        var values = ["x", "xx", "xxx", "xxxx"];
        var el = "";
        class Input extends React.Component {
            constructor() {
                super();
                this.state = {
                    value: 2
                };
            }
            onInput(e) {
                console.log("oninput", e.type, e.target.value);
                el = values.shift();
                this.setState({ value: e.target.value });
            }

            componentDidUpdate() {
                expect(ReactDOM.findDOMNode(s).children[0].value).toBe(el);
            }
            render() {
                return (
                    <div>
                        <input id="node4" value={this.state.value} onInput={this.onInput.bind(this)} />
                        {this.state.value}
                        <input type="image" />
                        <input type="button" value="提交" />
                    </div>
                );
            }
        }

        var s = React.render(<Input />, div);

        await browser.pause(100).$apply();

        expect(ReactDOM.findDOMNode(s).children[0].value).toBe("2");

        await browser
            .setValue("#node4", "xxxx")
            .pause(300)
            .$apply();
    });

    it("InputControlES6", async () => {
        class InputControlES6 extends React.Component {
            constructor(props) {
                super(props);

                // 设置 initial state
                this.state = {
                    text: props.initialValue || "placeholder"
                };

                // ES6 类中函数必须手动绑定
                this.handleChange = this.handleChange.bind(this);
            }

            handleChange(event) {
                this.setState({ text: event.target.value });
            }

            render() {
                return (
                    <div>
                        Type something:
                        <input ref="input" onChange={this.handleChange} value={this.state.text} />
                    </div>
                );
            }
        }

        InputControlES6.defaultProps = {
            initialValue: "请输入内容"
        };

        var s = React.render(<InputControlES6 />, div);

        await browser.pause(100).$apply();
        var input = s.refs.input;
        expect(input.value).toBe("请输入内容");
        expect(input.getDOMNode()).toBe(input);
    });

    it("forceUpdate", async () => {
        class App extends React.Component {
            constructor(props) {
                super(props);

                // 设置 initial state
                this.state = {
                    text: "xxx"
                };
            }

            shouldComponentUpdate() {
                return false;
            }

            render() {
                return (
                    <div>
                        Type something:
                        <input ref="input" value={new Date() - 0} />
                    </div>
                );
            }
        }

        App.defaultProps = {
            initialValue: "请输入内容"
        };
        div.innerHTML = "<span>remove</span>";

        var s = React.render(<App />, div);

        await browser.pause(100).$apply();
        var index = 0;
        expect(ReactDOM.findDOMNode(s).nodeName).toBe("DIV");
        s.forceUpdate(function() {
            index++;
        });
        s.forceUpdate(function() {
            index++;
        });
        await browser.pause(200).$apply();
        expect(index).toBe(2);
    });
});

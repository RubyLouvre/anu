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
        ReactTestUtils.Simulate.click(vnode._hostNode);

        expect(s.state.aaa).toBe(112);
        ReactTestUtils.Simulate.click(vnode._hostNode);

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
                aaa += "aaa ";
            }
            onFocus2(e) {
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
                            id="focus2"
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
        await browser
            .pause(100)
            .click("#focus2")
            .pause(100)
            .$apply();

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
});

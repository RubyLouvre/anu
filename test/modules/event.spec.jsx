import { beforeHook, afterHook, browser } from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
import { SyntheticEvent, addEvent } from "src/event";
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
    it("事件与样式", async () => {
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
                        id="aaa3"
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

        var s = ReactDOM.render(<App />, div);
        await browser.pause(100).$apply();
        expect(s.state.aaa).toBe(111);
        await browser
            .click(s.updater._hostNode)
            .pause(100)
            .$apply();

        expect(s.state.aaa).toBe(112);
        await browser
            .click(s.updater._hostNode)
            .pause(100)
            .$apply();

        expect(s.state.aaa).toBe(113);
        //确保存在eventSystem对象
        expect(React.eventSystem).toA("object");
    });

    it("冒泡", async () => {
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
                            <div id="bubble" onClick={this.click3}>
                                {this.state.aaa.a}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);

        await browser
            .pause(100)
            .click("#bubble")
            .pause(100)
            .$apply();

        expect(aaa.trim()).toBe("ccc bbb");
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
    it("1.1.2checkbox绑定onChange事件会触发两次", async () => {
        var logIndex = 0;
        function refFn(e) {
            logIndex++;
        }

        var el = ReactDOM.render(<input type="checkbox" onChange={refFn} />, div);
        await browser
            .click(el)
            .pause(100)
            .$apply();

        expect(logIndex).toBe(1);
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
    it("捕获", async () => {
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
                            <div id="capture" onClickCapture={this.click3}>
                                {this.state.aaa.a}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        var s = ReactDOM.render(<App />, div);

        await browser
            .pause(100)
            .click("#capture")
            .pause(100)
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
                        <span id="click2time" onClick={this.onClick.bind(this)}>
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

        ReactDOM.render(<App />, div, function() {
            list.push("ReactDOM cb");
        });
        await browser
            .pause(100)
            .click("#click2time")
            .pause(100)
            .$apply();

        expect(list).toEqual(["render 111", "ReactDOM cb", "will update", "render click2", "did update", "click....", "click2...."]);
    });
});

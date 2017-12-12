import { beforeHook, afterHook, browser } from "karma-event-driver-ext/cjs/event-driver-hooks";
import React from "dist/React";
import PureComponent from "src/PureComponent";
import ReactTestUtils from "lib/ReactTestUtils";

describe("组件相关", function() {
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
    it("stateless", function() {
        function HelloComponent(
            props
            /* context */
        ) {
            return <div onClick={() => (props.name = 11)}>Hello {props.name}</div>;
        }
        var vnode = <HelloComponent name="Sebastian" />;
        React.render(vnode, div);

        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("Hello Sebastian");
    });

    it("shouldComponentUpdate什么也不返回", function() {
        var a = 1;
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 1
                };
            }
            shouldComponentUpdate() {
                //这里相当于返回false
            }
            click() {
                this.setState(
                    function(a) {
                        a.aaa++;
                    },
                    function() {
                        a++;
                    }
                );

                this.setState(
                    function(a) {
                        a.aaa++;
                    },
                    function() {
                        a++;
                    }
                );
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>;
            }
        }
        var vnode = <App />;
        ReactDOM.render(vnode, div);
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("1");
        ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(vnode));
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("1");

        expect(a).toBe(3);
    });
    it("shouldComponentUpdate返回false", function() {
        var a = 1;
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 1
                };
            }
            shouldComponentUpdate() {
                return false;
            }
            click() {
                this.setState(
                    function(a) {
                        a.aaa++;
                    },
                    function() {
                        a++;
                    }
                );

                this.setState(
                    function(a) {
                        a.aaa++;
                    },
                    function() {
                        a++;
                    }
                );
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa}</div>;
            }
        }

        var vnode = <App />;
        ReactDOM.render(vnode, div);
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("1");
        ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(vnode));
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("1");
        expect(a).toBe(3);
    });
    it("PureComponent", function() {
        var a = 1;
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
                this.setState(function(state) {
                    state.aaa.a = 8;
                });
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>;
            }
        }

        var vnode = <App />;
        ReactDOM.render(vnode, div);
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("7");
        ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(vnode));
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("7");
    });

    it("PureComponent2", function() {
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
                var aaa = this.state.aaa;
                aaa.a = 9;
                this.setState({
                    aaa: aaa,
                    ccc: 222
                });
            }
            render() {
                return <div onClick={this.click.bind(this)}>{this.state.aaa.a}</div>;
            }
        }

        var vnode = <App />;
        ReactDOM.render(vnode, div);
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("7");
        ReactTestUtils.Simulate.click(ReactDOM.findDOMNode(vnode));
        expect(ReactDOM.findDOMNode(vnode).innerHTML).toBe("9");
    });
    it("子组件是无状态组件", async () => {
        function Output(props) {
            return <strong>{props.value}</strong>;
        }
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "南京"
                };
            }

            onChange(e) {
                this.setState({
                    value: e.target.value
                });
            }
            render() {
                return (
                    <div>
                        <Output value={this.state.value} />
                        <input ref="a" value={this.state.value} onInput={this.onChange.bind(this)} />
                    </div>
                );
            }
        }

        var s = React.render(<App />, div);
        expect(s.refs.a.value).toBe("南京");
        await browser
            .setValue(s.refs.a, "南京22")
            .pause(200)
            .$apply();
        expect(s.refs.a.value).toBe("南京22");
        expect(div.getElementsByTagName("strong")[0].innerHTML).toBe("南京22");
    });
    
    it("一个组件由元素节点变注释节点再回元素节点，不触发componentWillUnmount", function() {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    path: "111"
                };
            }
            change(path) {
                this.setState({
                    path: path || "333"
                });
            }
            render() {
                return (
                    <div>
                        <span>App</span>
                        <Route path={this.state.path} />
                    </div>
                );
            }
        }
        var updateCount = 0;
        var receiveCount = 0;
        var destroyCount = 0;
        class Route extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    path: props.path
                };
            }
            componentWillReceiveProps(props) {
                receiveCount++;
                console.log("receiveCount", receiveCount);
                this.setState(function(nextState, props) {
                    nextState.path = props.path;
                    return nextState;
                });
            }
            componentWillUpdate() {
                updateCount++;
                console.log("updateCount", updateCount);
            }
            componentWillUnmount() {
                destroyCount++;
                console.log("destroyCount", destroyCount);
            }
            render() {
                return this.state.path == "111" ? <p>{this.state.path}</p> : null;
            }
        }
        var s = React.render(<App />, div);

        expect(updateCount).toBe(0);
        expect(receiveCount).toBe(0);
        s.change("111");

        expect(updateCount).toBe(1);
        expect(receiveCount).toBe(1);
        s.change("111x");

        expect(updateCount).toBe(2);
        expect(receiveCount).toBe(2);
        if(!React.createPortal){
           expect(div.firstChild.childNodes[1].nodeType).toBe(8);
        }
        expect(destroyCount).toBe(0);
        s.change("111");

        expect(updateCount).toBe(3);
        expect(receiveCount).toBe(3);
        expect(div.firstChild.childNodes[1].nodeType).toBe(1);
        expect(destroyCount).toBe(0);
    });

   
    it("确保ref执行在componentDidMount之前", function() {
        var str = "";
        class Test extends React.Component {
            componentDidMount() {
                expect(typeof this.refs.wrapper).toBe("object");
                str += "111";
            }
            render() {
                return (
                    <div ref="wrapper" id="aaa">
                        xxx<B />
                    </div>
                );
            }
        }
        class B extends React.Component {
            componentDidMount() {
                expect(typeof this.refs.wrapper2).toBe("object");
                str += "222";
            }
            render() {
                return <p ref="wrapper2">son</p>;
            }
        }
        var s = React.render(<Test />, div);

        expect(str).toBe("222111");
        expect(React.findDOMNode(s.refs.wrapper)).toBe(div.querySelector("#aaa"));
    });
    it("确保componentDidUpdate的第一个参数是prevProps", function() {
        class HasChild extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
                this.onClick = this.onClick.bind(this);
                this.a = 0;
            }
            onClick() {
                this.a = 1;
                this.forceUpdate();
            }
            render() {
                return (
                    <div onClick={this.onClick} ref="componentDidUpdate">
                        {this.a == 0 ? <A title="xxx" ref="a" /> : <A ddd="ddd" ref="a" />}
                    </div>
                );
            }
        }
        var title = 0;
        class A extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            componentDidUpdate(a) {
                title = 1;
            }
            render() {
                return <span>{this.props.title}</span>;
            }
        }
        A.defaultProps = {
            title: "默认值"
        };

        var s = React.render(<HasChild />, div);

        expect(s.refs.a.props.title).toBe("xxx");
        ReactTestUtils.Simulate.click(s.refs.componentDidUpdate);

        expect(s.refs.a.props.title).toBe("默认值");
        expect(s.refs.a.props.ddd).toBe("ddd");
        expect(title).toBe(1);
    });

    it("defaultProps的处理", function() {
        class HasChild extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
                this.onClick = this.onClick.bind(this);
                this.a = 0;
            }
            onClick() {
                this.a = 1;
                this.forceUpdate();
            }
            render() {
                return (
                    <div onClick={this.onClick} ref="componentDidUpdate2">
                        {this.a == 0 ? <A title="xxx" ref="a" /> : <A ddd="ddd" ref="a" />}
                    </div>
                );
            }
        }
        function A(props) {
            return <span>{props.title}</span>;
        }

        A.defaultProps = {
            title: "默认值"
        };

        var s = React.render(<HasChild />, div);

        var span = div.getElementsByTagName("span")[0];
        expect(span.innerHTML).toBe("xxx");
        ReactTestUtils.Simulate.click(s.refs.componentDidUpdate2);

        expect(span.innerHTML).toBe("默认值");
    });

    it("新旧两种无状态组件的ref传参", function() {
        var list = [];
        function Old(props) {
            return <span>{props.aaa}</span>;
        }
        ReactDOM.render(
            <Old
                ref={a => {
                    list.push(!!a);
                }}
                aaa={111}
            />,
            div
        );
        ReactDOM.render(
            <Old
                ref={a => {
                    list.push(!!a);
                }}
                aaa={222}
            />,
            div
        );
        expect(list.join("\n")).toBe([false, false, false].join("\n"));
        var list2 = [];
        function New(props) {
            return {
                componentWillMount() {
                    list2.push("mount");
                },
                componentWillUpdate() {
                    list2.push("update");
                },
                render() {
                    return <span>{props.aaa}</span>;
                }
            };
        }
        ReactDOM.render(
            <New
                ref={a => {
                    list2.push(!!a);
                }}
                aaa={111}
            />,
            div
        );
        ReactDOM.render(
            <New
                ref={a => {
                    list2.push(!!a);
                }}
                aaa={222}
            />,
            div
        );
        expect(list2.join("\n")).toBe(["mount", true, false, "update", true].join("\n"));
    });

    it("componentWillUnmount钩子中调用ReactDOM.findDOMNode 应该还能找到元素", () => {
        var assertions = 0;

        class Inner extends React.Component {
            render() {
                return <span />;
            }

            componentDidMount() {
                expect("mount " + !!ReactDOM.findDOMNode(this)).toBe("mount true");
                assertions++;
            }

            componentWillUnmount() {
                expect("umount " + !!ReactDOM.findDOMNode(this)).toBe("umount true");
                assertions++;
            }
        }

        class Wrapper extends React.Component {
            render() {
                return this.props.showInner ? <Inner /> : null;
            }
        }

        var component;

        component = ReactDOM.render(<Wrapper showInner={true} />, div);
        expect(ReactDOM.findDOMNode(component) ? "1ok" : "1ng").toBe("1ok");

        component = ReactDOM.render(<Wrapper showInner={false} />, div);
        expect(ReactDOM.findDOMNode(component)).toBe(null);

        component = ReactDOM.render(<Wrapper showInner={true} />, div);
        expect(ReactDOM.findDOMNode(component) ? "2ok" : "2ng").toBe("2ok");

        expect(assertions).toBe(3);
    });

    it("虚拟DOM的_owner必须在render中加上", function() {
        class B extends React.Component {
            render() {
                return <div className="xxx">{this.props.children}</div>;
            }
        }
        var b, c;
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "南京"
                };
            }
            _renderPopup(a) {
                return (
                    <B>
                        <p {...a} />
                    </B>
                );
            }
            onChange(e) {
                this.setState({
                    value: e.target.value
                });
            }
            render() {
                return (
                    <div>
                        {this._renderPopup({ ref: "xxxx", children: [(b = <span>333</span>)] })}
                        {this._renderPopup({ ref: "yyyy", children: [(c = <strong>444</strong>)] })}
                    </div>
                );
            }
        }
        var s = React.render(<App />, div);

        expect(b._owner.constructor).toBe(App);
        expect(c._owner.constructor).toBe(App);
    });



    it('子组件的DOM节点改变了，会同步父节点的DOM',  () => {
        var s, s2
        class App extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return <A />
            }
        }
        class A extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return <B />
            }
        }
        class B extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: '3333'
                };
            }
            componentDidMount() {
                s2 = this
            }
            render() {
                return this.state.value ? <div>111</div> : <strong>3333</strong>
            }
        }
        var s = React.render(<App />, div);
        expect(ReactDOM.findDOMNode(s) ).toBe(ReactDOM.findDOMNode(s2));
        s2.setState({value: 0});
        expect(ReactDOM.findDOMNode(s) ).toBe(ReactDOM.findDOMNode(s2));
        expect(ReactDOM.findDOMNode(s).nodeName).toBe('STRONG');
    })
});

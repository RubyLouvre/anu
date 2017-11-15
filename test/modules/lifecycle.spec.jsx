
import React from "dist/React";
import ReactTestUtils from "lib/ReactTestUtils";

describe("生命周期例子", function() {
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
    it("只更新了一个子组件时，被该子组件要求全局重新渲染",function(){
        var list = [];
        var flag = 1;
        function logger(e){
            list.push(e);
        }
        class A extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    text: "aaa"
                };
            }
  
            componentDidMount() {
                logger("A did mount");
                ReactDOM.render(<div><A text="111"/><B text="222"/><C text="333"/></div>, div);
            
            }
            componentWillReceiveProps(){
                logger("A will receive");
            }
            componentDidUpdate() {
                logger("A did update");
                if(flag){
                    flag = 0;
                    ReactDOM.render(<div><A text="111"/><B text="222"/><C text="333"/></div>, div);
                }
  
            }
            render() {
                return <div>{this.state.text}</div>;
            }
        }
        class B extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    text: "bbb"
                };
            }
  
            componentDidMount() {
          
                logger("B did mount");
            }
            componentWillReceiveProps(){
                logger("B will receive");
            }
            componentDidUpdate() {
                logger("B did update");
            }
            render() {
                return <div>{this.state.text}</div>;
            }
        }
        class C extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    text: "ccc"
                };
            }
            componentWillReceiveProps(){
                logger("C will receive");
            }
            componentDidMount() {
                logger("C did mount");
            }
            componentDidUpdate() {
                logger("C did update");
            }
            render() {
                return <div>{this.state.text}</div>;
            }
        }
        var s = ReactDOM.render(<div><A/><B/><C/></div>, div);
        expect(list.join("\n")).toBe([
            "A did mount",
            "B did mount",
            "C did mount",
            "A will receive",
            "B will receive",
            "C will receive",
            "A did update",
            "B did update",
            "C did update",
            "A will receive",
            "B will receive",
            "C will receive",
            "A did update",
            "B did update",
            "C did update"
        ].join("\n"));
  
    });
    it("如果在componentDidMount中调用setState方法\n那么setState的所有回调，\n都会延迟到componentDidUpdate中执行", function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: "aaa"
                };
            }
            componentWillMount() {
                this.setState(
                    {
                        aaa: "bbb"
                    },
                    function() {
                        list.push("1111");
                    }
                );
            }
            componentDidMount() {
                this.setState(
                    {
                        aaa: "cccc"
                    },
                    function() {
                        list.push("2222");
                    }
                );
                this.setState(
                    {
                        aaa: "xxx"
                    },
                    function() {
                        list.push("3333");
                    }
                );
                list.push("did mount");
            }

            componentWillUpdate() {
                list.push("will update");
            }
            componentDidUpdate() {
                list.push("did update");
            }
            render() {
                list.push(this.state.aaa);
                return <div>{this.state.aaa}</div>;
            }
        }

        var s = ReactDOM.render(<App />, div);
        expect(list.join("-")).toBe(
            ["bbb","did mount","will update","xxx","did update","1111","2222","3333"].join("-")
        );
    });
    it("父组件没有DidMount之时被子组件在willMount钩子里调用其setState", function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: "app render"
                };
            }
            componentWillMount() {
                list.push("app will mount");
            }
            componentDidMount() {
                list.push("app did mount");
            }

            componentWillUpdate() {
                list.push("app will update");
            }
            componentDidUpdate() {
                list.push("app did update");
            }
            render() {
                list.push(this.state.aaa);
                return (
                    <div>
                        <A parent={this} />
                        {this.state.aaa}
                    </div>
                );
            }
        }
        class A extends React.Component {
            componentWillMount() {
                list.push("child will mount");
                this.props.parent.setState({
                    aaa: "app new render"
                });
                this.props.parent.setState({
                    aaa: "app new render2"
                });
            }
            componentWillReceiveProps() {
                list.push("child receive");
            }
            componentDidMount() {
                list.push("child did mount");
            }
            componentDidUpdate() {
                list.push("child did update");
            }
            render() {
                return <p>A</p>;
            }
        }
        var s = ReactDOM.render(<App />, div);
        expect(list).toEqual([
            "app will mount",
            "app render",
            "child will mount",
            "child did mount",
            "app did mount",
            "app will update",
            "app new render2",
            "child receive",
            "child did update",
            "app did update"
        ] );
    });

    it("父组件DidMount之时被子组件在componentWillReceiveProps钩子里调用其setState\n父组件的再次render会待到这次render完才调起", function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: "app render"
                };
            }
            componentWillMount() {
                list.push("app will mount");
            }
            componentDidMount() {
                this.setState({
                    aaa: "app render1"
                });
                list.push("app did mount");
            }
            componentDidUpdate() {
                list.push("app did update");
            }
            render() {
                list.push(this.state.aaa);
                return (
                    <div>
                        <A parent={this} />
                        {this.state.aaa}
                        <C />
                    </div>
                );
            }
        }
        var a = 1;
        class C extends React.Component {
            render() {
                list.push("C render");
                return <p>C</p>;
            }
        }
        class A extends React.Component {
            componentWillReceiveProps() {
                if (a < 2) {
                    this.props.parent.setState(
                        {
                            aaa: "child call app render " + ++a
                        },
                        function() {
                            list.push("componentWillReceiveProps 1");
                        }
                    );
                    this.props.parent.setState(
                        {
                            aaa: "child call app render " + ++a
                        },
                        function() {
                            list.push("componentWillReceiveProps 2");
                        }
                    );
                }
            }
            componentWillUpdate() {
                list.push("child will update");
            }
            render() {
                list.push("child render");
                return <p>A</p>;
            }
        }
        React.render(<App />, div);

        var list2 = [
            "app will mount",
            "app render",
            "child render",
            "C render",
            "app did mount",
            "app render1",
            "child will update",
            "child render",
            "C render",
            "app did update",
            "child call app render 3",
            "child will update",
            "child render",
            "C render",
            "app did update",
            "componentWillReceiveProps 1",
            "componentWillReceiveProps 2"
        ];
        expect(list.join("\n")).toBe(list2.join("\n"));
    });

    it("第一次渲染时不会触发componentWillUpdate", function() {
        var a = 1;
        class ReceivePropsComponent extends React.Component {
            componentWillUpdate() {
                a = 2;
            }
            render() {
                return <div />;
            }
        }

        React.render(<ReceivePropsComponent />, div);
        expect(a).toBe(1);
    });

    it("先执行子组件的mount钩子再到父组件的mount钩子", function() {
        let log = [];

        class Inner extends React.Component {
            componentDidMount() {
                log.push("inner");
            }

            render() {
                return <div id="inner" />;
            }
        }

        class Outer extends React.Component {
            componentDidMount() {
                log.push("outer");
            }

            render(props) {
                return <Inner />;
            }
        }

        React.render(<Outer />, div);
        expect(log.join("-")).toBe("inner-outer");
    });
    it("在componentWillMount中使用setState", function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 111
                };
            }
            componentWillMount() {
                this.setState(
                    {
                        aaa: 222
                    },
                    function() {
                        list.push("555");
                    }
                );
                this.setState(
                    {
                        aaa: 333
                    },
                    function() {
                        list.push("666");
                    }
                );
            }
            render() {
                list.push(this.state.aaa);
                return <p>{this.state.aaa}</p>;
            }
        }

        React.render(<App />, div);
   
        expect(list.join("-")).toBe("333-555-666");
        expect(div.textContent || div.innerText).toBe("333");
    });

    it("在componentDidMount中使用setState，会导致willMount, DidMout中的回调都延后",function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: 111
                };
            }

            componentWillMount() {
                this.setState(
                    {
                        aaa: 222
                    },
                    function() {
                        list.push("555");
                    }
                );
                this.setState(
                    {
                        aaa: 333
                    },
                    function() {
                        list.push("666");
                    }
                );
            }
            componentDidMount() {
                this.setState(
                    {
                        aaa: 444
                    },
                    function() {
                        list.push("777");
                    }
                );
            }

            render() {
                list.push(this.state.aaa);
                return <p>{this.state.aaa}</p>;
            }
        }

        var s = React.render(<App />, div);
        expect(list.join("-")).toBe("333-444-555-666-777");
        expect(div.textContent || div.innerText).toBe("444");
    });

    it("ReactDOM的回调总在最后",function() {
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    path: "111"
                };
            }
            componentWillMount() {
                this.setState(
                    {
                        path: "222"
                    },
                    function() {
                        list.push("componentWillMount cb");
                    }
                );
                this.setState(
                    {
                        path: "2222"
                    },
                    function() {
                        list.push("componentWillMount cb2");
                    }
                );
            }
            render() {
                list.push("render " + this.state.path);
                return (
                    <div>
                        <span>
                            {this.state.path}
                            <Child parent={this} />
                        </span>
                    </div>
                );
            }
            componentDidMount() {
                this.setState(
                    {
                        path: "eeee"
                    },
                    function() {
                        list.push("componentDidMount cb");
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
        class Child extends React.Component {
            componentWillMount() {
                this.props.parent.setState(
                    {
                        path: "child"
                    },
                    function() {
                        list.push("child setState");
                    }
                );
            }
            render() {
                list.push("child render");
                return <p>33333</p>;
            }
        }
        ReactDOM.render(<App />, div, function() {
            list.push("ReactDOM cb");
        });

        expect(list).toEqual([
            "render 2222",
            "child render",
            "will update",
            "render eeee",
            "child render",
            "did update",
            "componentWillMount cb",
            "componentWillMount cb2",
            "child setState",
            "componentDidMount cb",
            "ReactDOM cb"
        ]);
    });


    it("在componentWillUnmount中setState应该不起作用", function() {
        class Issue extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    status: "normal"
                };
            }

            componentWillUnmount() {
                this.setState({ status: "unmount" });
            }

            render() {
                const { status } = this.state;

                if (status === "unmount") {
                    throw new Error("Issue unmounted");
                }

                return <span>Issue status: {status}</span>;
            }
        }

        class App extends React.PureComponent {
            constructor(props) {
                super(props);
                this.state = {
                    showIssue: true
                };
            }

            render() {
                const { showIssue } = this.state;

                return (
                    <div>
                        {showIssue && <Issue />}
                        <b>测试错误</b>
                    </div>
                );
            }
        }
        var s = ReactDOM.render(<App />, div);
   
        expect(div.getElementsByTagName("span").length).toBe(1);
        s.setState({showIssue: false});
     
        expect(div.getElementsByTagName("span").length).toBe(0);
    });

    it("forceUpdate在componentDidMount中使用",function(){
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    aaa: "aaa"
                };
            }
            componentWillMount() {
                this.setState(
                    {
                        aaa: "bbb"
                    },
                    function() {
                        list.push("1111");
                    }
                );
            }
            componentDidMount() {
                this.state.aaa = "cccc";
                this.forceUpdate(function() {
                    list.push("2222");
                });
                this.state.aaa = "dddd";
                this.forceUpdate(function() {
                    list.push("3333");
                });
                list.push("did mount");
            }
            componentWillUpdate() {
                list.push("app will update");
            }
            componentDidUpdate() {
                list.push("app did update");
            }

            render() {
                list.push("render " + this.state.aaa);
                return <div>{this.state.aaa}</div>;
            }
        }
        ReactDOM.render(<App />, div, function() {
            list.push("ReactDOM cb");
        });
        expect(list).toEqual([
            "render bbb",
            "did mount",
            "app will update",
            "render dddd",
            "app did update",
            "1111",
            "2222",
            "3333",
            "ReactDOM cb"
        ]);
    });
    it("事件回调里执行多个组件的setState，不会按触发时的顺序执行，而是按文档顺序执行",function(){
        var list = [];
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.handleClick = this.handleClick.bind(this);
            }
            handleClick() {
                this.refs.c.setState({
                    text:"第1"
                },function(){
                    list.push("c的回调");
                });
                this.refs.a.setState({
                    text:"第2"
                }, function(){
                    list.push("a的回调");
                });
                this.refs.b.setState({
                    text:"第3"
                },function(){
                    list.push("b的回调");
                });
            }
            render() {
                return <div ref="kk" onClick={this.handleClick.bind(this)}>
                    <Child name="a" ref="a" >aaa</Child> 
                    <Child name="b" ref="b" >bbb</Child> 
                    <Child name="c" ref="c" >ccc</Child> 
                </div>;
            }
        }
        class Child extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    text: props.children
                };
            }
            componentWillUpdate(){
                list.push(this.props.name+" will update");
            }
            componentDidUpdate(){
                list.push(this.props.name+" did update");
            }
            render(){
                return <span className={this.props.name}>{this.state.text}</span>;
            }
        }
        var s = ReactDOM.render(<App />, div);
        ReactTestUtils.Simulate.click(s.refs.kk);
        expect(list.join("\n")).toBe([
            "a will update",
            "b will update",
            "c will update",
            "a did update",
            "b did update",
            "c did update",
            "a的回调",
            "b的回调",
            "c的回调"
        ].join("\n"));
    });
});

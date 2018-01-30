import React from "dist/React";

// https://github.com/facebook/react/blob/master/src/renderers/__tests__/EventPluginHub-test.js
var ReactDOM = window.ReactDOM || React;

describe("只测试节点的增删移动不测生命周期钩子", function() {
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

    it("存在空组件", () => {
        class B extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return <b>bbb</b>;
            }
        }
        class C extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return <b>ccc</b>;
            }
        }
        function Empty() {
            return false;
        }
        ReactDOM.render(
            <div> 
                <strong>111</strong>
                <strong>222</strong>
                <Empty />
                <Empty />
                <B />
                <C />
            </div>, div
        );
        expect(div.textContent).toBe("111222bbbccc");
    });
    it("children为函数", () => {


    });
    it("存在返回数组的组件", () => {
        class App extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return <div className="root">{this.props.children}</div>;
            }
        }
        class A extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return [<a>aaa</a>, <a>bbb</a>, <a>ccc</a>, <a>ddd</a>];
            }
        }
        function Last() {
            return <span>last</span>;
        }
        function Empty() {
            return false;
        }
        ReactDOM.render(
            <div>
                <strong>111</strong>
                <App>
                    <A />
                </App>
                <Empty />
                <Empty />
                <Last />
            </div>,
            div
        );
        expect(div.textContent).toBe("111aaabbbcccdddlast");
    });
    it("返回false的组件不生成节点", () => {
        class Empty1 extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return false;
            }
        }

        ReactDOM.render(<Empty1 />, div);
        expect(div.textContent).toBe("");
    });
    it("返回null的组件不生成节点", () => {
        class Empty2 extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return null;
            }
        }

        ReactDOM.render(<Empty2 />, div);
        expect(div.textContent).toBe("");
    });
    it("返回undefined的组件不生成节点", () => {
        class Empty3 extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return void 777;
            }
        }

        ReactDOM.render(<Empty3 />, div);
        expect(div.textContent).toBe("");
    });
    it("返回true的组件不生成节点", () => {
        class Empty4 extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return true;
            }
        }

        ReactDOM.render(<Empty4 />, div);
        expect(div.textContent).toBe("");
    });
    it("返回数字的组件生成文本节点", () => {
        class NumberCom extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            render() {
                return 1111;
            }
        }

        ReactDOM.render(<NumberCom />, div);
        expect(div.textContent).toBe("1111");
    });
    it("ReactDOM的第一个参数可以是简单类型", () => {
       
        ReactDOM.render("xxxx", div);
        expect(div.textContent).toBe("xxxx");
        ReactDOM.render(8888, div);
        expect(div.textContent).toBe("8888");
    });
    it("相邻的简单类型会进行合并", () => {
        class App extends React.Component{
            constructor(props){
                super(props);
                this.state = {};
            }
            render(){
                return ["111", "222"];
            }
        }
        ReactDOM.render(<App/>, div);    
        expect(div.textContent).toBe("111222");
        expect(div.childNodes.length).toBe(1);
    });
    it("简单的增删", () => {
        class App extends React.Component{
            constructor(props){
                super(props);
                this.state = {
                    a:1
                };
            }
            render(){
                return this.state.a ? <A />: <B />;
            }
        }
        class A extends React.Component{
            constructor(props){
                super(props);
                this.state = {};
            }
            render(){
                return ["111", "222"];
            }
        }
        class B extends React.Component{
            constructor(props){
                super(props);
                this.state = {};
            }
            render(){
                return <span>b</span>;
            }
        }
        var s = ReactDOM.render(<App/>, div);    
        s.setState({a: 0});
        expect(div.textContent).toBe("b");
    });

    it("对有key的元素进行重排", () => {
        class App extends React.Component{
            constructor(props){
                super(props);
                this.state = {
                    a:1
                };
            }
            render(){
                return (<div>{this.state.a ? 
                    [<a key="a">111</a>, <a key="b">222</a>, <a key="c">333</a>]:
                    [<a key="c">333</a>, <a key="b">444</a>, <a key="a">111</a>]}</div>);
            }
        }
        var s = ReactDOM.render(<App/>, div);   
        expect(div.textContent).toBe("111222333");
        s.setState({a: 0});
        expect(div.textContent).toBe("333444111");
    });
    it("对有key的组件进行重排", () => {
        function A(props){
            return <span>{props.value}</span>;
        }
        class App extends React.Component{
            constructor(props){
                super(props);
                this.state = {
                    a:1
                };
            }
            render(){
                return (<div>{this.state.a ? 
                    [<A key="a" value="1"/>, <A key="b" value="2"/>, <A key="c" value="3"/>]:
                    [<A key="c" value="3"/>, <A key="b" value="2"/>, <A key="a" value="1"/>]}</div>);
            }
        }
        var s = ReactDOM.render(<App/>, div);   
        expect(div.textContent).toBe("123");
        s.setState({a: 0});
        expect(div.textContent).toBe("321");
    });
});

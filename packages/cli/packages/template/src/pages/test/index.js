import React from "../../ReactWX";
import Dog from "../../components/dog/dog";
import "./index.scss";
const var1 = "游离变量";
class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "欢迎使用React转小程序",
            array: [
                { name: "dog1", text: "text1", age: 11 },
                { name: "dog2", text: "text2", age: 8 },
                { name: "dog3", text: "text3", age: 6 }
            ]
        };
    }
    onClick() {
        console.log("test click1" + var1);
        this.setState({
            name: new Date() - 0
        });
    }
    onKeyDown() {
        console.log("test keydown");
    }
    componentWillMount(){
        console.log("page will mount")
    }
    componentDidMount(){
        console.log("page did mount")
    }
    componentWillUpdate(){
        console.log("page will update")
    }
    componentDidUpdate(){
        console.log("page did update")
    }
    render() {
        return (
            <div onTap={this.onClick} onKeyDown={this.onKeyDown}>
                <div>{this.state.name}</div>
                <div>
                    {this.state.array.map(function(el) {
                        return (
                            <Dog key={el.name} name={el.name} age={el.age}>
                                {el.text}
                            </Dog>
                        );
                    }, true)}
                </div>
                <Dog name={this.state.name}>欢迎</Dog>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/index/index"));
export default P;

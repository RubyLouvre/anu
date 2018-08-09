import React from "../../ReactWX";
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
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "Demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    onClick() {
        console.log('click event trigger from container...');
    }
    onKeyDown() {
        console.log("test keydown");
    }
    render() {
        return (
            <div class='container' onTap={this.onClick} onKeyDown={this.onKeyDown}>
                <div class='page_hd'>{this.state.name}</div>
                <div class='page_bd'>
                    <div class='navigation'>
                        <navigator open-type="navigate" class='item' hover-class="navigator-hover" url="/pages/otherPage1/index">组件化</navigator>
                        <navigator open-type="navigate" class='item' hover-class="navigator-hover" url="/pages/otherPage2/index">事件</navigator>
                        <navigator open-type="navigate" class='item' hover-class="navigator-hover" url="/pages/demo/form/index/index">form</navigator>
                        <navigator open-type="navigate" class='item' hover-class="navigator-hover" url="/pages/test/index">for a test</navigator>
                    </div>
                    {/* <div>
                        {this.state.array.map(function(el) {
                            return (
                                <Dog key={el.name} name={el.name} age={el.age}>
                                    {el.text}
                                </Dog>
                            );
                        }, true)}
                    </div> */}
                </div>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/index/index"));
export default P;

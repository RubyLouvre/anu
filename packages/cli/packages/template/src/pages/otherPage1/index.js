import React from "../../ReactWX";
import Dog from "../../components/dog/dog";
class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '我是一个组件'
        };
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "title for page1",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    tapEventHandler(){
        console.log('event from parent component');
    }
    render() {
        return (
            <div class='container'>
                <Dog eventTapHandler={this.tapEventHandler} name={this.state.name}>我是一个组件</Dog>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/otherPage1/index"));
export default P;

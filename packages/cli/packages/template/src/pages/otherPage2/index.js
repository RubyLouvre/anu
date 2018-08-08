import React from "../../ReactWX";
class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '一段文本...'
        };
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "title for page23333",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    updateText(){
        this.setState({
            name: '李四'
        })
    }
    resetText(){
        this.setState({
            name: '一段文本...'
        })
    }
    render() {
        return (
            <div class='container'>
                <div class='page-guide-text'>{this.state.name}</div>
                <button class='btn' onTap={this.updateText}>更改文字</button>
                <button class='btn' onTap={this.resetText}>重置</button>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/otherPage2/index"));
export default P;

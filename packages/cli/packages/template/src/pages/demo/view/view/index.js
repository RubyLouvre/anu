import React from "../../../../ReactWX";
import './index.less';
class P extends React.Component {
    constructor(props) {
        const ROOT_PATH = '/pages/demo/div';
       
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "div demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    render() {
        return (
            <div class='container'>
                <div class="section">
                    <div class="section__title">flex-direction: row</div>
                    <div class="flex-wrp" style="flex-direction:row;">
                        <div class="flex-item bc_green">1</div>
                        <div class="flex-item bc_red">2</div>
                        <div class="flex-item bc_blue">3</div>
                    </div>
                    </div>
                    <div class="section">
                    <div class="section__title">flex-direction: column</div>
                    <div class="flex-wrp" style="height: 300px;flex-direction:column;">
                        <div class="flex-item bc_green">1</div>
                        <div class="flex-item bc_red">2</div>
                        <div class="flex-item bc_blue">3</div>
                    </div>
                </div>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/view/view/index"));
export default P;

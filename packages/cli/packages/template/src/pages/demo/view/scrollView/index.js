import React from "../../../../ReactWX";
import './index.less';
class P extends React.Component {
    constructor(props) {
        this.order = ['red', 'yellow', 'blue', 'green', 'red'];
        this.state = {
            toView: 'red',
            scrollTop: 100
        }

    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "scroll demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    upper(e) {
        console.log(e)
    }
    lower(e) {
        console.log(e)
    }
    scroll(e) {
        console.log(e)
    }
    tap(e) {
        for (var i = 0; i < this.order.length; ++i) {
            if (this.order[i] === this.state.toView) {
                this.setState({
                    toView: this.order[i + 1]
                })
                break
            }
        }
    }
    tapMove(e) {
        var _self = this;
        this.setState({
            scrollTop: _self.state.scrollTop + 10
        })
    }
    render() {
        return (
            <div class='container'>
                <div class="section">
                    <div class="section__title">vertical scroll</div>
                    <scroll-div scroll-y style="height: 200px; overflow: hidden;" onScrolltoupper={this.upper} onScrolltolower={this.lower} onScroll={this.scroll} scroll-into-div={this.state.todiv} scroll-top={this.state.scrollTop}>
                        <div id="green" class="scroll-div-item bc_green"></div>
                        <div id="red"  class="scroll-div-item bc_red"></div>
                        <div id="yellow" class="scroll-div-item bc_yellow"></div>
                        <div id="blue" class="scroll-div-item bc_blue"></div>
                    </scroll-div>

                    <div class="btn-area">
                        <button size="mini" onTap={this.tap}>click me to scroll into div </button>
                        <button size="mini" onTap={this.tapMove}>click me to scroll</button>
                    </div>
                </div>
                <div class="section section_gap">
                    <div class="section__title">horizontal scroll</div>
                    <scroll-div class="scroll-div_H" scroll-x style="width: 100%">
                        <div id="green" class="scroll-div-item_H bc_green"></div>
                        <div id="red"  class="scroll-div-item_H bc_red"></div>
                        <div id="yellow" class="scroll-div-item_H bc_yellow"></div>
                        <div id="blue" class="scroll-div-item_H bc_blue"></div>
                    </scroll-div>
                </div>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/view/scrollView/index"));
export default P;

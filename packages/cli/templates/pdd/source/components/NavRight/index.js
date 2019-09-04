import React from '@react';
import './index.scss';
// eslint-disable-next-line
var now = Date.now();
class NavRight extends React.Component {
    constructor() {
        super();
        this.state = {
            toView: 'index12',
            scrollTop: 0
        };
    }

    scroll(e) {
        let height= e.detail.scrollTop;
        let index = parseInt(height/(this.props.itemHeight));
        this.props.scrollLeftTab(index);
    }

    goto(url) {
        if (url){
            React.api.navigateTo({ url });
        } else {
            React.api.showModal({
                title: '提示',
                content: '该部分仅展示，无具体功能!',
                showCancel: false
            });
        }
    }

    render() {
        return (
            <div className="nav_right anu-col">
                {this.props.data && this.props.data.length > 0 && this.props.data[this.props.index].tree.nodes ? (
                    <scroll-view
                        class="scroll-view"
                        scroll-y={true}
                        scroll-into-view={this.props.toView}
                        scroll-with-animation={true}
                        onScroll={this.scroll.bind(this)}
                        scroll-top={this.props.scrollTop}
                    >
                        <list class="anu-col">
                            {this.props.data.map(function(item) {
                                return (
                                    <list-item key={item.id} class="nav_right_content anu-col" id={'index' + item.id}>
                                        <div class="nav_right_title">{item.tree.desc}</div>
                                        <div className="anu-row">
                                            {item.tree.nodes.map(function(item) {
                                                return (
                                                    <div className="nav_right_items col" key={item.desc}>
                                                        <div
                                                            onClick={
                                                                this.goto.bind(this, '../list/index?brand=' + item.desc + '&typeid=' + this.props.data[this.props.index].id)
                                                            }
                                                        >
                                                            <div className="right_items anu-col">
                                                                {item.logo ? (
                                                                    <image src={item.logo} />
                                                                ) : (
                                                                    <image src="http://temp.im/50x30" />
                                                                )}
                                                                {item.desc && <text>{item.desc}</text>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/*  */}
                                    </list-item>
                                );
                            })}
                        </list>
                    </scroll-view>
                ) : (
                    <div>暂无数据</div>
                )}
            </div>
        );
    }
}

export default NavRight;

import React from '@react';
class RightNav extends React.Component {
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

    render() {
        return (
            <div className="nav_right">
                {this.props.data.length > 0 && this.props.data[this.props.index].tree.nodes ? (
                    <scroll-view
                        class="scroll-view"
                        scroll-y={true}
                        scroll-into-view={this.props.toView}
                        scroll-with-animation={true}
                        onScroll={this.scroll.bind(this)}
                        scroll-top={this.props.scrollTop}
                    >
                        {this.props.data.map(function(item) {
                            return (
                                <div key={item.id} class="nav_right_content" id={'index' + item.id}>
                                    <div class="nav_right_title">{item.tree.desc}</div>
                                    {item.tree.nodes.map(function(item) {
                                        return (
                                            <div className="nav_right_items" key={item.desc}>
                                                <navigator
                                                    url={
                                                        '../list/index?brand=' +
                            item.desc +
                            '&typeid=' +
                            this.props.data[this.props.index].id
                                                    }
                                                >
                                                    <div className="right_items">
                                                        {item.logo ? (
                                                            <image src={item.logo} />
                                                        ) : (
                                                            <image src="http://temp.im/50x30" />
                                                        )}
                                                        {item.desc && <text>{item.desc}</text>}
                                                    </div>
                                                </navigator>
                                            </div>
                                        );
                                    })}
                                    {/*  */}
                                </div>
                            );
                        })}
                    </scroll-view>
                ) : (
                    <div>暂无数据</div>
                )}
            </div>
        );
    }
}

export default RightNav;

import React from '@react';
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        let that = this;
        wx.showLoading({
            title: '获取资源中',
            mask: true
        });
        wx.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/scenic',
            success: function(data) {
                wx.hideLoading();
                that.setState({data: data.data});

            }
        });
    }
    fun_tip() {
        wx.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    config = {
        backgrounColor: '#FFF',
        navigationBarBackgroundColor: '#00ccff',
        navigationBarTitleText: '景点门票',
        navigationBarTextStyle: '#d5d6d6'
    };
    render() { 
        return (
            <div class='scenic'>
                <div class='input-wrapper'>
                    <input 
                        placeholder="请输入城市或景点"
                        type="text"
                    />
                </div>
                <div  class='scenic-content'>
                    {
                        this.state.data.map(function(item,index){
                            return (
                                <div class='item' key={index}>
                                    <div class='title-wrapper'>
                                        <div class='mark'></div>
                                        <div class='title'>{item.title}</div>
                                    </div>
                                    {
                                        item.data.map(function(item,index){
                                            return (
                                                <div onTap={this.fun_tip.bind(this)} class='scenic-item' key={index}>
                                                    <image class='left-content' src={item.url} />
                                                    <div class='right-content'>
                                                        <div class='scenic-name'>{item.name}</div>
                                                        <div class='desc'>{item.desc}</div>
                                                        <div class='comment'>{item.comment + '评论'}</div>
                                                        <div class='price-distance'>
                                                            <div class='price'>{'￥' + item.price}</div>
                                                            <div class='distance'>{item.distance + 'km'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default P;
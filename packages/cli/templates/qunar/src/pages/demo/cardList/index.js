import React from '@react';
import './index.less';

class P extends React.Component{
    constructor() {
        super();
        this.state = {
            data: []
        };
    }
    componentDidMount() {
        let that = this;
        React.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/cardList',
            success: function(data) {
                React.api.hideLoading();
                that.setState({data: data.data});
            }
        });
    }
    config = {
        backgrounColor: '#FFF',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '瀑布流',
        navigationBarTextStyle: 'black',
        enablePullDownRefresh: true,
        onReachBottomDistance: 50
    };
    onReachBottom () {
        let that = this;
        React.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/cardList',
            success: function(data) {
                React.api.hideLoading();
                that.setState({data: [...that.state.data,...data.data]});
            }
        });
    }
    render() {
        return (
            <div class='cardList'>
                <div  class='wrapper'>
                    {   
                        this.state.data.map(function(item,index) {
                            return (
                                index%2 === 0  &&
                                <div key={index} class='item'>
                                    <image src={item.image} />
                                    <text>{item.text}</text>
                                </div>
                            );
                        })
                    }
                </div>
                <div  class='wrapper'>
                    {   
                        this.state.data.map(function(item,index) {
                            return (
                                index%2 !== 0  &&
                                <div key={index} class='item'>
                                    <image  src={item.image} />
                                    <text>{item.text}</text>
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
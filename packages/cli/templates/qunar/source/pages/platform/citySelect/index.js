import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            isSearch: false,
            searchResult: []
        };
    }
    componentDidMount() {
        let that = this;
        React.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        React.api.request({
            url: '/18752/qunar/city',
            success: function(data) {
                React.api.hideLoading();
                let curData = that.cleanData(data.data);
                that.setState({data: curData});
            }
        });
    }
    cleanData(data) {
        let result = [];
        let obj = {};

        data.map((item)=> {
            if (/[A-Z]/.test(item)) {
                if (item !== 'A') {
                    result.push(obj);
                }
                obj = {};
                obj.title = item;
                obj.data = [];
            } else {
                obj.data.push(item);
            }
        });
        result.push(obj);
        return result;
    }
    itemClick(city){
        React.api.showModal({
            title: '提示',
            content:
        '当前选择城市为：' + city,
            success: e => {
                if (e.confirm) {
                    var app = React.getApp();
                    app.globalData.citySelect = city;
                    React.api.navigateBack();
                }
            }
        });
    }
    render() {
        return (
            <div class='city-select'>
                <div class='search-wrapper'>
                    <input class="input" type='text' placeholder='搜索目的地'/>
                    <image class="image" src='../../../assets/image/search.png' />
                </div>
                {
                    this.state.isSearch
                        ? <div class = 'search-container'>
                            {
                                this.state.searchResult.map(function(item) {
                                    return (
                                        <div class='search-result-item' >{item}</div>
                                    );
                                })
                            }
                        </div>
                        : <div class='city-wrapper'>
                            {
                                this.state.data.map(function(item){
                                    return (
                                        <div class='city-item-wrapper' >
                                            <div class='title'>{item.title}</div>     
                                            <div class='city-item'>
                                                {
                                                    item.data.map(function(item){
                                                        return  (
                                                            <div
                                                                onTap={this.itemClick.bind(this,item)}
                                                                class="item"
                                                            >
                                                                <text>{item}</text>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                }
            </div>
        );
    }
}

export default P;
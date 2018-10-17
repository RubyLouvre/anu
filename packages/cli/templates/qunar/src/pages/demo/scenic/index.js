import React from '@react';
import './index.scss';

class P extends React.Component {
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
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/scenic',
            success: function(data) {
                React.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    }
    fun_tip() {
        React.api.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
  config = {
      backgrounColor: '#FFF',
      navigationBarBackgroundColor: '#1890ff',
      navigationBarTitleText: '景点门票',
      navigationBarTextStyle: '#d5d6d6'
  };
  render() {
      return (
          <div class="scenic">
              <div class="input-wrapper">
                  <input placeholder="请输入城市或景点" type="text" />
              </div>
              <div class="scenic-content">
                  {this.state.data.map(function(item, index) {
                      return (
                          <div class="item" key={index}>
                              <div class="title-wrapper">
                                  <div class="mark" />
                                  <div class="title">{item.title}</div>
                              </div>
                              {item.data.map(function(item, index) {
                                  return (
                                      <div onTap={this.fun_tip.bind(this)} class="scenic-item" key={index}>
                                          <image class="left-content" src={item.url} />
                                          <div class="right-content">
                                              <div>
                                                  <div class="scenic-name">{item.name}</div>
                                                  <div class="desc">{item.desc}</div>
                                                  <div class="comment">{item.comment + '评论'}</div>
                                              </div>

                                              <div class="price-distance c-flex">
                                                  <span class="price">{'￥' + item.price}</span>
                                                  <span class="distance">{item.distance + 'km'}</span>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  }
}

export default P;

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
        // React.api.showLoading({
        //     title: '获取资源中',
        //     mask: true
        // });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11595/qunar/scenic',
            success: function(data) {
                // React.api.hideLoading();
                // console.log('data', data.data);
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
      backgroundColor: '#000000',
      navigationBarBackgroundColor: '#1890ff',
      navigationBarTitleText: '景点门票',
      navigationBarTextStyle: 'white'
  };

  render() {
      return (
          <div class="scenic">
              <div class="input-wrapper">
                  <div class="input">
                      <input class="n-input" placeholder="请输入城市或景点" type="text" />
                  </div>
              </div>
              <div class="scenic-content col">
                  {this.state.data.map(function(item) {
                      return (
                          <div class="scenic-content-item col" >
                              <div class="title-wrapper">
                                  <div class="mark" />
                                  <text class="title">{item.title}</text>
                              </div>
                              {item.data.map(function(item, index) {
                                  return (
                                      <div onTap={this.fun_tip.bind(this)} class="scenic-item" key={index}>
                                          <image class="left-content" src={item.url} />
                                          <div class="right-content">
                                              <div class="col">
                                                  <text class="scenic-name">{item.name}</text>
                                                  <text class="desc">{item.desc}</text>
                                                  <text class="comment">{item.comment + '评论'}</text>
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

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
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/strategy',
            success: function(data) {
                React.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    }
  config = {
      backgrounColor: '#FFF',
      navigationBarBackgroundColor: '#fa541c',
      navigationBarTitleText: '去哪儿攻略',
      navigationBarTextStyle: '#d5d6d6'
  };
  fun_tip() {
      React.api.showModal({
          title: '提示',
          content: '该部分仅展示，无具体功能!',
          showCancel: false
      });
  }
  render() {
      return (
          <div class="strategy">
              {this.state.data.map(function(item, index) {
                  return (
                      <div onTap={this.fun_tip.bind(this)} class="strategy-item" key={index}>
                          <image class="big-image" src={item.bigImage} />
                          <div class="strategy-item-content">
                              <div>
                                  <span class="desc">{item.desc}</span>
                                  <span class="date">{item.date}</span>
                              </div>
                              <div class="user-wrapper">
                                  <div class="user-image">
                                      <image src={item.userImage} />
                                  </div>
                                  <div class="user-name">{item.userName}</div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  }
}

export default P;

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
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/strategy',
            success: function(data) {
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
          <div class="strategy-page">
              {this.state.data.map(function(item) {
                  return (
                      <div onTap={this.fun_tip.bind(this)} class="strategy-item col" >
                          <image class="big-image" src={item.bigImage} />
                          <div class="strategy-item-content">
                              <div class="col">
                                  <span class="desc fontColor">{item.desc}</span>
                                  <span class="date fontColor">{item.date}</span>
                              </div>
                              <div class="user-wrapper">
                                  <div class="user-image">
                                      <image class="image" mode="scaleToFill" src={item.userImage} />
                                  </div>
                                  <text class="user-name fontColor">{item.userName}</text>
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

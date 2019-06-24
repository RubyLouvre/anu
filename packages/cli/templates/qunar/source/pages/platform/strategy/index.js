import React from '@react';
import './index.scss';


class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }
    componentDidMount() {
        let that = this;
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11595/qunar/strategy',
            success: function(res) {
                if(Array.isArray(res.data)){
                    that.setState({ data: res.data  });
                }
            },
            fail: function(e){
                console.log(e, 'fail')
            }
        });
    }
  config = {
      backgroundColor: '#ffffff',
      navigationBarBackgroundColor: '#fa541c',
      navigationBarTitleText: '去哪儿攻略',
      navigationBarTextStyle: '#d5d6d6'
  };
  showTip() {
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
                      <div key={item.desc} onTap={this.showTip.bind(this)} class="strategy-item col" >
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

import React from '@react';
import './index.scss';
// eslint-disable-next-line
class MY extends React.Component {
    constructor() {
        super();
        this.state = {
            userInfo: {},
            show: true,
            userListInfo: [
                {
                    icon: '../../assets/images/iconfont-dingdan.png',
                    text: '我的订单',
                    isunread: true,
                    unreadNum: 2
                },
                {
                    icon: '../../assets/images/iconfont-card.png',
                    text: '我的代金券',
                    isunread: false,
                    unreadNum: 2
                },
                {
                    icon: '../../assets/images/iconfont-icontuan.png',
                    text: '我的拼团',
                    isunread: true,
                    unreadNum: 1
                },
                {
                    icon: '../../assets/images/iconfont-shouhuodizhi.png',
                    text: '收货地址管理'
                },
                {
                    icon: '../../assets/images/iconfont-kefu.png',
                    text: '联系客服'
                },
                {
                    icon: '../../assets/images/iconfont-help.png',
                    text: '常见问题'
                }
            ]
        };
    }

  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '我的',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2F2F2',
      //   enablePullDownRefresh: true
  };

  componentWillMount() {
      // console.log(app)
      // var that = this;
      // app.getUserInfo(function(userInfo) {
      //   console.log('userInfo', userInfo);
      //   that.setData({
      //     userInfo: userInfo
      //   });
      // });
  }

  show(text) {
      React.api.showToast({
          title: text,
          icon: 'success',
          duration: 2000
      });
  }

  getUserInfo(e) {

      this.setState({
          userInfo: e.userInfo,
          show: false
      });
  }

  render() {
      return (
          <div className="chat-container anu-col">
              <div className="userinfo">
                  {this.state.show ? (
                      <button open-type="getUserInfo" onGetuserInfo={this.getUserInfo}>
              获取用户登录信息
                      </button>
                  ) : (
                      <div>
                          <image
                              className="userinfo-avatar"
                              src={this.state.userInfo.avatarUrl}
                              background-size="cover"
                          />
                          <div className="userinfo-nickname">{this.state.userInfo.nickName}</div>
                      </div>
                  )}
              </div>
              <div className="info_list anu-col">
                  {this.state.userListInfo.map(function(item) {
                      return (
                          <div className="weui_cell" key={item.text} onTap={this.show.bind(this, item.text)}>
                              <div>
                                  <div className="weui_cell_hd">
                                      <image src={item.icon} />
                                  </div>
                                  <div class="weui_cell_bd">
                                      <div class="weui_cell_bd_p"> {item.text} </div>
                                  </div>
                              </div>
                              <div>
                                  {item.isunread && <div className="badge">{item.unreadNum}</div>}
                                  <div class="with_arrow">
                                      <image src="../../assets/images/icon-arrowdown.png" />
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  }
}

export default MY;

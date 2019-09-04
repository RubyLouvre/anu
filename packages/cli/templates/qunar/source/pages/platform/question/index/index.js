import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            navBtnActiveIndex: 1,
            isQuestion: true,
            data: [],
            city: '北京'
        };
        this.colStyle = {};
        if (process.env.ANU_ENV === 'quick') {
            // 对于快应用的样式代码
            this.colStyle = {
                display: 'flex',
                flexDirection: 'column'
            };
        }
    }
    navItemClick(navBtnActiveIndex) {
        this.setState({ navBtnActiveIndex });
        if (navBtnActiveIndex === 1 || navBtnActiveIndex === 2) {
            this.getData();
        }
    }
    switchFun() {
        this.setState({ isQuestion: !this.state.isQuestion });
    }
    getData() {
        let that = this;
        // React.api.showLoading({
        //     title: '获取资源中',
        //     mask: true
        // });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11595/qunar/question',
            success: function(data) {
                // React.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    }
    questionDetail() {
        React.api.navigateTo({ url: '/pages/platform/question/detail/index' });
    }
    componentDidMount() {
        this.getData();
    }
    onShow() {
        let app = React.getApp();
        if (app.globalData.citySelect) {
            this.setState({ city: app.globalData.citySelect });
        }
    }
  config = {
      backgroundColor: 'rgb(240, 240, 240);',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '趣问答',
      navigationBarTextStyle: 'black'
  };
  toCitySelect() {
      this.navItemClick(2);
      React.api.navigateTo({ url: '/pages/platform/citySelect/index' });
  }
  render() {
      return (
          <div class="question">
              <div class="nav-wrapper" style={this.colStyle}>
                  <div class=" row">
                      <text
                          onTap={this.navItemClick.bind(this, 0)}
                          class={'nav-btn ' + (this.state.navBtnActiveIndex === 0 ? 'active' : '')}
                      >
            我的问答
                      </text>
                      <text
                          onTap={this.navItemClick.bind(this, 1)}
                          class={'nav-btn ' + (this.state.navBtnActiveIndex === 1 ? 'active' : '')}
                      >
            推荐
                      </text>
                      <div class="nav-btn">
                          <text onTap={this.navItemClick.bind(this, 2)} class={(this.state.navBtnActiveIndex === 2 ? 'active' : '')}>{this.state.city}</text>
                          <div onTap={this.toCitySelect.bind(this)} class="open-icon-wrapper">
                              {
                                  this.state.navBtnActiveIndex === 2 ?
                                      <image class="open-icon image" src="../../../../assets/image/open_select.png" /> :
                                      <image class="open-icon image" src="../../../../assets/image/open.png" />
                              }
                          </div>
                      </div>
                  </div>
                  <div
                      class={ 
                          'switch-bar ' +
              (this.state.navBtnActiveIndex === 1
                  ? 'second-choose'
                  : this.state.navBtnActiveIndex === 0
                      ? 'first-choose'
                      : 'third-choose')
                      }
                  />
              </div>
              <div class="quest-content" style={this.colStyle}>
                  {this.state.navBtnActiveIndex === 0 && (
                      <div class="my-question-answer">
                          <div class="tool">
                              <div>{this.state.isQuestion ? '共有0个提问' : '共有0个回答'}</div>
                              <div onTap={this.switchFun.bind(this)} class="switch-wrapper">
                                  <div>{this.state.isQuestion ? '切换至回答' : '切换至提问'}</div>
                              </div>
                          </div>
                          <div class="no-data-prompt">
                              <image class="image" src="../../../../assets/image/order_none.png" />
                              <div class="message">
                                  {this.state.isQuestion
                                      ? '您还没有发布过问题，去提问吧~'
                                      : '您还没有发布过回答，去回答吧~'}
                              </div>
                          </div>
                      </div>
                  )}
                  {(this.state.navBtnActiveIndex === 1 || this.state.navBtnActiveIndex === 2) && (
                      <div class="all-question" style={this.colStyle}>
                          {this.state.data.map(function(item) {
                              return (
                                  <div onTap={this.questionDetail.bind(this)} class="question-item" style={this.colStyle} >
                                      <div class="quest-title"> 
                                          {item.isRemark && (
                                              <span
                                                  class={
                                                      'remark ' +
                            (item.remark === '最新'
                                ? 'new'
                                : item.remark === '置顶'
                                    ? 'stick'
                                    : 'hot')
                                                  } 
                                              >
                                                  {item.remark}
                                              </span>
                                          )}
                                          <span class={`${item.isRemark ? 'width' : ''} title`}>{item.title}</span>
                                      </div>

                                      <text class="desc hide-text">{item.desc}</text>
                                      <div class="other-message">
                                          <div class="other-message-item">
                                              <image class="eye image" src="../../../../assets/image/eye.png" />
                                              <text class="eye-text text">{item.seeNum}</text>
                                          </div>
                                          <div class="other-message-item">
                                              <image class="image" src="../../../../assets/image/message.png" />
                                              <text class="text">{item.commentNum}</text>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </div>
          </div>
      );
  }
}

export default P;

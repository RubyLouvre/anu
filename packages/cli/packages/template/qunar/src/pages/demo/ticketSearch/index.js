import React from '@react';
import './index.less';
class P extends React.Component {
    constructor() {
        super();

        this.state = {
            depCity: '北京',
            arrCity: '上海',
            exchangeStatus: '',
            displayDate: '8月28日',
            dateWeek: '周二',
            isOnlyGaotie: false
        };
    }
    componentDidMount() {
        React.getApp().globalData.dateSelect = new Date();
    }
    componentDidShow() {
        let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        let date = React.getApp().globalData.dateSelect;
        this.setState({ displayDate: date.getMonth() + 1 + '月' + date.getDate() + '日' });
        this.setState({ dateWeek: week[date.getDay()] });
    }
    toDateSelect() {
        wx.navigateTo({
            url: '../../demo/calendar/index'
        });
    }
  config = {
      backgroundColor: '#feb64e',
      navigationBarBackgroundColor: '#feb64e'
  };
  render() {
      return (
          <div className="page" style="{background-color: #feb64e}">
              <image
                  className="sreach_bg"
                  mode="scaleToFill"
                  src="http://picbed.qunarzz.com/image/b96f82f01ef5850d50e93ea511f618fa.png"
              />
              <div style="{top: -15px}" className="search-container">
                  <div className="citySelector">
                      <div className="cityTap">
                          <div
                              className={'depCityContent ' + (this.state.exchangeStatus ? 'depCity-changig' : '')}
                          >
                              {this.state.depCity}
                          </div>
                      </div>
                      <div className="city_change">
                          <image
                              className="exchange-logo"
                              mode="widthFix"
                              src="../../../assets/image/train_icon.png"
                          />
                          <image
                              className={'exchange-btn ' + (this.state.exchangeStatus ? 'btn-rotating' : '')}
                              src="../../../assets/image/search_btn.png"
                          />
                      </div>
                      <div className="cityTap">
                          <div
                              className={
                                  'arrCityContent ' + (this.state.exchangeStatus ? 'arrCity-changing' : '')
                              }
                          >
                              {this.state.arrCity}
                          </div>
                      </div>
                  </div>

                  <div onTap={this.toDateSelect} className="dateSelector">
                      {this.state.displayDate}
                      <div className="date-week">{this.state.dateWeek}</div>
                  </div>

                  <div className="switch-content">
                      <div className="switch-label">
                          <image
                              className="hight-speed"
                              mode="widthFix"
                              src="../../../assets/image/train_highSpeed.png"
                          />
                          <div
                              className={
                                  this.state.isOnlyGaotie
                                      ? 'switch-context switch-label-check'
                                      : 'switch-context switch-label-uncheck'
                              }
                          >
                只查看高铁/动车
                          </div>
                      </div>
                      <switch checked={this.state.isOnlyGaotie} color="#00bcd4" />
                  </div>

                  <div className="search-button">搜 索</div>

                  <div className="actions-container">
                      <div className="order-action">
                          <text className="g-q-iconfont order-icon" />
                          <text className="action-text">我的订单</text>
                      </div>
                      <div className="seprator" />
                      <div className="feedback-action">
                          <text className="g-q-iconfont feedback-icon" />
                          <text className="action-text">咨询反馈</text>
                      </div>
                  </div>
              </div>

              <div className="welfare-entrance">
                  <div className="welfare-content">
                      <div className="welfare-action">
                          <image
                              className="welfare-icon"
                              src="http://s.qunarzz.com/open_m_train/miniprogram/home_redpack.png"
                          />
                          <text className="action-text">优惠拼团</text>
                      </div>
                      <div className="seprator" />
                      <div className="welfare-action">
                          <image
                              className="welfare-icon"
                              src="http://s.qunarzz.com/open_m_train/miniprogram/home_welfare.png"
                          />
                          <text className="action-text">我的福利</text>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}

export default P;

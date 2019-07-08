import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();

        this.state = {
            depCity: '北京',
            arrCity: '上海',
            exchangeStatus: false,
            displayDate: '8月28日',
            dateWeek: '周二',
            isOnlyGaotie: false,
            isStartCity: true
        };
    }
    componentWillMount() {
        
        React.getApp().globalData.dateSelect = new Date();
    }
    onShow() {
        let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
       
        let date = React.getApp().globalData.dateSelect;
        this.setState({ displayDate: date.getMonth() + 1 + '月' + date.getDate() + '日' });
        this.setState({ dateWeek: week[date.getDay()] });

        let app = React.getApp();
        if (app.globalData.citySelect) {
            if (!this.state.isStartCity) {
                this.setState({arrCity: app.globalData.citySelect});
            } else {
                this.setState({depCity: app.globalData.citySelect});
            }
        }
    }
    toDateSelect() {
        React.api.navigateTo({
            url: '/pages/platform/calendar/index'
        });
    }
    toCitySelect(isStartCity) {
        this.setState({isStartCity});
        let app = React.getApp();
        if (!isStartCity) {
            app.globalData.citySelect = '上海';
        } else {
            app.globalData.citySelect = '北京';
        }
        React.api.navigateTo({
            url: '/pages/platform/citySelect/index'
        });
    }
    exChangeCity() {
        this.setState({ exchangeStatus: !this.state.exchangeStatus });
    }
    showTip() {
        React.api.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    handleChangeSwitch() {
        this.setState({ isOnlyGaotie: !this.state.isOnlyGaotie });
    }
  config = {
      backgroundColor: '#feb64e',
      navigationBarBackgroundColor: '#feb64e',
      navigationBarTitleText: '车牌搜索'
  };

  render() {
      return (
          <div className="ticket-page" style="background-color: #feb64e">
              <image
                  className="sreach_bg"
                  mode="scaleToFill"
                  src="http://picbed.qunarzz.com/image/b96f82f01ef5850d50e93ea511f618fa.png"
              />
              <div style="top: -15px" className="search-container anu-block">
                  <div className="citySelector">
                      <div onTap={this.toCitySelect.bind(this,true)} className="cityTap">
                          <text  className='depCityContent'>{this.state.depCity}</text>
                      </div>
                      <div className="city_change">
                          <image
                              className="exchange-logo"
                              src="../../../assets/image/train_icon.png"
                          />
                          <image
                              className='exchange-btn'
                              src="../../../assets/image/search_btn.png"
                          />
                      </div>
                      
                      <div onTap={this.toCitySelect.bind(this,false)} className="cityTap flex-right">
                          <text className='arrCityContent'>{this.state.arrCity}</text>
                      </div>
                  </div>

                  <div onTap={this.toDateSelect} className="dateSelector">
                      <span>{this.state.displayDate}</span>
                      <span class="date-week-text">{this.state.dateWeek}</span>
                  </div>

                  <div className="switch-content">
                      <div className="switch-label">
                          <image
                              className="hight-speed"
                              mode="scaleToFill"
                              src="../../../assets/image/train_highSpeed.png"
                          />
                          <text  className={'switch-context ' + 
                                  (this.state.isOnlyGaotie
                                      ? 'switch-label-check'
                                      : 'switch-label-uncheck')
                          }>只查看高铁/动车</text>
                      </div>
                      <switch
                          class="switch"
                          checked={this.state.isOnlyGaotie}
                          onChange={this.handleChangeSwitch.bind(this)}
                          color="#00bcd4"
                      />
                  </div>

                  <text onTap={this.showTip} className="search-button">
            搜 索
                  </text>

                  <div className="actions-container">
                      <div onTap={this.showTip} className="order-action">
                          <text className="action-text">我的订单</text>
                      </div>
                      <div className="seprator" />
                      <div onTap={this.showTip} className="feedback-action">
                          <text className="action-text">咨询反馈</text>
                      </div>
                  </div>
              </div>

              <div className="welfare-entrance">
                  <div className="welfare-content">
                      <div onTap={this.showTip} className="welfare-action">
                          <image 
                              className="welfare-icon"
                              src="http://s.qunarzz.com/open_m_train/miniprogram/home_redpack.png"
                          />
                          <text className="action-text">优惠拼团</text>
                      </div>
                      <div className="seprator"></div>
                      <div onTap={this.showTip} className="welfare-action">
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

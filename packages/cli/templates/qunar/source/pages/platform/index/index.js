import React from '@react';
import './index.scss';
/*eslint-disable*/

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            indexPageIcons: [
                {
                    class: 'radius-top-left',
                    bizTitle: 'API',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/hotel2.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/apis/index/index'
                },
                {
                    class: '',
                    bizTitle: '内置组件',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/flight1.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/native/index/index'
                },
                {
                    class: 'radius-top-right',
                    bizTitle: '语法',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/train2.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/syntax/index/index'
                },
                {
                    class: '',
                    bizTitle: '车票搜索',
                    businessUrl: '/common/pages/search/index?from=home&bizType=bus',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/bus1.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/platform/ticketSearch/index'
                },
                {
                    class: '',
                    bizTitle: '日期选择',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/car1.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/platform/calendar/index'
                },
                {
                    class: '',
                    bizTitle: '船票',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ship1.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/platform/boat/index'
                },
                {
                    class: 'radius-bottom-left',
                    bizTitle: '瀑布流',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/vacation2.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/platform/cardList/index'
                },
                {
                    class: '',
                    bizTitle: '景点·门票',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ticket1.png',
                    showSpecialLogo: false,
                    specialText: '',
                    url: '/pages/platform/scenic/index'
                },
                {
                    class: 'radius-bottom-right',
                    bizTitle: '攻略',
                    logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/travel2.png',
                    showSpecialLogo: false,
                    specialText: 'if测试',
                    url: '/pages/platform/strategy/index'
                }
            ],

            toolData: [
                {
                    url: 'https://source.qunarzz.com/site/images/wap/home/recommend/dainifei.png',
                    title: '带你飞'
                },
                {
                    url: 'https://s.qunarzz.com/wechatapp/home/toolbars/book.png',
                    title: '旅行账本'
                },
                {
                    url: 'https://source.qunarzz.com/site/images/wap/home/recommend/xingchengzhushou.png',
                    title: '行程助手'
                },
                {
                    url: 'https://source.qunarzz.com/site/images/wap/home/recommend/hangbandongtai.png',
                    title: '航班动态'
                }
            ],
            specialOfferData: [
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/flight.jpg',
                    title: '特价机票'
                },
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/ticket.jpg',
                    title: '优惠门票'
                },
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/vacation.jpg',
                    title: '旅行特价'
                },
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/flight.jpg',
                    title: '特价机票1'
                },
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/ticket.jpg',
                    title: '优惠门票1'
                },
                {
                    url: 'http://s.qunarzz.com/wechatapp/home/special/vacation.jpg',
                    title: '旅行特价1'
                }
            ]
        };
    }
  static config = {
      backgroundColor: '#fff',
      navigationBarBackgroundColor: '#feb64e',
      navigationBarTitleText: 'Qunar',
      navigationBarTextStyle: 'white'
  };
  gotoSome(url) {
      console.log('url', url);
      if (url){
          React.api.navigateTo({ url });
      } else {
          this.showTip();
      }
  }
  componentDidMount() {
      // eslint-disable-next-line
    console.log('page did mount!');
  }
  componentWillMount() {
      // eslint-disable-next-line
    console.log('page will mount!');
  }
  showTip() {
      React.api.showModal({
          title: '提示',
          content: '该部分仅展示，无具体功能!',
          showCancel: false
      });
  }
  onShareAppMessage(res) {
    return {
        title: '标题',
        path: 'http://www.example.com',
        success: function(data) {
            React.api.showToast({ title: 'handling success'});
            console.log('handling success')
        },
        fail: function(data, code) {
            React.api.showToast({ title: `code=${code}, ${data}` });
            console.log(`code=${code}, ${data}`)
        }
    }
  }
  render() {
      return (
          <div class="demo-page">
              <image
                  mode="aspectFit"
                  class="top-image"
                  src="https://s.qunarzz.com/wechatapp/home/banner0510-002.png"
              />
              <div class="nav-wrapper c-flex">
                  {this.state.indexPageIcons.map(function(item) {
                      return (
                          <div
                              class='item-wrapper'
                              key={item.bizTitle}
                              onTap={this.gotoSome.bind(this, item.url)}
                          >
                              <image src={item.logoSrc} class={`itemBgc ${item.class}`} />
                              <text class="title">{item.bizTitle}</text>
                              {item.showSpecialLogo && item.specialText.length ? (
                                  <div class="special-text">{item.specialText}</div>
                              ) : (
                                  ''
                              )}
                          </div>
                      );
                  })}
              </div>
              <div class="tool-wrapper">
                  {this.state.toolData.map(function(item) {
                      return (
                          <div onTap={this.showTip} class="tool-item" key={item.title} >
                              <image class="image" src={item.url} />
                              <text class="text">{item.title}</text>
                          </div>
                      );
                  })}
              </div>
              <div class="special-offer anu-block">
                  <text class="title">特价专区</text>
                  <swiper
                      class="special-offer-wrapper"
                      interval={2500}
                      autoplay={true}
                      displayMultipleItems={3}
                  >
                      {this.state.specialOfferData.map(function(item) {
                          return (
                                  <swiper-item onTap={this.showTip} key={item.title}  class="special-offer-item anu-block">
                                      <image class="special-offer-image" src={item.url} />
                                      <text class="special-offer-text">{item.title}</text>
                                  </swiper-item>
                          );
                      })}
                  </swiper>
              </div>
              <div class="activity anu-block">
                  <text class="title">活动专区</text>
                  <div class="activity-wrapper">
                      <div onTap={this.showTip} class="left-content">
                          <image class="image" src="https://img1.qunarzz.com/order/comp/1808/c3/dda9c77c3b1d8802.png" />
                          <div class="activity-content">
                            <text>
                               <span class="title">何时飞</span>
                               <span class="desc">机票趋势早知道</span>
                             </text> 
                          </div>
                      </div>
                      <div class="right-content">
                          <div onTap={this.showTip} class="right-content-wrapper first-child">
                              <image
                                  class="image"
                                  src="https://img1.qunarzz.com/order/comp/1808/3b/fd717d94ed8b6102.jpg"
                              />
                              <div class="activity-content">
                                  <text class="title">人格测试</text>
                                  <text class="desc">简直惊悚</text>
                              </div>
                          </div>
                          <div onTap={this.showTip} class="right-content-wrapper">
                              <image class="image" src="https://img1.qunarzz.com/order/comp/1806/1c/61cd118da20ec702.jpg" />
                              <div class="activity-content anu-block">
                                  <text class="title">飞行宝贝</text>
                                  <text class="desc">榜单有礼</text>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}

export default P;
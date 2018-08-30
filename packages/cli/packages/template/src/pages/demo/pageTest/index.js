import React from '@react';
import './index.less';

class P extends React.Component {
  constructor() {
    super();
    this.state = {
      indexPageIcons: [
        {
          class: 'radius-top-left',
          bizTitle: '基础内容',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/hotel2.png',
          showSpecialLogo: false,
          specialText: '',
          url: '../../../pages/demo/baseContent/base/index'
        },
        {
          class: '',
          bizTitle: '内置组件',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/flight1.png',
          showSpecialLogo: false,
          specialText: '',
          url: '../../../pages/demo/native/index/index'
        },
        {
          class: 'radius-top-right',
          bizTitle: '语法',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/train2.png',
          showSpecialLogo: false,
          specialText: '',
          url: '../../../pages/demo/express/index'
        },
        {
          class: '',
          bizTitle: '车牌搜索',
          businessUrl: '/common/pages/search/index?from=home&bizType=bus',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/bus1.png',
          showSpecialLogo: false,
          specialText: '',
          url: '../../../pages/demo/ticketSearch/index'
        },
        {
          class: '',
          bizTitle: '专车·巴士',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/car1.png',
          showSpecialLogo: false,
          specialText: '',
          url: ''
        },
        {
          class: '',
          bizTitle: '船票',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ship1.png',
          showSpecialLogo: false,
          specialText: '',
          url: ''
        },
        {
          class: 'radius-bottom-left',
          bizTitle: '旅游',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/vacation2.png',
          showSpecialLogo: false,
          specialText: '',
          url: ''
        },
        {
          class: '',
          bizTitle: '景点·门票',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ticket1.png',
          showSpecialLogo: false,
          specialText: '',
          url: ''
        },
        {
          class: 'radius-bottom-right',
          bizTitle: '攻略',
          logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/travel2.png',
          showSpecialLogo: false,
          specialText: 'if测试',
          url: ''
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
        }
      ]
    };
  }
  config = {
    backgrounColor: '#FFF',
    navigationBarBackgroundColor: '#feb64e',
    navigationBarTitleText: '页面测试',
    navigationBarTextStyle: '#fff'
  };
  gotoSome(url) {
    url && wx.navigateTo({ url });
  }
  onload() {
    wx.request;
  }
  render() {
    return (
      <div class="page">
        <image
          mode="aspectFit"
          class="top-image"
          src="https://s.qunarzz.com/wechatapp/home/banner0510-002.png"
        />
        <div class="nav-wrapper">
          {this.state.indexPageIcons.map(function(item, index) {
            return (
              <div class={ 'item-wrapper ' + item.class} key={index} onTap={this.gotoSome.bind(this, item.url)}>
                <image src={item.logoSrc} class="itemBgc" />
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
          {this.state.toolData.map(function(item, index) {
            return (
              <div class="tool-item" key={index}>
                <image src={item.url} />
                <text>{item.title}</text>
              </div>
            );
          })}
        </div>
        <div class="special-offer">
          <div class="title">特价专区</div>
          <div class="special-offer-wrapper">
            {this.state.specialOfferData.map(function(item, index) {
              return (
                <div class="special-offer-item" key={index}>
                  <image src={item.url} />
                  <text>{item.title}</text>
                </div>
              );
            })}
          </div>
        </div>
        <div class="activity">
          <div class="title">活动专区</div>
          <div class="activity-wrapper">
            <div class="left-content">
              <image src="https://img1.qunarzz.com/order/comp/1808/c3/dda9c77c3b1d8802.png" />
              <div class="content">
                <text class="title">何时飞</text>
                <text class="desc">机票趋势早知道</text>
              </div>
            </div>
            <div class="right-content">
              <div class="right-content-wrapper">
                <image
                  src="https://img1.qunarzz.com/order/comp/1808/3b/fd717d94ed8b6102.jpg
"
                />
                <div class="content">
                  <text class="title">人格测试</text>
                  <text class="desc">简直惊悚</text>
                </div>
              </div>
              <div class="right-content-wrapper">
                <image src="https://img1.qunarzz.com/order/comp/1806/1c/61cd118da20ec702.jpg" />
                <div class="content">
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

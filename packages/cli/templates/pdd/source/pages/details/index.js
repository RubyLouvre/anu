import React from '@react';
import './index.scss';
class Detail extends React.Component {
    constructor() {
        super();
        this.state = {
            indicatorDots: true,
            vertical: false,
            autoplay: true,
            interval: 3000,
            duration: 1200,
            imgUrls: [
                'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
            ],
            shopppingDetails: {
                title:
          'Aveeno艾诺维宝宝天然燕麦体验装！带去旅行真是太方便了，¥50一套 洗发沐浴露100ml.+身体乳',
                reason:
          'Aveeno艾惟诺,美国婴幼儿专家及肌肤专家力荐品牌,燕麦活萃,天然呵护!Aveeno艾惟诺中国商城-Aveeno海外旗舰店,100%正品保证,原装进口.'
            }
        };
    }

  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '商品详情',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2F2F2',
      enablePullDownRefresh: true
  };
  componentWillMount() {
      // eslint-disable-next-line
      console.log('query', this.props.query.id);
  }

  render() {
      return (
          <div className="chat-container">
              <div>
                  <swiper
                      className="swiper_box"
                      indicator-dots={this.state.indicatorDots}
                      vertical={this.state.vertical}
                      autoplay={this.state.autoplay}
                      interval={this.state.interval}
                      duration={this.state.duration}
                      onChange={this.swiperchange}
                  >
                      {this.state.imgUrls.map(function(item) {
                          return (
                              <swiper-item>
                                  <image src={item} className="slide-image" key={item} />
                              </swiper-item>
                          );
                      })}
                  </swiper>
              </div>
              <div class="shopping_container">
                  <div class="title">{this.state.shopppingDetails.title}</div>
                  <div class="reason">{this.state.shopppingDetails.reason}</div>
              </div>
          </div>
      );
  }
}

export default Detail;

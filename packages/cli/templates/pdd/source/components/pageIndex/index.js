import React from '@react';
class PageIndex extends React.Component {
    constructor() {
        super();
        this.state = {
            indicatorDots: true,
            vertical: false,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            imgUrls: [
                'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
                'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
            ]
        };
    }
  swiperchange = e => {
      // eslint-disable-next-line
      console.log(e);
  };

  
  render() {
      return (
          <div className="chat-container ">
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
              <div className="text">
                  <div className="line_flag" />
                  <div>主题馆</div>
              </div>
              <div className="venues_box">
                  <div className="venues_list">
                      {this.props.indexPageIcons.map(function(item) {
                          return (
                              <div class="venues_item" key={item.bizIndex}>
                                  <navigator url={'../pages/brand/index?id='+item.bizIndex}>
                                      <image src={item.logoSrc} className="slide-image-2"/>
                                  </navigator>
                              </div>
                          );
                      })}
                  </div>
              </div>
              <div className="text">
                  <div className="line_flag" />
                  <div>全球精选</div>
              </div>
              <div className="venues_box">
                  <div className="venues_list">
                      {this.props.choiceItems.map(function(item) {
                          return (
                              <div class="venues_item" key={item.bizIndex}>
                                  <navigator url={'../pages/details/index?id='+item.bizIndex}>
                                      <image src={item.logoSrc} className="slide-image-1"/>
                                  </navigator>
                              </div>
                          );
                      })}
                  </div>
              </div>
              <loading hidden={this.props.loadingHidden}>加载中...</loading>
          </div>
      );
  }
}

export default PageIndex;

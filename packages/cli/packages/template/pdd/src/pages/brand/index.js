import React from '@react';
import './index.scss';
class Brand extends React.Component {
    constructor() {
        super();
        this.state = {
            brandList: {
                brand: []
            }
        };
    }

  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '品牌',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2F2F2',
      enablePullDownRefresh: true
  };

  componentWillMount() {
      //sliderList
      var that = this;
      wx.request({
          url: 'http://yapi.demo.qunar.com/mock/17668/wemall/venues/getBrandAndType',
          method: 'GET',
          data: {},
          header: {
              Accept: 'application/json'
          },
          success: function(res) {
              that.setState({
                  brandList: res.data
              });
          }
      });
  }

  render() {
      return (
          <div class="chat-container">
              {this.state.brandList.brand.map(function(item) {
                  return (
                      <div className="brand_item">
                          <navigator
                              url={
                                  '../list/index?brand=' +
                  11 +
                  '&typeid=' +
                  12
                              }
                          >
                              <image src={item.pic} className="pic" />
                              <div className="right_cont">
                                  <span className="name">{item.chinesename}</span>
                                  <span className="brief">{item.brief}</span>
                                  <span className="price">
                    ￥{item.minprice}
                    元/件起
                                  </span>
                              </div>
                          </navigator>
                      </div>
                  );
              })}
          </div>
      );
  }
}

export default Brand;

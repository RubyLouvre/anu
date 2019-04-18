import React from '@react';
import './index.less';
class List extends React.Component {
    constructor() {
        super();
        this.state = {
            list: []
        };
    }

  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '品牌列表',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2F2F2',
      enablePullDownRefresh: true
  };

  componentWillMount() {
      var that = this;
      // console.log(this.props.query)
      React.api.request({
          url:
        'http://yapi.demo.qunar.com/mock/11550/wemall/goods/inqGoodsByTypeBrand?brand=' +
        this.props.query.brand +
        '&typeid=' +
        this.props.query.brand,
          method: 'GET',
          data: {},
          header: {
              Accept: 'application/json'
          },
          success: function(res) {
              that.setState({
                  list: res.data
              });
          }
      });
  }

  render() {
      return (
          <div className="chat-container">
              {this.state.list.map(function(item) {
                  return (
                      <navigator key={item.id} url={'../details/index?id=' + item.id}>
                          <div class="brand_item">
                              <image src={item.goodspics} class="pic" />

                              <div class="right_cont">
                                  <div class="country">
                                      {item.country}
                    直采 {item.bigname}
                    发货
                                  </div>
                                  <div class="name">{item.title}</div>
                                  <div class="price">
                                      <span class="marketprice">
                      ￥{item.marketprice}.00
                                      </span>
                                      <span class="discount">8折</span>
                                      <span class="ourprice">
                      ￥{item.ourprice}.00
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </navigator>
                  );
              })}
          </div>
      );
  }
}

export default List;

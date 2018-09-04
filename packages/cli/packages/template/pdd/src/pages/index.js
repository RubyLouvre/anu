import React from '@react';
import PageIndex from '@components/pageIndex/index';
// import Dog from '@components/Dog/index'
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            loadingHidden: false, // loading
            indexPageIcons: [],
            choiceItems: []
        };
    }
  config = {
      backgroundTextStyle: 'white',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '环球小镇',
      navigationBarBackgroundColor: '#292929',
      backgroundColor: '#F2f2f2',
      enablePullDownRefresh: true
  };
  globalData = {
      userInfo: null
  };

  componentWillMount() {
      // eslint-disable-next-line
    console.log('weixinchat onLoad');
      //sliderList
      var that = this;
      wx.request({
          url: 'http://yapi.demo.qunar.com/mock/17668/wemall/venues/venuesList',
          method: 'GET',
          data: {},
          header: {
              Accept: 'application/json'
          },
          success: function(res) {
              that.setState({
                  indexPageIcons: res.data.indexPageIcons
              });
          }
      });

      //choiceList
      wx.request({
          url: 'http://yapi.demo.qunar.com/mock/17668/wemall/venues/choiceList',
          method: 'GET',
          data: {},
          header: {
              Accept: 'application/json'
          },
          success: function(res) {
              that.setState({
                  choiceItems: res.data.indexPageIcons
              });
              setTimeout(function() {
                  that.setState({
                      loadingHidden: true
                  });
              }, 1500);
          }
      });
  }

  render() {
      return (
          <div>
              <PageIndex
                  loadingHidden={this.state.loadingHidden}
                  indexPageIcons={this.state.indexPageIcons}
                  choiceItems={this.state.choiceItems}
              />
          </div>
      );
  }
}

export default P;

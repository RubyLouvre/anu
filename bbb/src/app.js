import React from '@react';

import './pages/index';
/*
import './pages/my/index';
import './pages/classify/index';
import './pages/cart/index';
import './pages/details/index';
import './pages/brand/index';
import './pages/list/index';
*/
import './app.less';

class Demo extends React.Component {
  config = {
      window: {
          backgroundTextStyle: 'light',
          navigationBarBackgroundColor: '#0088a4',
          navigationBarTitleText: 'mpreact',
          navigationBarTextStyle: '#fff',
          backgroundColor: '#F2F2F2'
      },
      
  };
  globalData = {
      userInfo: null
  };
  onLaunch() {
      // eslint-disable-next-line
    console.log('App launched');
      //调用登录接口
      wx.login({
          success: function(r) {
              if (r.code) {
                  // eslint-disable-next-line
                  let code = r.code;
                  wx.getUserInfo({
                      success: function() {
                          // console.log('res', res);
                      }
                  });
              }
          }
      });

  }
//   getUserInfo(cb) {
//     var that = this;
//     if (this.globalData.userInfo) {
//       typeof cb == 'function' && cb(this.globalData.userInfo);
//     } else {
//       //调用登录接口
//       wx.login({
//         success: function(res) {
//           if (res.code) {
//             console.log('code', res.code);
//           }
//           //   wx.getUserInfo({
//           //     success: function (res) {
//           //       that.globalData.userInfo = res.userInfo
//           //       typeof cb == "function" && cb(that.globalData.userInfo)
//           //     }
//           //   })
//         }
//       });
//     }
//   }
}

// eslint-disable-next-line
App(new Demo());

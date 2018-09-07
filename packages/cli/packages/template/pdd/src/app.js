import React from '@react';

import './pages/index';

import './pages/my/index';
import './pages/classify/index';
import './pages/cart/index';
import './pages/details/index';
import './pages/brand/index';
import './pages/list/index';

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
      tabBar: {
          color: '#6e6d6b',
          selectedColor: '#f9f027',
          borderStyle: 'white',
          backgroundColor: '#292929',
          list: [
              {
                  pagePath: 'pages/index',
                  iconPath: 'assets/images/footer-icon-01.png',
                  selectedIconPath: 'assets/images/footer-icon-01-active.png',
                  text: '微商城'
              },
              {
                  pagePath: 'pages/classify/index',
                  iconPath: 'assets/images/footer-icon-02.png',
                  selectedIconPath: 'assets/images/footer-icon-02-active.png',
                  text: '分类'
              },
              {
                  pagePath: 'pages/cart/index',
                  iconPath: 'assets/images/footer-icon-03.png',
                  selectedIconPath: 'assets/images/footer-icon-03-active.png',
                  text: '购物车'
              },
              {
                  pagePath: 'pages/my/index',
                  iconPath: 'assets/images/footer-icon-04.png',
                  selectedIconPath: 'assets/images/footer-icon-04-active.png',
                  text: '我的'
              }
          ]
      }
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

import React from '@react';
import './pages/home/index';
import './pages/playlist/index';
import './pages/playing/index';
import './pages/recommend/index';
import './app.less';
import url from './utils/bsurl';
let bsurl = url.bsurl;

class Demo extends React.Component {
  static config = {
      window: {
          navigationBarTextStyle: 'white',
          navigationBarTitleText: 'Music',
          backgroundColor: '#fbfcfd',
          navigationBarBackgroundColor: '#BB2C08'
      }
  };
  globalData = {
      hasLogin: false,
      hide: false,
      list_am: [],
      list_dj: [],
      list_fm: [],
      list_sf: [],
      index_dj: 0,
      index_fm: 0,
      index_am: 0,
      playing: false,
      playtype: 1,
      curplay: {},
      shuffle: 1,
      globalStop: true,
      currentPosition: 0,
      staredlist: [],
      cookie: '',
      user: {}
  };
  onLaunch() {
      //针对快应用的全局getApp补丁
      if (this.$data && typeof global === 'object') {
          var ref = Object.getPrototypeOf(global) || global;
          var _this = this;
          this.globalData = this.$def.globalData;
          ref.getApp = function() {
              return _this;
          };
      }
    console.log('App launched');//eslint-disable-line
  }
  stopmusic() {

      React.api.pauseBackgroundAudio();
  }

  seekmusic(type, seek, cb) {
      var that = this;
      var m = this.globalData.curplay;
      if (!m.id) return;
      this.globalData.playtype = type;
      if (cb) {
          this.playing(type, cb, seek);
      } else {
          this.geturl(function() {
              that.playing(type, cb, seek);
          });
      }
  }

  geturl(suc, err) {
      var that = this;
      var m = that.globalData.curplay;
      React.api.request({
          url: bsurl + 'music/url',
          data: {
              id: m.id,
              br: 128000
          },
          success: function(a) {
              a = a.data.data[0];
              if (!a.url) {
                  err && err();
              } else {
                  that.globalData.curplay.url = a.url;
                  that.globalData.curplay.getutime = new Date().getTime();
                  if (that.globalData.staredlist.indexOf(that.globalData.curplay.id) != -1) {
                      that.globalData.curplay.starred = true;
                      that.globalData.curplay.st = true;
                  }
                  suc && suc();
              }
          }
      });
  }

  playing(type, cb, seek) {
      var that = this;
      var m = that.globalData.curplay;
      React.api.playBackgroundAudio({
          dataUrl: m.url,
          title: m.name,
          success: function() {

              if (seek != undefined) {
                  React.api.seekBackgroundAudio({ position: seek });
              }
              that.globalData.globalStop = false;
              that.globalData.playtype = type;
              that.globalData.playing = true;
              // nt.postNotificationName('music_toggle', {
              //   playing: true,
              //   music: that.globalData.curplay,
              //   playtype: that.globalData.playtype
              // });
              cb && cb();
          },
          fail: function() {
              if (type != 2) {
                  that.nextplay(1);
              } else {
                  that.nextfm();
              }
          }
      });
  }
}

// eslint-disable-next-line
export default App(new Demo());


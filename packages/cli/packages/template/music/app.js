import React from '@react';
import './pages/home/index';
import './pages/playlist/index';
import './pages/playing/index';
import './app.less';

class Demo extends React.Component {
  config = {
      window: {
          navigationBarTextStyle: '#fff',
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
      // eslint-disable-next-line
    console.log('App launched');
  }
}

// eslint-disable-next-line
App(new Demo());

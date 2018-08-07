import React from "./ReactWX";
import "./pages/index/index";

class Demo extends React.Component {
  config = {
    "pages": [
      "pages/index/index"
    ],
    "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#0088a4",
      "navigationBarTitleText": "mpreact",
      "navigationBarTextStyle": "#fff"
    }
  }
  globalData = {
    ufo:"ufo"
  }
  onLaunch(){
    console.log('onLaunch===');
  }
}

App(new Demo())

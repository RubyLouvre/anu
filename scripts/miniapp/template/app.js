import React from "../../dist/ReactWX";
import "./pages/index/index";

class Demo extends React.Component {
  config = {
    "pages": [
      "pages/index/index"
    ],
    "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "WeChat",
      "navigationBarTextStyle": "black"
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

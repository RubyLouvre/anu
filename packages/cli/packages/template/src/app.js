import React from "./ReactWX";
import "./pages/index/index";
import "./pages/otherPage1/index";
import "./pages/otherPage2/index";
import "./pages/test/index";
import "./pages/demo/form/index/index";
import "./pages/demo/form/button/index";
import "./pages/demo/form/checkbox/index";
import "./pages/demo/form/input/index";
import "./pages/demo/form/slider/index";
import "./pages/demo/form/picker/index";
import "./pages/demo/form/radio/index";


import "./pages/demo/base_content/base/index";
import "./pages/demo/view/index/index";
import "./pages/demo/view/view/index";
import "./pages/demo/view/scroll_view/index";

import "./app.less";

class Demo extends React.Component {
  config = {
    "pages": [
      "pages/index/index",
      "pages/otherPage1/index",
      "pages/otherPage2/index",
      "pages/test/index",
      "pages/demo/form/index/index",      
      "pages/demo/form/button/index",
      "pages/demo/form/checkbox/index",
      "pages/demo/form/input/index",
      "pages/demo/form/slider/index",
      "pages/demo/form/picker/index",
      "pages/demo/form/radio/index",
      "pages/demo/base_content/base/index",
      "pages/demo/view/index/index",
      "pages/demo/view/view/index",
      "pages/demo/view/scroll_view/index"









      




    ],
    "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#0088a4",
      "navigationBarTitleText": "mpreact",
      "navigationBarTextStyle": "#fff",
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

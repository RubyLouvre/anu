import React from "../../ReactWX.js";
import { GlobalTheme } from "../../common/GlobalTheme/index"; //@common 别名在package.json中配置

function P(...args) {
  this.state = {
    anyVar: {
      color: 'red'
    }
  };
}

P = React.toClass(P, React.Component, {
  componentDidMount: function () {
    // eslint-disable-next-line
    console.log('page did mount!');
  },
  render: function () {
    var h = React.createElement;
    console.log(this.state.anyVar, '!!');
    return h("view", {
      class: "page"
    }, h(GlobalTheme.Provider, {
      value: this.state.anyVar
    }, h(React.useComponent, {
      is: "Layout",
      "data-instance-uid": 'i18_16_' + 0
    }, h(React.useComponent, {
      is: "AnotherComponent",
      "data-instance-uid": 'i19_20_' + 0
    }))));;
  },
  classUid: "c1017"
}, {});
Page(React.registerPage(P, "pages/index/index.tsx"));
export default P;
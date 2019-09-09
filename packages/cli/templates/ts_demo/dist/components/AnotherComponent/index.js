// eslint-disable-next-line
import React from "../../ReactWX.js";

function AnotherComponent() {
  var h = React.createElement;
  //它要表示为一个组件，因此必须 大写开头
  console.log('AnotherComponent init'); //debug

  return h("view", null, "Foo");;
}

Component(React.registerComponent(AnotherComponent, "AnotherComponent"));
export default AnotherComponent;
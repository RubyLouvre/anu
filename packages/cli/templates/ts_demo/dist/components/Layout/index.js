import React from "../../ReactWX.js";
import { GlobalTheme } from "../../common/GlobalTheme/index";

function Layout(props) {
  var h = React.createElement;
  const globalStyle = React.useContext(GlobalTheme);
  console.log('Layout init', globalStyle); //debug

  return h("view", {
    style: React.toStyle(globalStyle, this.props, 'style517')
  }, props.children);;
}

Component(React.registerComponent(Layout, "Layout"));
export default Layout;
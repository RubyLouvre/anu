import React from "../../../../ReactQuick.js";

function ScrollItemDiv(props) {
  this.state = {
    name: props.name,
    index: props.index
  };
}

ScrollItemDiv = React.toClass(ScrollItemDiv, React.Component, {
  render: function () {
    var h = React.createElement;
    return h("div", null, this.state.name, "--", this.state.index);
    ;
  },
  classUid: "c337"
}, {});
export { React };
export default ScrollItemDiv;
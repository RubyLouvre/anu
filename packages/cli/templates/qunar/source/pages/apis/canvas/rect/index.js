import React from '@react';
/* eslint-disable */

// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onShow() {
    this.drawCanvas2();
  }
  drawCanvas2() {
    const ctx = React.api.createCanvasContext('rect', this);
    ctx.setFillStyle('red');
    ctx.fillRect(0, 0, 150, 200);
    ctx.setFillStyle('blue');
    ctx.fillRect(150, 0, 150, 200);
    ctx.clearRect(10, 10, 150, 75);
    ctx.draw();
  }

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        <canvas class="content" id="rect"  style={{border: '1px solid #eeeeee', backgroundColor: '#123456'}}/>
      </div>
    );
  }
}
export default Data;

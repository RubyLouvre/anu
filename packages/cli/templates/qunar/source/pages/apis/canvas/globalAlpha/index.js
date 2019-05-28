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
    const ctx = React.api.createCanvasContext('globalAlpha', this);
    ctx.setFillStyle('red');
    ctx.fillRect(10, 10, 150, 100);
    ctx.setGlobalAlpha(0.2);
    ctx.setFillStyle('blue');
    ctx.fillRect(50, 50, 150, 100);
    ctx.setFillStyle('yellow');
    ctx.fillRect(100, 100, 150, 100);

    ctx.draw();
  }

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        <canvas class="globalAlpha" id="globalAlpha" style={{ backgroundColor: '#ffffff' }} />
      </div>
    );
  }
}
export default Data;

import React from '@react';
import './index.scss';
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
    const ctx = React.api.createCanvasContext('myCanvas2', this);
    ctx.setStrokeStyle('red');
    ctx.moveTo(5, 375);
    ctx.lineTo(295, 375);
    ctx.stroke();

    ctx.setFontSize(20);

    ctx.setTextBaseline('top');
    ctx.fillText('top', 5, 375);

    ctx.setTextBaseline('middle');
    ctx.fillText('middle', 50, 375);

    ctx.setTextBaseline('bottom');
    ctx.fillText('bottom', 120, 375);
    ctx.setTextBaseline('normal');
    ctx.fillText('normal', 200, 375);
    ctx.draw();
  }

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        <canvas class="content" id="myCanvas2" />
      </div>
    );
  }
}
export default Data;

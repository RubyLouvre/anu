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
    const ctx = React.api.createCanvasContext('arc', this);
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.setFillStyle('#EEEEEE');
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(40, 75);
    ctx.lineTo(160, 75);
    ctx.moveTo(100, 15);
    ctx.lineTo(100, 135);
    ctx.setStrokeStyle('#AAAAAA');
    ctx.stroke();

    ctx.setFontSize(12);
    ctx.setFillStyle('black');
    ctx.fillText('0', 165, 78);
    ctx.fillText('0.5*PI', 83, 145);
    ctx.fillText('1*PI', 15, 78);
    ctx.fillText('1.5*PI', 83, 10);

    // Draw points
    ctx.beginPath();
    ctx.arc(100, 75, 2, 0, 2 * Math.PI);
    ctx.setFillStyle('lightgreen');
    ctx.fill();

    ctx.beginPath();
    ctx.arc(100, 25, 2, 0, 2 * Math.PI);
    ctx.setFillStyle('blue');
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, 75, 2, 0, 2 * Math.PI);
    ctx.setFillStyle('red');
    ctx.fill();

    // Draw arc
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 1.5 * Math.PI);
    ctx.setStrokeStyle('#333333');
    ctx.stroke();

    ctx.draw();
  }

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        <canvas class="content" id="arc" style={{ backgroundColor: '#ffffff' }} />
      </div>
    );
  }
}
export default Data;

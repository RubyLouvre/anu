import React from '@react';
import './index.scss';
/* eslint-disable */

// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  drawCanvas1() {
    const ctx = React.api.createCanvasContext('myCanvas1', this);
    ctx.beginPath();
    ctx.setStrokeStyle('red');
    ctx.moveTo(150, 20);
    ctx.lineTo(150, 170);
    ctx.stroke();
    ctx.setFontSize(15);
    ctx.setTextAlign('left');
    ctx.fillText('textAlign=left', 150, 60);
    ctx.setTextAlign('center');
    ctx.fillText('textAlign=center', 150, 80);
    ctx.setTextAlign('right');
    ctx.fillText('textAlign=right', 150, 100);
    ctx.closePath();
  }

  onShow() {
    this.drawCanvas1();
   
  }

 

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        
        <canvas class="content" id="myCanvas1" />
      </div>
    );
  }
}
export default Data;

import React from '@react';
/* eslint-disable */

// 事件
class P extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onShow() {
    this.drawCanvas2();
  }
  drawCanvas2() {
    const ctx = React.api.createCanvasContext('fill', this);
    // begin path
    ctx.rect(10, 10, 100, 30);
    ctx.setFillStyle('yellow');
    ctx.fill();

    // begin another path
    ctx.beginPath();
    ctx.rect(10, 40, 100, 30);

    // only fill this rect, not in current path
    ctx.setFillStyle('blue');
    ctx.fillRect(10, 70, 100, 30);

    ctx.rect(10, 100, 100, 30);

    // it will fill current path
    ctx.setFillStyle('red');
    ctx.fill();
    ctx.draw();
  }

  componentDidMount() {
    console.log('fill Did Mount')
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }
  render() {
    return (
      <div class="anu-block">
        <canvas
          class="content"
          id="fill"
          style={{ border: '1px solid #eeeeee', backgroundColor: '#ffffff' }}
        />
      </div>
    );
  }
}
export default P;

import React from '@react';
import './index.scss';
// import '../../../../pages/demo/apis/canvas/setStrokeStyle'
/* eslint-disable */

// 事件
class P extends React.Component {
  constructor() {
    super();
    const ROOT_PATH = '/pages/apis/canvas';
    this.state = {
      list: 'fillStyle,arc,strokeStyle,textBaseline,rect,globalAlpha'.split(',').map(function(name) {
        return {
          url: `${ROOT_PATH}/${name}/index`,
          name: name
        };
      })
    };
  }

  componentDidMount() {
    // const ctx = React.api.createCanvasContext('myCanvas', this);
  }

  gotoSome(url) {
    console.log('url', url)
    if (url) {
      React.api.navigateTo({ url });
    }
  }
  render() {
    return (
      <div class="anu-block">
        {this.state.list.map(function(item) {
          return (
            <div className="anu-item" onClick={this.gotoSome.bind(this, item.url)}>
              <text>{item.name}</text>
            </div>
          );
        }, this)}
      </div>
    );
  }
}
export default P;

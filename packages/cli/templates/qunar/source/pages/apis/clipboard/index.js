import React from '@react';
import './index.scss';
/* eslint-disable */

// 事件
class P extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '1234455',
      copy: ''
    };
  }

  copy() {
    console.log('copy')
    React.api.setClipboardData({
      data: this.state.data
    });
  }
  paste() { 
    console.log('paste')
    React.api.getClipboardData({
      success: (res) => {
        console.log('data', res);
        this.setState({ copy: res.data });
      },
    });
  }
  
  render() {
    return (
      <div class="col">
        <div class="item">{this.state.data}</div>
        <div class="item" onTap={this.copy}>复制</div>
        <div  class="item" onTap={this.paste}>粘贴</div>
        <div class="item">{this.state.copy}</div>
      </div>
    );
  }
}
export default P;
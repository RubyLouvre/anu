import React from '@react';
import './index.scss';
/* eslint-disable */

// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '1234455',
      copy: ''
    };
  }

  redirectTo() {
    React.api.redirectTo({
      url: '/pages/platform/about/index?param1=hello&param2=world'
    });
  }

  navigateBack() {
    React.api.navigateBack();
  }

 

  render() {
    return (
      <div class="col">
        <div onClick={this.redirectTo} class="anu-item">
          <text>页面跳转(redirectTo)</text>
        </div>
        <div onClick={this.navigateBack} class="anu-item">
          <text>页面回退(navigateBack)</text>
        </div>
        
      </div>
    );
  }
}
export default Data;

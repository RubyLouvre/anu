import React from '@react';
import './index.scss';
/* eslint-disable */
function alert(msg) {
  React.api.showModal({
    title: '',
    content: msg,
    showCancel: false,
    confirmText: '确定'
  });
}

// 事件
class Data extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '1234455',
      copy: ''
    };
  }

  setStorage() {
    React.api.setStorage({
      key: 'v1',
      data: { key: 12 },
      success: function(data) {
        alert('handling success');
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  getStorage() {
    React.api.getStorage({
      key: 'key',
      success: function(res) {
        alert(`handling success, ${res.data}`);
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  removeStorage() {
    React.api.removeStorage({
      key: 'v1',
      success: function(data) {
        alert('handling success');
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  setStorageSync() {
    let data = React.api.setStorageSync('key', 'value');
    console.log('data', data);
  }

  getStorageSync() {
    let data = React.api.getStorageSync('v1');
    console.log(111111111,React.api.getStorageSync+"")
    alert(`handling success, ${data}`);
  }

  removeStorageSync() {
    let remove = React.api.removeStorageSync('key');
  }

  render() {
    return (
      <div class="col">
        <div onClick={this.setStorage} class="item">
          <text>setStorage</text>
        </div>
        <div onClick={this.getStorage} class="item">
          <text>getStorage</text>
        </div>
        <div onClick={this.removeStorage} class="item">
          <text>removeStorage</text>
        </div>
        <div onClick={this.setStorageSync} class="item">
          <text>setStorageSync</text>
        </div>
        <div onClick={this.getStorageSync} class="item">
          <text>getStorageSync</text>
        </div>
        <div onClick={this.removeStorageSync} class="item">
          <text>removeStorageSync</text>
        </div>
      </div>
    );
  }
}
export default Data;

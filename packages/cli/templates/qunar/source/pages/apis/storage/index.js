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
class P extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ''
    };
  }
  setValue(e){
     this.setState({value: e.target.value})
  }
  setStorage() {
    React.api.setStorage({
      key: 'value',
      data: this.state.value,
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
      key: 'value',
      success: function(res) {
        alert(`handling success, ${res.data}`);
      },
      fail: function(data, code) {//不存在永远不会进入fail，只有没有权限才出错
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  getStorageFail() {
    React.api.getStorage({
      key: 'aaa',
      success: function(res) {
        alert(`handling success, ${res.data}`);
      },
      fail: function(data, code) {//不存在永远不会进入fail, 只有没有权限才出错
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  removeStorage() {
    React.api.removeStorage({
      key: 'value',
      success: function(data) {
        alert('handling success');
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  setStorageSync() {
    let data = React.api.setStorageSync('value', this.state.value);
    console.log('data', data);
  }

  getStorageSync() {
    let data = React.api.getStorageSync('value');
    alert(`handling success, ${data}`);
  }

  removeStorageSync() {
    React.api.removeStorageSync('value');
  }

  render() {
    return (
      <div class="col">
        <div><text>输入要储存的内容, 放value中</text><input value={this.state.value} onChange={this.setValue.bind(this)} /></div>
        <div onClick={this.setStorage} class="item">
          <text>setStorage</text>
        </div>
        <div onClick={this.getStorage} class="item">
          <text>getStorage('value')</text>
        </div>
        <div onClick={this.getStorageFail} class="item">
          <text>getStorage( 'aaa' )</text>
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
export default P;

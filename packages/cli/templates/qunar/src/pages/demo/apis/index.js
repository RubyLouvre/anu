import React from '@react';
import './index.scss';
// 事件
/* eslint-disable */
class Express extends React.Component {
    constructor() {
        super();
        this.state = {
            text: 'page3'
        };
    }
  config = {
      navigationBarTextStyle: '#fff',
      navigationBarBackgroundColor: '#0088a4',
      navigationBarTitleText: 'API',
      'background-color': '#eeeeee',
      backgroundTextStyle: 'light'
  };

  componentDidMount() {}

  click() {
      
      console.log(111);
  }

  async showModal() {
      React.api.showModal({
          title: '我是一个title',
          content: '内容是啥',
          cancelText: '取消',
          confirmText: '确定',
          success: function (result) {
              console.log('result', result);
          }
      });
    
  }
  showContextMenu() {
      React.api.showActionSheet({
          itemList: ['item1', 'item2', 'item3', 'item4'],
          itemColor: '#ff33ff',
          success: function(data) {
              console.log('handling success', data);
          },
          cancel: function() {
              console.log('handling cancel');
          },
          fail: function(data, code) {
              console.log(`handling fail, code = ${code}`);
          }
      });
  }
  vibrator() {
      console.log('vibrator');
      React.api.vibrateLong();
  }
  share() {
     
      console.log('share');
      share.share({
          type: 'text/html',
          data: '<b>bold</b>',
          success: function(data) {
              console.log('handling success');
          },
          fail: function(data, code) {
              console.log(`handling fail, code = ${code}`);
          }
      });
  }
  upload() {
      console.log('upload');
      media.pickImage({
          success: function(data) {
              console.log(`handling success: ${data.uri}`);
              React.api.uploadFile({
                  url: 'http://yapi.beta.qunar.com/mock/291/aaaaa',
                  filePath: data.uri,
                  name: 'file1',
                  formData: {
                      user: 'test'
                  },
                  success: function(data) {
                      React.api.showModal({
                          title: 'success'
                      });
                  },
                  fail: function(data, code) {
                      console.log(`handling fail, code = ${code}`);
                      React.api.showModal({
                          title: 'fail',
                          content: `code = ${code}`
                      });
                  }
              });
          }
      });
  }
  request() {
      React.api.request({
          url: 'http://yapi.demo.qunar.com/mock/13807/unauth/account/register',
          method: 'post',
         
          success: function(res) {
              console.log(`the status code of the response: ${res.data}`);
          },
          fail: function(err) {
              console.log(`handling fail, code = ${err}`);
          }
      });
  }

  render() {
      return (
          <div class="page">
              <div class="content col">
                  <div onClick={this.showModal} class="item">
                      <text>showModal</text>
                  </div>
                  <div onClick={this.showContextMenu} class="item">
                      <text>显示上下文菜单</text>
                  </div>
                  <div onClick={this.show} class="item">
                      <text>通知消息</text>
                  </div>
                  <div onClick={this.vibrator} class="item">
                      <text>震动</text>
                  </div>
                  <div onClick={this.share} class="item">
                      <text>分享</text>
                  </div>
                  <div onClick={this.upload} class="item">
                      <text>文件上传</text>
                  </div>
                  <div onClick={this.download} class="item">
                      <text>文件下载</text>
                  </div>
                  <div onClick={this.request} class="item">
                      <text>数据请求</text>
                  </div>
                  <div onClick={this.scan} class="item">
                      <text>扫一扫</text>
                  </div>
              </div>
          </div>
      );
  }
}
export default Express;

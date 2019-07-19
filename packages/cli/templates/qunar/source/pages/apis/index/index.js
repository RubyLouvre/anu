import React from '@react';
import './index.scss';
/* eslint-disable */
function alert(msg) {
  React.api.showModal({
    title: '',
    content: msg,
    showCancel: false,
    confirmText: '确定'
  })
} 
// 事件
class P extends React.Component {
  constructor() {
    super();
    this.state = {
      text: 'page3',
      img: []
    };
  }
  config = {
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#0088a4',
    navigationBarTitleText: 'API',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light'
  };

  componentDidMount() {
  }

  click() {
    console.log(111);
  }

  showModal() {
    React.api.showModal({
      title: '我是一个title',
      content: '内容是啥',
      cancelText: '取消',
      confirmText: '确定',
      success: function(result) {
        console.log('result', result);
      }
    });
  }
  showContextMenu() {
    
    React.api.showActionSheet({
      itemList: ['item1', 'item2', 'item3', 'item4'],
      itemColor: '#ff33ff',
      success: function(data) {
        alert(`handling success, ${JSON.stringify(data)}`);
       
      },
      cancel: function() {
        alert('handling cancel');
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }
  vibrateLong() {
    console.log('vibrateLong');
    React.api.vibrateLong({
      success: () => {
        alert('震动起来了');
      }
    });
  }
  vibrateShort() {
    console.log('vibrateShort');
    React.api.vibrateShort({
      success: () => {
        alert('震动起来了');
      }
    });
  }
  

  upload() {
    console.log('upload');
    React.api.chooseImage({
      success: function(data) {
        console.log("handling success: ", data);
        React.api.uploadFile({
          url: 'http://yapi.demo.qunar.com/mock/291/aaaaa',
          filePath: data.tempFilePaths[0],
          name: 'file',
          fileType: 'image',
          formData: {
            user: 'test'
          },
          success: function(data) {
            console.log(data, '---')
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
          },
          getRawResult: function(task){
              task.onProgressUpdate(res => {
                console.log('上传进度', res.progress);
                console.log('已经上传的数据长度', res.totalBytesSent);
                console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
              });
          }
        });
      }
    });
  }
  request() {
    React.api.request({
      url: 'http://yapi.demo.qunar.com/mock/5774/unauth/account/register',
      method: 'post',
      success: function(res) {
        alert(`the status code of the response: ${JSON.stringify(res.data)}`);
      },
      fail: function(err) {
        alert(`handling fail, code = ${err}`);
      }
    });
  }

  download() {
    React.api.downloadFile({
      url: 'https://yapi.ymfe.org/devops/index.html#%E7%A6%81%E6%AD%A2%E6%B3%A8%E5%86%8C',
      success: function(data) {
       alert(`handling success${data}`);
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      },
      getRawResult: function(task){
        task.onProgressUpdate(res => {
          console.log('下载进度', res.progress);
          console.log('已经下载的数据长度', res.totalBytesWritten);
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
        });
      }
    });
  }

  scan() {
    React.api.scanCode({
      success: function(data) {
        alert(`handling success: ${data.result}`);
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }
  onShare(){
      var path = React.getCurrentPage().props.path
      return {
        title: '妹子图片',
        path: path,
        imageUrl: "/assets/logo.jpg",
        success: (res) => {
          React.api.showToast({ title: 'handling success'+ res});

        },
        fail: (res) => {
          React.api.showToast({ title: 'handling fail'+ res});
        }
      }
  }
  

  getSavedFileInfo() {
    React.api.getSavedFileInfo({
      filePath: 'internal://Users/qitmac000476/Documents/weixin/nanachi/_site/apis/file.html',
      success: function(data) {
        alert(`uri:${data.uri}, size: ${data.size}, createTime: ${data.createTime}`)
      },
      fail: function(data, code) {
        alert(`handling fail, code = ${code}`);
      }
    });
  }

  gotoSome(url) {
    console.log('url', url);
    if (url) {
      React.api.navigateTo({ url });
    }
  }

  getLocation() {
    React.api.getLocation({
      success: function (data) {
        alert(`handling success: longitude = ${data.longitude}, latitude = ${data.latitude}`)
      },
    })
  }

  getNetworkType() {
    React.api.getNetworkType({
      success: function (data) {
        alert(`handling success: ${data.networkType}`)
      }
    })
  }

  getSystemInfo() {
    React.api.getSystemInfo({
      success: function (data) {
        alert(`handling success: ${JSON.stringify(data)}`)
      }
    })
  }

  chooseImage() {
    React.api.chooseImage({
      count: 1,
      success: res => {
        this.setState({
          img: res.tempFilePaths
        })
      }
    })
   }

   setTitleBar() {
    React.api.setNavigationBarTitle({
      title: 'a new title',
      success: function() {
        alert('setTitleBar success');
      }
    })
  }
  makePhoneCall(){
    React.api.makePhoneCall({
       phoneNumber: '10086'
    })
 } 

  showToast() {
    React.api.showToast({
      title: 'showToast'+ React.api.hideToast
    })
  }

 

  createShortcut() {
    React.api.createShortcut();
  }

  render() {
    return (
      <div class="api-page">
        <div class="anu-block">
          <div onClick={this.showModal} class="anu-item">
            <text>showModal</text>
          </div>
          <div onClick={this.showToast} class="anu-item">
            <text>showToast</text>
          </div>
          <div onClick={this.showContextMenu} class="anu-item">
            <text>显示上下文菜单</text>
          </div>
          <div onClick={this.vibrateShort} class="anu-item">
            <text>短震</text>
          </div>
          <div onClick={this.vibrateLong} class="anu-item">
            <text>长震</text>
          </div>
          <div onClick={this.makePhoneCall} class="anu-item">
            <text>打电话</text>
          </div>
          <div onClick={this.upload} class="anu-item">
            <text>文件上传，里面有一个getRawResult方法，可以获uploadTask对象，从而添加进度回调</text>
          </div>
          <div onClick={this.download} class="anu-item">
            <text>文件下载，里面有一个getRawResult方法，可以获downloadTask对象，从而添加进度回调</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '/pages/apis/request/index')}
            class="anu-item"
          >
            <text>数据请求</text>
          </div>
          <div onClick={this.scan} class="anu-item">
            <text>扫一扫</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '/pages/apis/storage/index')}
            class="anu-item"
          >
            <text>存储</text>
          </div>
          
          <div onClick={this.getSavedFileInfo} class="anu-item">
            <text>获取本地文件</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '/pages/apis/clipboard/index')}
            class="anu-item"
          >
            <text>剪切板</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '/pages/apis/canvas/index')}
            class="anu-item"
          >
            <text>画板</text>
          </div>
          <div onClick={this.getLocation} class="anu-item">
            <text>获取地理位置</text>
          </div>
          <div onClick={this.getNetworkType} class="anu-item">
            <text>获取网络类型</text>
          </div>
          <div onClick={this.getSystemInfo} class="anu-item">
            <text>获取系统信息(getSystemInfo)</text>
          </div>
          <div onClick={this.chooseImage} class="anu-item">
            <text>选择图片</text>
          </div>
          {
            this.state.img.map(function(item) {
              return  <image src={item}/>
            })
          }
          <div onClick={this.setTitleBar} class="anu-item">
            <text>setTitleBar</text>
          </div>
          <div onClick={this.createShortcut} class="anu-item">
            <text>保存图标到桌面</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '/pages/apis/route/index')}
            class="anu-item"
          >
            <text>路由</text>
          </div>
          
        </div>
      </div>
    );
  }
}
export default P;

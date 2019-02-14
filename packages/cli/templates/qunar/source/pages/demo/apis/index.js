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
class Express extends React.Component {
  constructor() {
    super();
    this.state = {
      text: 'page3',
      img: []
    };
  }
  config = {
    navigationBarTextStyle: '#fff',
    navigationBarBackgroundColor: '#0088a4',
    navigationBarTitleText: 'API',
    'background-color': '#eeeeee',
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
  vibrator() {
    console.log('vibrator');
    React.api.vibrateLong({
      success: () => {
        alert('震动起来了');
      }
    });
  }
  
  share() {
    /**
     * 快应用分享api，快应用右上角分享方式：在页面中定义onShareAppMessage函数
     * eg:
     * onShareAppMessage() {
     *    return {
     *        title: '标题',
     *        path: 'http://www.example.com',
     *        success: function(data) {
     *            React.api.showToast({ title: 'handling success'});
     *            console.log('handling success')
     *        },
     *        fail: function(data, code) {
     *            React.api.showToast({ title: `code=${code}, ${data}` });
     *            console.log(`code=${code}, ${data}`)
     *        }
     *    }
     * }
     */ 
    
    React.api.share({
      title: '标题',
      imageUrl: '/assets/logo.png',
      path: 'http://www.example.com',
      success: function(data) {
          React.api.showToast({ title: 'handling success'});
          console.log('handling success')
      },
      fail: function(data, code) {
          React.api.showToast({ title: `code=${code}, ${data}` });
          console.log(`code=${code}, ${data}`)
      }
    });
  }

  upload() {
    console.log('upload');
    React.api.chooseImage({
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
      title: 111,
      success: function() {
        alert('setTitleBar success');
      }
    })
  }

  showToast() {
    React.api.showToast({
      title: 'showToast'
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
          <div onClick={this.vibrator} class="anu-item">
            <text>震动</text>
          </div>
          <div onClick={this.upload} class="anu-item">
            <text>文件上传</text>
          </div>
          <div onClick={this.download} class="anu-item">
            <text>文件下载</text>
          </div>
          <div onClick={this.request} class="anu-item">
            <text>数据请求</text>
          </div>
          <div onClick={this.scan} class="anu-item">
            <text>扫一扫</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '../../../pages/demo/apis/storage/index')}
            class="anu-item"
          >
            <text>存储</text>
          </div>
          
          <div onClick={this.getSavedFileInfo} class="anu-item">
            <text>获取本地文件</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '../../../pages/demo/apis/clipboard/index')}
            class="anu-item"
          >
            <text>剪切板</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '../../../pages/demo/apis/canvas/index')}
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
          <div onClick={this.share} class="anu-item">
            <text>分享链接</text>
          </div>
          <div onClick={this.createShortcut} class="anu-item">
            <text>保存图标到桌面</text>
          </div>
          <div
            onClick={this.gotoSome.bind(this, '../../../pages/demo/apis/route/index')}
            class="anu-item"
          >
            <text>路由</text>
          </div>
          
        </div>
      </div>
    );
  }
}
export default Express;

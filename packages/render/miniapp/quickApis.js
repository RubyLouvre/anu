import { noop } from 'react-core/util';

function createRouter(name) {
  return function(obj) {
    const router = require('@system.router');
    const params = {};
    let uri = obj.url.slice(obj.url.indexOf('/pages')+1)
     uri = uri
      .replace(/\?(.*)/, function(a, b) {
        b.split('=').forEach(function(k, v) {
          params[k] = v;
        });
        return '';
      })
      .replace(/\/index$/, '');
    router[name]({
      uri,
      params
    });
  };
}

export var api = {
  // 交互
  showModal(obj) {
    // showCancel 默认值是 true
    obj.showCancel = obj.showCancel === false ? false : true;
    var buttons = [
      {
        text: obj.confirmText,
        color: obj.confirmColor
      }
    ];
    if (obj.showCancel) {
      buttons.push({
        text: obj.cancelText,
        color: obj.cancelColor
      });
    }
    obj.buttons = obj.confirmText ? buttons : [];
    obj.message = obj.content;
    delete obj.content;
    let fn = obj['success'];
    obj['success'] = res => {
      res.confirm = !res.index;
      fn && fn(res);
    };

    /*
        title	String	否	标题
        message	String	否	内容
        buttons	Array	否	按钮的数组，按钮结构：{text:'text',color:'#333333'}，color可选：buttons的第1项为positive button；buttons的第2项（如果有）为negative button；buttons的第3项（如果有）为neutral button。最多支持3个button
        success	Function	否	成功回调
        cancel	Function	否	取消回调
        complete Function	否	执行结束后的回调
        */
    var prompt = require('@system.prompt');
    prompt.showDialog(obj);
  },
  showToast(obj) {
    var prompt = require('@system.prompt');
    obj.message = obj.title;
    obj.duration = obj.duration / 1000;
    prompt.showToast(obj);
  },
  hideToast: noop,
  showActionSheet(obj) {
    var prompt = require('@system.prompt');
    prompt.showContextMenu(obj);
  },

  // 导航
  navigateTo: createRouter('push'),
  redirectTo: createRouter('replace'),
  navigateBack: createRouter('back'),
  // 震动
  vibrateLong() {
    var vibrator = require('@system.vibrator');
    vibrator.vibrate();
  },
  vibrateShort() {
    var vibrator = require('@system.vibrator');
    vibrator.vibrate();
  },

  // 分享
  share(obj) {
    var share = require('@system.share');
    share.share(obj);
  },

  // 上传

  uploadFile(obj) {
    var request = require('@system.request');
    var data = [];
    Object.keys(obj.formData).map(key => {
      let value = obj.formData[key];
      let item = {
        value,
        name: key
      };
      data.push(item);
    });
    obj.data = data;
    delete obj.formData;

    let files = [
      {
        uri: obj.filePath,
        name: obj.name
      }
    ];

    obj.files = files;
    delete obj.filePath;
    delete obj.name;
    request.upload(obj);
  },

  // 下载
  downloadFile(obj) {
    var request = require('@system.request');
    request.download(obj);
  },
  // 网络请求
  request(obj) {
    const fetch = require('@system.fetch');
    fetch.fetch(obj);
  }
};

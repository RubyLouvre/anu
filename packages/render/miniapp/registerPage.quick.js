import { isFn, emptyObject } from 'react-core/util'
import { dispatchEvent } from './eventSystem.quick'
import { onLoad, onUnload, onReady } from './registerPage.all'
import { callGlobalHook, _getApp } from './utils'
import { getQueryFromUri } from './apiForQuick/router'

var globalHooks = {
  onShareAppMessage: 'onGlobalShare',
  onShow: 'onGlobalShow',
  onHide: 'onGlobalHide'
}


function getQuery (page) {
  if(page.query){//小米快应用新规范，this.$page.query 返回页面启动时的参数数据；
    return page.query;
  }
  var query = {};
  //如果在manifest.json的router.pages[view]设置filter, 就可以从page.uri中抽取参数
  //https://doc.quickapp.cn/framework/manifest.html
  if(page.uri){
     getQueryFromUri(page.uri, query )
  }
  //如果能拿到就立即返回
  for(var param in query){
     return query;
  }
  //否则返回navigateTo/redirectTo/navigateBack中储存起来的参数
  return Object((_getApp().globalData || {}).__quickQuery)[page.path] || {};
}

export function registerPage (PageClass, path) {
  PageClass.reactInstances = []
  let config = {
    private: {
      props: Object,
      context: Object,
      state: Object
    },
    protected: PageClass.protected || {},
    dispatchEvent,
    onInit() {
      let app = this.$app; 
      let instance = onLoad.call(this, PageClass, path, getQuery(this.$page));
      let pageConfig = PageClass.config || instance.config || emptyObject;
      app.$$pageConfig = Object.keys(pageConfig).length
          ? pageConfig
          : null;
    },
    onReady: onReady,
    onDestroy: onUnload
  }
  Array('onShow', 'onHide', 'onMenuPress').forEach(function (hook) {
    config[hook] = function (e) {
      let instance = this.reactInstance,
       fn = instance[hook],
       app = _getApp(),
       param = e
      if (hook === 'onShow') {
        param = instance.props.query = getQuery(this.$page);
        app.$$page = instance.wx;
        app.$$pagePath = instance.props.path;
      }
      if (hook === 'onMenuPress') {
        app.onShowMenu && app.onShowMenu(instance, this.$app);
      } else if (isFn(fn)) {
        fn.call(instance, param);
      }

      let globalHook = globalHooks[hook];
      if (globalHook) {
        callGlobalHook(globalHook, param);
      }
    }
  })
  return config
}

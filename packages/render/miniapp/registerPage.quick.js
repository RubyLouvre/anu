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


function getQuery (wx, huaweiHack) {
  var page = wx.$page;
  if(page.query){//小米快应用新规范，this.$page.query 返回页面启动时的参数数据；
    return page.query;
  }
  var query = {};
  //小米快应用直接从page.uri中抽取参数
  if(page.uri){
    getQueryFromUri(page.uri, query )
    for(let i in query){
       return query;
    }
 }  
 //华为快应用从protected中抽取
 if(Object.keys(huaweiHack).length){
    for(let i in huaweiHack){
       query[i] = wx[i];
    }
    return query;
 }
  //否则返回navigateTo/redirectTo/navigateBack中储存起来的参数
  var data = _getApp().globalData;
  return data && data.__quickQuery && data.__quickQuery[page.path] || query;
}

export function registerPage (PageClass, path) {
  PageClass.reactInstances = []
  let config = {
    private: {
      props: Object,
      context: Object,
      state: Object
    },
    //华为快应用拿不到上一个页面传过来的参数，在$page.uri拿不到，manifest.json加了filter也不行
    protected: PageClass.protected || {},
    dispatchEvent,
    onInit() {
      let app = this.$app; 
      let instance = onLoad.call(this, PageClass, path, getQuery(this, PageClass.protected));
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
        param = instance.props.query = getQuery(this, PageClass.protected);
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

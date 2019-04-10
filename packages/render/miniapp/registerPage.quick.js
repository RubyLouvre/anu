import { isFn, emptyObject } from 'react-core/util'
import { dispatchEvent } from './eventSystem.quick'
import { onLoad, onUnload, onReady } from './registerPage.all'
import { callGlobalHook, _getApp } from './utils'
// import { showMenu } from './apiForQuick/showMenu'
var globalHooks = {
  onShareAppMessage: 'onGlobalShare',
  onShow: 'onGlobalShow',
  onHide: 'onGlobalHide'
}
function getQuery (page) {
  var query = {}
  if(page.uri){
    page.uri.replace(/\?(.*)/, function (a, b) {
      b.split('&').forEach(function (param) {
        param = param.split('=')
        query[param[0]] = param[1]
      })
      return ''
    })
  }else{
    var queryObject = getApp().globalData.__huaweiQuery;
    if(queryObject){
      query = queryObject[page.path]
    }
  }
  return query
}

export function registerPage (PageClass, path) {
  PageClass.reactInstances = []
  let config = {
    private: {
      props: Object,
      context: Object,
      state: Object
    },
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
      let instance = this.reactInstance;
      let fn = instance[hook];
      let app = _getApp();
      if (hook === 'onShow') {
        app.$$page = instance.wx
        app.$$pagePath = instance.props.path
      }
      if (hook === 'onMenuPress') {
        app.onShowMenu && app.onShowMenu(instance, this.$app)
      } else if (isFn(fn)) {
        fn.call(instance, e)
      }

      let globalHook = globalHooks[hook]
      if (globalHook) {
        callGlobalHook(globalHook, e)
      }
    }
  })
  return config
}

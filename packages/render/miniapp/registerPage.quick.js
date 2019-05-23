import { isFn, emptyObject } from 'react-core/util'
import { dispatchEvent } from './eventSystem.quick'
import { onLoad, onUnload, onReady } from './registerPage.all'
import {  _getApp } from './utils'
import { getQueryFromUri } from './apiForQuick/router'

var appHooks = {
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide'
}


function getQuery(wx, huaweiHack) {
    var page = wx.$page;
    if (page.query) { //小米快应用新规范，this.$page.query 返回页面启动时的参数数据；
        return page.query;
    }
    var query = {};
    //小米快应用直接从page.uri中抽取参数
    if (page.uri) {
        getQueryFromUri(page.uri, query)
        for (let i in query) {
            return query;
        }
    }
    //华为快应用从protected中抽取
    if ( huaweiHack && Object.keys(huaweiHack).length) {
        for (let i in huaweiHack) {
            query[i] = wx[i];
        }
        return query;
    }
    //否则返回navigateTo/redirectTo/navigateBack中储存起来的参数
    var data = _getApp().globalData;
    return data && data.__quickQuery && data.__quickQuery[page.path] || query;
}

export function registerPage(PageClass, path) {
    PageClass.reactInstances = []
    var queryObject = PageClass.protected || emptyObject

    let config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        //华为快应用拿不到上一个页面传过来的参数，在$page.uri拿不到，manifest.json加了filter也不行
        protected: queryObject,
        dispatchEvent,
        onInit() {
            let app = this.$app;
            let instance = onLoad.call(this, PageClass, path, getQuery(this, queryObject));
            let pageConfig = PageClass.config || instance.config || emptyObject;
            app.$$pageConfig = Object.keys(pageConfig).length ?
                pageConfig :
                null;
        },
        onReady: onReady,
        onDestroy: onUnload
    }
    Array('onShow', 'onHide', 'onMenuPress', "onBackPress").forEach(function(pageHook) {
        config[pageHook] = function(e) {
            let instance = this.reactInstance,
                app = _getApp(),
                param = e
            if (pageHook === 'onShow') {
                param = instance.props.query = getQuery(this, queryObject);
                app.$$page = instance.wx;
                app.$$pagePath = instance.props.path;
            }else if (pageHook === 'onMenuPress') {
                app.onShowMenu && app.onShowMenu(instance, this.$app);
                return
            } 
            for(let i = 0; i < 2; i ++){
                let method = i ? appHooks[pageHook]: pageHook;
                let host = i ?  _getApp(): instance;
                if( method && host && isFn(host[method]) ){
                   let ret = host[method](param);
                   if(ret !== void 0){
                       return ret;
                   }
                }
            }
        }
    })
    return config
}
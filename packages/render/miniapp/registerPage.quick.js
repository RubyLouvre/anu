import { emptyObject,noop } from 'react-core/util'
import { dispatchEvent } from './eventSystem.quick'
import { onLoad, onUnload, onReady } from './registerPage.all'
import {  _getApp } from './utils'
import { getQueryFromUri } from './apiForQuick/router'
import { getCurrentPages } from './getCurrentPages.quick'
import { registerPageHook } from './registerPageHook';

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
    //否则返回navigateTo/redirectTo/navigateBack中储存起来的参数
    var data = _getApp().globalData;
    var routerQuery = data && data.__quickQuery && data.__quickQuery[page.path] || query;
     //华为快应用从protected、public中抽取
    if ( huaweiHack && Object.keys(huaweiHack).length) { 
        for (let i in huaweiHack) {
           routerQuery[i] = wx[i];
        }
    }
    return routerQuery;
}

export function registerPage(PageClass, path) {
    PageClass.reactInstances = []
    PageClass.container = {
        type: "page",
        props: {},
        children: [],
        root: true,
        appendChild: noop
    };
    var def = _getApp().$def
    var appInner = def.innerQuery;
    var appOuter = def.outerQuery;
    var pageInner = PageClass.innerQuery;
    var pageOuter = PageClass.outerQuery;

    if( !pageInner && PageClass.protected){
        console.warn( 'protected静态对象已经被废弃，请改用pageQuery静态对象' )
        pageInner = PageClass.protected
    }
    var innerQuery = pageInner ?  Object.assign({}, appInner, pageInner ): appInner;
    var outerQuery = pageOuter ?  Object.assign({}, appOuter, pageOuter ): appOuter;
    var duplicate = {}
    if(innerQuery){
        for(var i in innerQuery){
            duplicate[i] = true
        }
    }
    
    if(outerQuery){
        var keys = [];
        for(var i in outerQuery){
            if(duplicate[i] === true){
                keys.push(i);
            }
            duplicate[i] = true;
        }
        if(keys.length){
            throw '页面 '+ path+ ' 的两个参数对象存在重复的键名 '+ keys;
        }
    }

    let config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        //华为快应用拿不到页面参数，在$page.uri拿不到，manifest.json加了filter也不行
        protected: innerQuery,
        public: outerQuery,
        dispatchEvent,
        onInit() {
            let app = this.$app;
            let instance = onLoad.call(this, PageClass, path, getQuery(this, duplicate));
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
                query = e
            if (pageHook === 'onShow') {
                query = instance.props.query = getQuery(this, duplicate);
                app.$$page = instance.wx;
                var path = app.$$pagePath = instance.props.path;
                if(this.needReRender){
                    onLoad.call(this, PageClass, path, query);
                }
            } else if (pageHook === 'onMenuPress') {
                app.onShowMenu && app.onShowMenu(instance, this.$app);
                return
            } else if (pageHook == 'onBackPress') {
                if (instance[pageHook] && instance[pageHook]() === true) {
                    return
                }
                getCurrentPages().pop();
            }
            return registerPageHook(appHooks,  pageHook,  app, instance, query);
        }
    })
    return config
}


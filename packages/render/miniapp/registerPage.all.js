import { Renderer } from "react-core/createRenderer";
import { topNodes, noop, get, topFibers } from "react-core/util";
import {
    delayMounts,
    usingComponents,
    _getApp,
    updateMiniApp,
    callGlobalHook
} from "./utils";
import { render } from "react-fiber/scheduleWork";
import { createElement } from "react-core/createElement";
import { _getGlobalApp } from "./registerApp.all";

export function onLoad(PageClass, path, query, fire ) {
    var app = _getApp();
    // 快应用拿不到全局数据，从globalData中取
    let GlobalApp = _getGlobalApp(app);
   // app.$$pageIsReady = false;
    app.$$page = this;
    app.$$pagePath = path;
    var dom = PageClass.container;
    var pageInstance;
    if (typeof GlobalApp === "function") {
        this.needReRender = true
        render(
            createElement(
                GlobalApp,
                {},
                createElement(PageClass, {
                    path: path,
                    key: path,
                    query: query,
                    isPageComponent: true
                })
            ),
            dom, function(){
                var fiber = get(this).child;
                while (!fiber.stateNode.classUid) {
                    fiber = fiber.child;
                }
                pageInstance = fiber.stateNode;
            }
        );

    } else {
        pageInstance = render(
            //生成页面的React对象
            createElement(PageClass, {
                path: path,
                query: query,
                isPageComponent: true
            }),
            dom
        );
    }
    this.reactContainer = dom;
    this.reactInstance = pageInstance;
    pageInstance.wx = this; //保存小程序的页面对象
    if(fire){
        callGlobalHook("onGlobalLoad"); //调用全局onLoad方法
        updateMiniApp(pageInstance); //更新小程序视图
    }
    return pageInstance;
}

export function onReady() {
   // var app = _getApp();
   // app.$$pageIsReady = true;
    callGlobalHook("onGlobalReady");
}

export function onUnload() {
    for (let i in usingComponents) {
        let a = usingComponents[i];
        if (a.reactInstances) {
            a.reactInstances.length = 0;
        }
        delete usingComponents[i];
    }
    let root = this.reactContainer;
    let container = root && root._reactInternalFiber;
    if (container) {
        Renderer.updateComponent(
            container.child,
            {
                child: null
            },
            function() {
                root._reactInternalFiber = null;
                let j = topNodes.indexOf(root);
                if (j !== -1) {
                    topFibers.splice(j, 1);
                    topNodes.splice(j, 1);
                }
            },
            true
        );
    }
    callGlobalHook("onGlobalUnload");
    this.reactContainer = null;
}

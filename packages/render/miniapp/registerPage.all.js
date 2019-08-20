import { Renderer } from "react-core/createRenderer";
import { topNodes, noop, get, topFibers } from "react-core/util";
import {
    delayMounts,
    usingComponents,
    getWrappedComponent,
    _getApp,
    updateMiniApp,
    callGlobalHook
} from "./utils";
import { render } from "react-fiber/scheduleWork";
import { createElement } from "react-core/createElement";
import { _getGlobalApp } from "./registerApp.all.js";

export function onLoad(PageClass, path, query) {
    var app = _getApp();
    // 快应用拿不到全局数据，从globalData中取
    let GlobalApp = _getGlobalApp(app);
    app.$$pageIsReady = false;
    app.$$page = this;
    app.$$pagePath = path;
    let container = {
        type: "page",
        props: {},
        children: [],
        root: true,
        appendChild: noop
    };
    var pageInstance;
    if (typeof GlobalApp === "function") {
        render(
            createElement(
                GlobalApp,
                {},
                createElement(PageClass, {
                    path: path,
                    query: query,
                    isPageComponent: true,
                    ref: function(ins) {
                        if (ins)
                            pageInstance =
                                ins.wrappedInstance ||
                                getWrappedComponent(get(ins), ins);
                    }
                })
            ),
            container
        );
    } else {
        pageInstance = render(
            //生成页面的React对象
            createElement(PageClass, {
                path: path,
                query: query,
                isPageComponent: true
            }),
            container
        );
    }
    callGlobalHook("onGlobalLoad"); //调用全局onLoad方法
    this.reactContainer = container;
    this.reactInstance = pageInstance;
    pageInstance.wx = this; //保存小程序的页面对象
    updateMiniApp(pageInstance); //更新小程序视图
    return pageInstance;
}

export function onReady() {
    var app = _getApp();
    app.$$pageIsReady = true;
    let el = void 0;
    while ((el = delayMounts.pop())) {
        el.fn.call(el.instance);
        el.instance.componentDidMount = el.fn;
    }
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
    //this.reactInstance = null;
}

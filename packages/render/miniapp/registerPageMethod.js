import { Renderer } from 'react-core/createRenderer';
import { isFn, topNodes, noop, topFibers } from 'react-core/util';
import { delayMounts, usingComponents, pageState, updateMiniApp, callGlobalHook } from './utils';
import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';


export function onLoad(PageClass, path, query) {
    pageState.isReady = false;
    let container = {
        type: 'page',
        props: {},
        children: [],
        root: true,
        appendChild: noop
    };

    var pageInstance = render(//生成页面的React对象
        createElement(PageClass, {
            path: path,
            query: query,
            isPageComponent: true
        }),
        container
    );
    callGlobalHook('onGlobalLoad');//调用全局onLoad方法
    this.reactInstance = pageInstance;
    this.reactContainer = container;
    pageInstance.wx = this;//保存小程序的页面对象
    updateMiniApp(pageInstance);//更新小程序视图
    return pageInstance;
}

export function onReady() {
    pageState.isReady = true;
    let el = void 0;
    while ((el = delayMounts.pop())) {
        el.fn.call(el.instance);
        el.instance.componentDidMount = el.fn;
    }
    callGlobalHook('onGlobalReady');
}


export function onUnload() {
    for (let i in usingComponents) {
        let a = usingComponents[i];
        if (a.reactInstances.length) {
            a.reactInstances.length = 0;
            a.wxInstances.length = 0;
        }
        delete usingComponents[i];
    }
    let instance = this.reactInstance;
    if (instance){
        console.log('onUnload...',instance.props.path);//eslint-disable-line
        let hook = instance.componentWillUnmount;
        if (isFn(hook)) {
            hook.call(instance);
        }
    }
    let root = this.reactContainer;
    let container = root && root._reactInternalFiber;
    if (container) {
        Renderer.updateComponent(
            container.hostRoot,
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
    callGlobalHook('onGlobalUnload');
}


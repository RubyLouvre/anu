import { Renderer } from 'react-core/createRenderer';
import { isFn, topNodes, noop, topFibers } from 'react-core/util';
import { delayMounts, usingComponents, currentPage, updateMiniApp } from './utils';
import { render } from 'react-fiber/scheduleWork';
import { createElement } from 'react-core/createElement';


export function onLoad(PageClass, path, query) {
    //临时移除
    currentPage.isReady = false;
    let container = {
        type: 'page',
        props: {},
        children: [],
        root: true,
        appendChild: noop
    };
    var pageInstance = render(
        createElement(PageClass, {
            path: path,
            query: query,
            isPageComponent: true
        }),
        container
    );
    this.reactInstance = pageInstance;
    this.reactContainer = container;
    pageInstance.wx = this;
    updateMiniApp(pageInstance);
    return pageInstance;
}

export function onReady() {
    currentPage.isReady = true;
    let el = void 0;
    while ((el = delayMounts.pop())) {
        el.fn.call(el.instance);
        el.instance.componentDidMount = el.fn;
    }
}


export function onUnload() {
    for (let i in usingComponents) {
        let a = usingComponents[i];
        if (a.reactInstances.length) {
            // eslint-disable-next-line
            console.log(i, "还有", a.reactInstances.length, "实例没有使用过");
            a.reactInstances.length = 0;
            a.wxInstances.length = 0;
        }
        delete usingComponents[i];
    }
    let root = this.reactContainer;
    let container = root._reactInternalFiber;
    let instance = this.reactInstance;
    let hook = instance.componentWillUnmount;
    if (isFn(hook)) {
        hook.call(instance);
    }
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
}


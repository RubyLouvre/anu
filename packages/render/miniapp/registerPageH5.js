import { isFn } from 'react-core/util';
import { dispatchEvent } from './eventSystem';
import { DOMRenderer } from "../dom/DOMRenderer";
import { createElement } from 'react-core/createElement';

let lastInstance, pageStacks = [];
export function registerPage(PageClass, path, testObject) {
    PageClass.reactInstances = [];
    let config = {
        data: {},
        dispatchEvent,
        onLoad(query) {

            var body = document.body;
            var tabs = body.querySelectorAll(".anu-page-wrapper");
            if (tabs.length < 5) {
                var container = document.createElement('div');
                container.className = 'anu-page-wrapper';
                body.appendChild(container);
                var pageInstance = DOMRenderer.render(
                    createElement(PageClass, {
                        path: path,
                        query: query,
                        isPageComponent: true
                    }),
                    container
                );
                if (lastInstance) {
                    lastInstance.onHide && lastInstance.onHide();

                }
                pageInstance.onShow && pageInstance.onShow();
                lastInstance = pageInstance;
                pageInstance.__div = container;
                pageStacks.unshift(pageInstance);
            } else {
                var oldInstance = pageStacks.pop();
                var oldDiv = oldInstance.__div;
                DOMRenderer.unmountComponentAtNode(oldDiv);
                body.removeChild(oldDiv);
            }
        }
    };
    Array(
        'onPageScroll',
        'onShareAppMessage',
        'onReachBottom',
        'onPullDownRefresh'
    ).forEach(function (hook) {
        config[hook] = function () {
            let instance = this.reactInstance;
            let fn = instance[hook];
            if (isFn(fn)) {
                return fn.apply(instance, arguments);
            }
            if (hook === 'onShareAppMessage' && typeof getApp == 'function') {
                fn = Object(getApp()).onShareAppMessage;
                if (isFn(fn)) {
                    return fn();
                }
            }
        };
    });

    return config;
}

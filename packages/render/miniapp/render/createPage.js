import { eventSystem } from "./eventSystem";
import { render } from "react-fiber/scheduleWork";
import { createElement } from "react-core/createElement";
import { isFn } from "react-core/util";

export function createPage(PageClass, path) {
    //添加一个全局代理的事件句柄
    PageClass.prototype.dispatchEvent = eventSystem.dispatchEvent;
    //劫持页面组件的生命周期，与setState进行联动

    hijack(PageClass, "componentWillMount");
    hijack(PageClass, "componentWillUpdate");
    //获取页面的组件实例
    var instance = render(
        createElement(PageClass, {
            path: path,
            isPageComponent: true
        }),
        {
            type: "page",
            props: {},
            children: [],
            root: true,
            appendChild: function() {}
        }
    );
    if (!instance.instanceCode) {
        instance.instanceCode = Math.random();
    }
    if (!PageClass.instances) {
        PageClass.instances = [];
    }
    PageClass.instances.push(instance);
    //用于事件委托中
    instance.props.instanceCode = instance.instanceCode;
    //劫持setState
    var setState = instance.setState;
    instance.setState = function(a, b) {
        var pageInst = this.$pageComponent || this
        if (pageInst.$pageLock) {
            pageInst.$pageLock = false;
            instance.allTemplateData = []; //清空子组件
        }
        var inst = this;
        setState.call(this, a, function() {
            b && b.call(inst);
            var data = {
                state: pageInst.state,
                props: pageInst.props
            };
            applyChildComponentData(data, pageInst.allTemplateData || []);
            pageInst.$wxPage.setData(data);
        });
    };
    var unmountHook = "componentWillUnmount";
    var config = {
        data: {
            state: instance.state,
            props: instance.props
        },
        dispatchEvent: eventSystem.dispatchEvent,
        onLoad: function() {
            instance.$wxPage = this;
        },
        onUnload: function() {
            var index = PageClass.instances.indexOf(instance);
            if (index !== -1) {
                PageClass.instances.splice(index, 1);
            }
            if (isFn(instance[unmountHook])) {
                instance[unmountHook]();
            }
        }
    };
    //添加子组件的数据
    applyChildComponentData(config.data, instance.allTemplateData || []);
    return config;
}

function applyChildComponentData(data, list) {
    list.forEach(function(el) {
        if (data[el.templatedata]) {
            data[el.templatedata].push(el);
        } else {
            data[el.templatedata] = [el];
        }
    });
}

function hijack(component, method) {
    var fn = component.prototype[method] || function() {};
    component.prototype[method] = function() {
        this.$pageLock = true;
        fn.call(this);
    };
}

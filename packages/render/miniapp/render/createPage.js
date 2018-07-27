import { eventSystem } from "./eventSystem";
import { render } from "react-fiber/scheduleWork";

export function createPage(PageClass, path) {
  //添加一个全局代理的事件句柄
  PageClass.prototype.dispatchEvent = eventSystem.dispatchEvent;
  //旋转所有类实例
  
  var instance = render(React.createElement(PageClass), {
    type: "page",
    props: {
      path: path
    },
    children: [],
    root: true,
    appendChild: function() {}
  });
  if (!instance.instanceCode) {
    instance.instanceCode = Math.random();
  }

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
     
      instance.componentWillUnmount && instance.componentWillUnmount();
    }
  };
  var list = instance.allTemplateData || [];
  list.forEach(function(el) {
    if (config.data[el.templatedata]) {
      config.data[el.templatedata].push(el);
    } else {
      config.data[el.templatedata] = [el];
    }
  });
  return config;
}


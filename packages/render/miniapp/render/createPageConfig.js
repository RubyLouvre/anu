export function createPageConfig(PageClass) {
    var instance = ReactDOM.render(React.createElement(PageClass), {
      type: "div",
      root: true
    });
    var config = {
      data: {
        state: instance.state,
        props: instance.props
      },
      onLoad: function() {
        instance.$wxPage = this;
      },
      onUnload: function() {
        instance.componentWillUnmount && instance.componentWillUnmount();
      }
    };
    instance.allTemplateData.forEach(function(el) {
      if (config.data[el.templatedata]) {
        config.data[el.templatedata].push(el);
      }else{
        config.data[el.templatedata] = [el];
      }
    });
    return config;
  }
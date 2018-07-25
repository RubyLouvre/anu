import { noop, isFn } from "react-core/util";
function getData(instance) {
  return instance.allTemplateData || (instance.allTemplateData = []);
}
export function template(props) {
  //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
  var clazz = props.is;
  if (!clazz.hackByMiniApp) {
    clazz.hackByMiniApp = true;
    clazz.instances = clazz.instances || [];
    //如果是有狀态组件
    var a = clazz.prototype;
    if (a && a.isReactComponent) {
      Array("componentWillMount", "componentWillUpdate").forEach(function(
        method
      ) {
        var oldHook = a[method] || noop;
        a[method] = function() {
          var fiber = this._reactInternalFiber;
          var inputProps = fiber._owner.props;
          if (!this.instanceCode) {
            this.instanceCode = Math.random();
          }

          this.props.instanceCode = this.instanceCode;
          var instances = this.constructor.instances;
          if (instances.indexOf(this) === -1) {
            instances.push(this);
          }

          var p = fiber.return;
          do {
            if (p && isFn(p.type) && p.type !== template) {
              break;
            }
          } while ((p = p.return));
          var parentInstance = p && p.stateNode;
          if (parentInstance) {
            var arr = getData(parentInstance);
            arr.push({
              props: this.props,
              state: this.state,
              templatedata: inputProps.templatedata
            });
            oldHook.call(this, arguments);
          }
        };
      });
      //重写componentWillUnmount
      var oldUnmount = a.componentWillUnmount || noop
      a.componentWillUnmount = function() {
        var instances = this.constructor.instances;
        var index = instances.indexOf(this);
        if (index !== -1) {
          instances.splice(index, 1);
        }
        oldUnmount.call(this);
      };
    } else {
    }
  }
  //...再上面一样
  return React.createElement(clazz, props);
}

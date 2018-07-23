import { noop, isFn } from "react-core/util";
function getData(instance) {
  return instance.allTemplateData || (instance.allTemplateData = []);
}
export function template(props) {
  //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
  var clazz = props.is;
  if (!clazz.hackByMiniApp) {
    clazz.hackByMiniApp = true;
    //如果是有狀态组件
    var a = clazz.prototype;
    if (a && a.isReactComponent) {
      Array("componentWillMount", "componentWillUpdate").forEach(function(
        method
      ) {
        var old = a[method] || noop;
        a[method] = function() {
          var fiber = this._reactInternalFiber;
          var inputProps = fiber._owner.props;

          var p = fiber.return;
          do {
            if (p && isFn(p.type) && p.type !== template) {
              break;
            }
          } while ((p = p.return));
          var parentInstance = p && p.stateNode;
          if (parentInstance) {
            var arr = getData(parentInstance);
            //console.log(props.templatedata, "+++++++")
            arr.push({
              props: this.props,
              state: this.state,
              templatedata: inputProps.templatedata
            });
            old.call(this);
          }
        };
      });
    } else {
    }
  }
  //...再上面一样
  return React.createElement(clazz, props);
}

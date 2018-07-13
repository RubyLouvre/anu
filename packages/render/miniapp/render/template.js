function template(props) {
    //这是一个无状态组件，负责劫持用户传导下来的类，修改它的原型
    var clazz = props.is;
    if (!clazz.hackByMiniApp) {
        clazz.hackByMiniApp = true
        //如果是有狀态组件
        var a = classzz.prototype;
        if (a && a.isReactComponent) {
            Array("componentWillMount", "componentWillUpdate").forEach(function(method) {
                var old = a[method] || noop;
                a[method] = function() {
                    var fiber = this._reactInternalFiber;
                    var parentComponent = ref._owner
                    var arr = parentComponent.allTemplateData || (parentComponent.allTemplateData = []);
                    arr.push({
                        props: this.props,
                        state: this.state,
                        templatedata: props.templatedata
                    })
                    old.call(this)
                }
            })
        } else {

        }
    }
    //...再上面一样
    return React.createElement(clazz, props)
}
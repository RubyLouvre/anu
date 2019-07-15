

import { miniCreateClass, isFn, get } from "react-core/util";
import { Component } from "react-core/Component";
import { createElement } from "react-core/createElement";
import { Suspense } from "./Suspense";

var LazyComponent = miniCreateClass(function LazyComponent(props, context) {
    this.props = props;
    this.context = context;
    var promise = props.lazyFn();
    if(!promise || !isFn(promise.then)){
        throw "lazy必须返回一个thenable对象"
    }
    var that = this
    this.state = {
        render: null,
        resolve: false
    }
    promise.then(function(value){
        that.setState({
            render: value.default,
            resolve:  true
        })
    })
   
}, Component, {
    getSuspense(){
        var fiber = get(this)
        while(fiber.return ){
          if(fiber.return.type === Suspense){
              return fiber.return.props.fallback
           }
           fiber = fiber.return
        }
        throw "lazy组件必须包一个Suspense组件"
    },
    render(){
        return  this.state.resolve ? this.state.render() : this.getSuspense()
    }
});
function lazy(fn) {
    return function(){
        return createElement(LazyComponent, {
            lazyFn: fn
        })
    }
}
export {
    lazy
}
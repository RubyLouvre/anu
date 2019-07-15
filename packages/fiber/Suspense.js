import { miniCreateClass } from "react-core/util";
import { Component } from "react-core/Component";

function Suspense(props){
    return props.children
}
/*
var Suspense = miniCreateClass(function Suspense(props, context) {
    this.props = props;
    this.context = context;
}, Component, {
    render(){
       return this.props.children
    }
});
*/
export {
    Suspense
}


var onEvents = {
    onTap: "bindtap",
    onTouchStart: "bindtouchstart",
    onTouchMove: "bindtouchmove",
    onTouchCancel: "bindtouchcancel",
    onTouchEnd: "bindtouchend",
    onLongPress: "bindtongpress",
    onLongTap: "bindlongtap",
    onTransitionEnd: "bindtransitionend",
    onAnimationStart: "bindanimationstart",
    onAnimationIteration: "bindanimationiteration",
    onAnimationEnd: "bindanimationend",
    onTouchForceChange: "bindtouchforcechange",
    onClick: "bindtap",
}

module.exports = function mapPropName(path) {
    var orig = path.node.name.name;
    var has = onEvents[orig] 
    if(has){
        path.node.name.name = has
    }else{
       if(/bind/.test(orig)){
           throw "为了同时兼容React与微信小程序，定义事件时请尽量什么onXXX开头，注意大小写，目前只支持"+
           Object.keys(onEvents).join("、")
       }
       if(orig === "className"){
          path.node.name.name = "class"
       }
    }
};
  
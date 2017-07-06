(function(global, factory) {
  //https://github.com/jquery/jquery/blob/master/src/wrapper.js
  if (typeof define === 'function' && define.amd) {
    define(['react'], function(React) {
      global.EventEmitter = factory(global, React);
    });
} else if (typeof exports !== 'undefined') {
    var React = require('react');
    factory(global, React);
} else {
    global.EventEmitter = factory(global, global.React || global.ReactDOM);
  }
}(typeof window !== "undefined" ? window : this, function(window, React) {
  var eventSystem = React.eventSystem;
  if(!eventSystem){
     throw new Error('请确保你加载的是anujs')
  }
  var EventEmitter = {
      ReactEventListener = {
         dispatchEvent: function(name, event){
             eventSystem.dispatchEvent(event);
         }
      } 
  }
  return EventEmitter;

}));
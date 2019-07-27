import React from '@react';
var { subscribers } = React.getApp().globalData ; 

function Event(eventName, callback) {
    this.eventName = eventName;
    this.callback = callback;
}

Event.prototype.removeListener = function() {
    var index = subscribers.indexOf(this);
    if (index != -1) {
        subscribers.splice(index, 1);
    }
};

var EventEmitter = {
    addListener: function(eventName, callback) {
        var event = new Event(eventName, callback);
        subscribers.push(event);
        return event;
    },
    removeListener: function(event) {       //event 类型： string || Event || Array
        var rm = function(e) {
            var index = subscribers.indexOf(e);
            if (index != -1) {
                subscribers.splice(index, 1);
            }
        };

        if (typeof event == 'string') {
            subscribers.forEach(function(e,idx) {
                if (e.eventName == event) {
                    subscribers.splice(idx, 1);
                }
            });
        } else if (event instanceof Event) {
            rm(event);
        } else if (event instanceof Array) {
            event.forEach(function(e) {
                EventEmitter.removeListener(e);
            });
        }
    },
    dispatch: function(eventName, param) {
        subscribers.forEach(function(event) {
            if (event.eventName === eventName) {
                event.callback && event.callback(param);
            }
        });
    },
    lookFunc: function(eventName) {
        let funcArr = [];
        subscribers.forEach(function(event) {
            if (event.eventName === eventName) {
                // event.callback && event.callback(param);
                funcArr.push(event.callback.toString());
            }
        });
        return funcArr;
    }
};

export default EventEmitter;

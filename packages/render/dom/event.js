import { document, modern, contains } from './browser';
import { isFn, noop, toLowerCase } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { enqueueDuplex } from './duplex';
export let rform = /textarea|input|select|option/i;
let globalEvents = {};
export let eventPropHooks = {}; //用于在事件回调里对事件对象进行
export let eventHooks = {}; //用于在元素上绑定特定的事件
//根据onXXX得到其全小写的事件名, onClick --> click, onClickCapture --> click,
// onMouseMove --> mousemove
let eventLowerCache = {
    onClick: 'click',
    onChange: 'change',
    onWheel: 'wheel'
};

export function eventAction(dom, name, val, lastProps, fiber) {
    let events = dom.__events || (dom.__events = {});
    events.vnode = fiber;
    let refName = toLowerCase(name.slice(2));
    if (val === false) {
        delete events[refName];
    } else {
        if (!lastProps[name]) {
            //添加全局监听事件
            let eventName = getBrowserName(name);
            let hook = eventHooks[eventName];
            if (hook) {
                hook(dom, eventName);
            }
            addGlobalEvent(eventName);
        }
        //onClick --> click, onClickCapture --> clickcapture
        events[refName] = val;
    }
}

let isTouch = 'ontouchstart' in document;

export function dispatchEvent(e, type, endpoint) {
    //__type__ 在injectTapEventPlugin里用到
    e = new SyntheticEvent(e);
    if (type) {
        e.type = type;
    }
    let bubble = e.type,
        terminal = endpoint || document,
        hook = eventPropHooks[e.type];
    if (hook && false === hook(e)) {
        return;
    }

    Renderer.batchedUpdates(function() {
        let paths = collectPaths(e.target, terminal, {});
        let captured = bubble + 'capture';
        triggerEventFlow(paths, captured, e);

        if (!e._stopPropagation) {
            triggerEventFlow(paths.reverse(), bubble, e);
        }
    }, e);
}

let nodeID = 1;
function collectPaths(begin, end, unique) {
    let paths = [];
    let node = begin;
    //先判定路径上有绑定事件没有
    while (node && node.nodeType == 1) {
        let checkChange = node;
        if (node.__events) {
            let vnode = node.__events.vnode;
            inner: while (vnode.return) {
                //ReactDOM.render有Unbatch, container,
                //ReactDOM.createPortal有AnuPortal
                if (vnode.tag === 5) {
                    node = vnode.stateNode;
                    if (node === end) {
                        return paths;
                    }
                    if (!node) {
                        break inner;
                    }
                    var uid = node.uniqueID || (node.uniqueID = ++nodeID);
                    if (node.__events && !unique[uid]) {
                        unique[uid] = 1;
                        paths.push({ node, events: node.__events });
                    }
                }
                vnode = vnode.return;
            }
        }
        if (node === checkChange) {
            node = node.parentNode;
        }
    }
    return paths;
}

function triggerEventFlow(paths, prop, e) {
    for (let i = paths.length; i--; ) {
        let path = paths[i];
        let fn = path.events[prop];
        if (isFn(fn)) {
            e.currentTarget = path.node;
            fn.call(void 666, e);
            if (e._stopPropagation) {
                break;
            }
        }
    }
}

export function addGlobalEvent(name, capture) {
    if (!globalEvents[name]) {
        globalEvents[name] = true;
        addEvent(document, name, dispatchEvent, capture);
    }
}

export function addEvent(el, type, fn, bool) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, bool || false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}

let rcapture = /Capture$/;
export function getBrowserName(onStr) {
    let lower = eventLowerCache[onStr];
    if (lower) {
        return lower;
    }
    let camel = onStr.slice(2).replace(rcapture, '');
    lower = camel.toLowerCase();
    eventLowerCache[onStr] = lower;
    return lower;
}

/**
DOM通过event对象的relatedTarget属性提供了相关元素的信息。这个属性只对于mouseover和mouseout事件才包含值；
对于其他事件，这个属性的值是null。IE不支持realtedTarget属性，但提供了保存着同样信息的不同属性。
在mouseover事件触发时，IE的fromElement属性中保存了相关元素；
在mouseout事件出发时，IE的toElement属性中保存着相关元素。
但fromElement与toElement可能同时都有值
 */
function getRelatedTarget(e) {
    if (!e.timeStamp) {
        e.relatedTarget = e.type === 'mouseover' ? e.fromElement : e.toElement;
    }
    return e.relatedTarget;
}
function getTarget(e) {
    return e.target || e.srcElement;
}
String('load,error').replace(/\w+/g, function(name) {
    eventHooks[name] = function(dom, type) {
        let mark = '__' + type;

        if (!dom[mark]) {
            dom[mark] = true;
            addEvent(dom, type, dispatchEvent);
        }
    };
});

String('mouseenter,mouseleave').replace(/\w+/g, function(name) {
    eventHooks[name] = function(dom, type) {
        let mark = '__' + type;
        if (!dom[mark]) {
            dom[mark] = true;
            let mask = type === 'mouseenter' ? 'mouseover' : 'mouseout';
            addEvent(dom, mask, function(e) {
                let t = getRelatedTarget(e);
                if (!t || (t !== dom && !contains(dom, t))) {
                    let common = getLowestCommonAncestor(dom, t);
                    //由于不冒泡，因此paths长度为1
                    dispatchEvent(e, type, common);
                }
            });
        }
    };
});

let specialHandles = {};
export function createHandle(name, fn) {
    return (specialHandles[name] = function(e) {
        if (fn && fn(e) === false) {
            return;
        }
        dispatchEvent(e, name);
    });
}
function onCompositionStart(e) {
    e.target.__onComposition = true;
}

function onCompositionEnd(e) {
    e.target.__onComposition = false;
    //dispatchEvent(e, "change");
}
const input2change = /text|password|search|url|email/i;
//react中，text,textarea,password元素的change事件实质上是input事件
//https://segmentfault.com/a/1190000008023476
if (!document['__input']) {
    globalEvents.input = document['__input'] = true;
    addEvent(document, 'compositionstart', onCompositionStart);
    addEvent(document, 'compositionend', onCompositionEnd);
    addEvent(document, 'input', function(e) {
        var dom = getTarget(e);
        if (input2change.test(dom.type)) {
            if (!dom.__onComposition) {
                dispatchEvent(e, 'change');
            }
        }
        dispatchEvent(e);
    });
}

function getLowestCommonAncestor(instA, instB) {
    let depthA = 0;
    for (let tempA = instA; tempA; tempA = tempA.parentNode) {
        depthA++;
    }
    let depthB = 0;
    for (let tempB = instB; tempB; tempB = tempB.parentNode) {
        depthB++;
    }

    // If A is deeper, crawl up.
    while (depthA - depthB > 0) {
        instA = instA.parentNode;
        depthA--;
    }

    // If B is deeper, crawl up.
    while (depthB - depthA > 0) {
        instB = instB.parentNode;
        depthB--;
    }

    // Walk in lockstep until we find a match.
    let depth = depthA;
    while (depth--) {
        if (instA === instB) {
            return instA;
        }
        instA = instA.parentNode;
        instB = instB.parentNode;
    }
    return null;
}

eventPropHooks.change = function(e) {
    enqueueDuplex(e.target);
};

createHandle('doubleclick');
createHandle('scroll');
createHandle('wheel');
globalEvents.wheel = true;
globalEvents.scroll = true;
globalEvents.doubleclick = true;

if (isTouch) {
    eventHooks.click = eventHooks.clickcapture = function(dom) {
        dom.onclick = dom.onclick || noop;
    };
}

eventPropHooks.click = function(e) {
    return !e.target.disabled;
};

const fixWheelType =
    document.onwheel !== void 666
        ? 'wheel'
        : 'onmousewheel' in document
            ? 'mousewheel'
            : 'DOMMouseScroll';
eventHooks.wheel = function(dom) {
    addEvent(dom, fixWheelType, specialHandles.wheel);
};

eventPropHooks.wheel = function(event) {
    event.deltaX =
        'deltaX' in event
            ? event.deltaX
            : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
            'wheelDeltaX' in event
                ? -event.wheelDeltaX
                : 0;
    event.deltaY =
        'deltaY' in event
            ? event.deltaY
            : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
            'wheelDeltaY' in event
                ? -event.wheelDeltaY
                : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
                'wheelDelta' in event
                    ? -event.wheelDelta
                    : 0;
};

export let focusMap = {
    focus: 'focus',
    blur: 'blur'
};
let innerFocus;
function blurFocus(e) {
    let dom = getTarget(e);
    let type = focusMap[e.type];
    if (Renderer.inserting) {
        if (type === 'blur') {
            innerFocus = true;
            Renderer.inserting.focus();
            return;
        }
        //return放这里会导致浮层无法关闭
    }
    if (innerFocus) {
        innerFocus = false;
        return;
    }
    do {
        if (dom.nodeType === 1) {
            if (dom.__events && dom.__events[type]) {
                dispatchEvent(e, type);
                break;
            }
        } else {
            break;
        }
    } while ((dom = dom.parentNode));
}

'blur,focus'.replace(/\w+/g, function(type) {
    globalEvents[type] = true;
    if (modern) {
        let mark = '__' + type;
        if (!document[mark]) {
            document[mark] = true;
            addEvent(document, type, blurFocus, true);
        }
    } else {
        eventHooks[type] = function(dom, name) {
            addEvent(dom, focusMap[name], blurFocus);
        };
    }
});

eventHooks.scroll = function(dom, name) {
    addEvent(dom, name, specialHandles[name]);
};

eventHooks.doubleclick = function(dom, name) {
    addEvent(document, 'dblclick', specialHandles[name]);
};

export function SyntheticEvent(event) {
    if (event.nativeEvent) {
        return event;
    }
    for (let i in event) {
        if (!eventProto[i]) {
            this[i] = event[i];
        }
    }
    if (!this.target) {
        this.target = event.srcElement;
    }
    this.fixEvent();
    this.timeStamp = new Date() - 0;
    this.nativeEvent = event;
}

let eventProto = (SyntheticEvent.prototype = {
    fixEvent: noop, //留给以后扩展用
    fixHooks: noop,
    persist: noop,
    preventDefault: function() {
        let e = this.nativeEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
            this.defaultPrevented = true;
        }
    },
    stopPropagation: function() {
        let e = this.nativeEvent || {};
        e.cancelBubble = this._stopPropagation = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function() {
        this.stopPropagation();
        this.stopImmediate = true;
    },
    toString: function() {
        return '[object Event]';
    }
});

Renderer.eventSystem = {
    eventPropHooks,
    addEvent,
    dispatchEvent,
    SyntheticEvent
};

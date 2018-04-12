import { document, modern, contains } from "./browser";
import { isFn, noop } from "./util";
import { flushUpdaters } from "./scheduler";
import { Refs } from "./Refs";

let globalEvents = {};
export let eventPropHooks = {}; //用于在事件回调里对事件对象进行
export let eventHooks = {}; //用于在元素上绑定特定的事件
//根据onXXX得到其全小写的事件名, onClick --> click, onClickCapture --> click,
// onMouseMove --> mousemove

export let eventLowerCache = {
    onClick: "click",
    onChange: "change",
    onWheel: "wheel"
};
/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
export function isEventName(name) {
    return /^on[A-Z]/.test(name);
}

export let isTouch = "ontouchstart" in document;

export function dispatchEvent(e, type, end) {
    //__type__ 在injectTapEventPlugin里用到
    e = new SyntheticEvent(e);
    if (type) {
        e.type = type;
    }
    let bubble = e.type;
    //let dom = e.target;
    let hook = eventPropHooks[bubble];
    if (hook && false === hook(e)) {
        return;
    }
    let paths = collectPaths(e.target, end || document);
    let captured = bubble + "capture";
    document.__async = true;

    triggerEventFlow(paths, captured, e);

    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    document.__async = false;

    flushUpdaters();
    Refs.controlledCbs.forEach(function(el) {
        if (el.stateNode) {
            el.controlledCb({
                target: el.stateNode
            });
        }
    });
    Refs.controlledCbs.length = 0;
}

function collectPaths(from, end) {
    let paths = [];
    let node = from;
    while (node && !node.__events) {
        node = node.parentNode;
        if (end === from) {
            return paths;
        }
    }
    if (!node || node.nodeType > 1) {
        //如果跑到document上
        return paths;
    }
    let mid = node.__events;
    let vnode = mid.vnode;
    if (vnode._isPortal) {
        vnode = vnode.child;
    }
    do {
        if (vnode.tag === 5) {
            let dom = vnode.stateNode;
            if (dom === end) {
                break;
            }
            if (!dom) {
                break;
            }
            if (dom.__events) {
                paths.push({ dom: dom, events: dom.__events });
            }
        }
    } while ((vnode = vnode.return)); // eslint-disable-line
    return paths;
}

function triggerEventFlow(paths, prop, e) {
    for (let i = paths.length; i--; ) {
        let path = paths[i];
        let fn = path.events[prop];
        if (isFn(fn)) {
            e.currentTarget = path.dom;
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
        el.attachEvent("on" + type, fn);
    }
}

let rcapture = /Capture$/;
export function getBrowserName(onStr) {
    let lower = eventLowerCache[onStr];
    if (lower) {
        return lower;
    }
    let camel = onStr.slice(2).replace(rcapture, "");
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
        e.relatedTarget = e.type === "mouseover" ? e.fromElement : e.toElement;
    }
    return e.relatedTarget;
}

String("mouseenter,mouseleave").replace(/\w+/g, function(name) {
    eventHooks[name] = function(dom, type) {
        let mark = "__" + type;
        if (!dom[mark]) {
            dom[mark] = true;
            let mask = type === "mouseenter" ? "mouseover" : "mouseout";
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
    dispatchEvent(e, "change");
}

function isInCompositionMode(e) {
    return !e.target.__onComposition;
}

createHandle("doubleclick");
createHandle("scroll");
createHandle("wheel");
globalEvents.wheel = true;
globalEvents.scroll = true;
globalEvents.doubleclick = true;

if (isTouch) {
    eventHooks.click = eventHooks.clickcapture = function(dom) {
        dom.onclick = dom.onclick || noop;
    };

    createHandle("change", isInCompositionMode);
    // react将text,textarea,password元素中的onChange事件当成onInput事件
    eventHooks.changecapture = eventHooks.change = function(dom) {
        if (/text|password|search/.test(dom.type)) {
            addEvent(dom, "compositionstart", onCompositionStart);
            addEvent(dom, "compositionend", onCompositionEnd);
            addEvent(document, "input", specialHandles.change);
        }
    };
} else {
    createHandle("change");
    eventHooks.changecapture = eventHooks.change = function(dom) {
        if (/text|password|search/.test(dom.type)) {
            addEvent(document, "input", specialHandles.change);
        }
    };
}

eventPropHooks.click = function(e) {
    return !e.target.disabled;
};

const fixWheelType = document.onwheel !== void 666 ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
eventHooks.wheel = function(dom) {
    addEvent(dom, fixWheelType, specialHandles.wheel);
};

eventPropHooks.wheel = function(event) {
    event.deltaX =
        "deltaX" in event
            ? event.deltaX
            : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
            "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    event.deltaY =
        "deltaY" in event
            ? event.deltaY
            : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
            "wheelDeltaY" in event
                ? -event.wheelDeltaY
                : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
                "wheelDelta" in event ? -event.wheelDelta : 0;
};

export let focusMap = {
    focus: "focus",
    blur: "blur"
};

function blurFocus(e) {
    let dom = e.target || e.srcElement;
    let type = focusMap[e.type];
    let isFocus = type === "focus";
    if (isFocus && dom.__inner__) {
        dom.__inner__ = false;
        return;
    }

    if (!isFocus && Refs.focusNode === dom) {
        Refs.focusNode = null;
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

"blur,focus".replace(/\w+/g, function(type) {
    globalEvents[type] = true;
    if (modern) {
        let mark = "__" + type;
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
    addEvent(document, "dblclick", specialHandles[name]);
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
        return "[object Event]";
    }
});
/* istanbul ignore next  */
//freeze_start
Object.freeze ||
    (Object.freeze = function(a) {
        return a;
    });
//freeze_end

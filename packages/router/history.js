import { getWindow } from 'react-core/util';
//计划有history hash iframe三种模式
export var modeObject = {};
//伪造一个Location对象
function getLocation(source) {
    const location = {
        getPath() {
            return modeObject.value === 'hash' ? this.hash.slice(1) : this.pathname;
        },
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || 'initial'
    };
    for (const key in source.location) {
        if (Object.prototype.hasOwnProperty.call(source.location, key)) {
            location[key] = source.location[key];
        }
    }
    return location;
}

//伪造一个History对象
function createHistory(source) {
    let listeners = [];

    let transitioning = false;
    let resolveTransition = () => {};
    let target = {
        //减少魔法，提高兼容性，将只读的访问器属性改成普通属性
        location: getLocation(source),

        transitioning,

        _onTransitionComplete() {
            target.transitioning = transitioning = false;
            resolveTransition();
        },

        listen(listener) {
            listeners.push(listener);

            let popstateListener = e => {
                target.location = getLocation(source);
                listener();
            };
            var event = modeObject.value === 'hash' ? 'hashchange' : 'popstate';
            addEvent(source, event, popstateListener);
            return () => {
                removeEvent(source, event, popstateListener);
                listeners = listeners.filter(fn => fn !== listener);
            };
        },

        navigate(to, { state, replace = false } = {}) {
            state = {
                ...state,
                key: Date.now() + ''
            };
            // try...catch iOS Safari limits to 100 pushState calls
            var slocation = source.location;
            if (modeObject.value === 'hash') {
                if (replace && slocation.hash !== newHash) {
                    history.back();
                }
                slocation.hash = to;
            } else {
                try {
                    if (transitioning || replace) {
                        source.history.replaceState(state, null, to);
                    } else {
                        source.history.pushState(state, null, to);
                    }
                } catch (e) {
                    slocation[replace ? 'replace' : 'assign'](to);
                }
            }

            target.location = getLocation(source);

            target.transitioning = transitioning = true;

            let transition = new Promise(res => (resolveTransition = res));
            listeners.forEach(fn => fn());
            return transition;
        }
    };
    return target;
}

function addEvent(dom, name, fn) {
    if (dom.addEventListener) {
        dom.addEventListener(name, fn);
    } else if (dom.attachEvent) {
        dom.attachEvent('on' + name, fn);
    }
}

function removeEvent(dom, name, fn) {
    if (dom.removeEventListener) {
        dom.removeEventListener(name, fn);
    } else if (dom.detachEvent) {
        dom.detachEvent('on' + name, fn);
    }
}
////////////////////////////////////////////////////////////////////////////////
// 伪造一个window对象
function createMemorySource(initialPathname = '/') {
    let index = 0;
    let states = [];
    let stack = [
        {
            pathname: initialPathname,
            search: ''
        }
    ];

    let target = {
        // location
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            // index
            // entries,
            // state
            back() {},
            pushState(state, _, uri) {
                index++;
                stack.push(uri2obj(uri));
                states.push(state);
                sync(target);
            },
            replaceState(state, _, uri) {
                stack[index] = uri2obj(uri);
                states[index] = state;
                sync(target);
            }
        }
    };

    function sync(target) {
        var history = target.history;
        history.index = index;
        history.entries = stack;
        history.state = states[index];
        target.location = stack[index];
    }
    sync(target);
    return target;
}

function uri2obj(uri) {
    let arr = uri.split('?');
    let pathname = arr[0];
    let search = arr[1] || '';
    return {
        pathname,
        search
    };
}

////////////////////////////////////////////////////////////////////////////////
// global history - uses window.history as the source if available, otherwise a
// memory history
let win = getWindow();
let getSource = () => {
    return win.location ? win : createMemorySource();
};

let globalHistory = createHistory(getSource());
let { navigate } = globalHistory;

export { globalHistory, navigate, createHistory, createMemorySource };

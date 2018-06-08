import {
    getWindow
} from "react-core/util";

//伪造一个Location对象
function getLocation(source) {
    return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
    };
}
//伪造一个History对象
function createHistory(source) {
    let listeners = [];
    let location = getLocation(source);
    let transitioning = false;
    let resolveTransition = () => {};

    let target = {
        //减少魔法，提高兼容性，将只读的访问器属性改成普通属性
        location,

        transitioning,

        _onTransitionComplete() {
            target.transitioning = transitioning = false;
            resolveTransition();
        },

        listen(listener) {
            listeners.push(listener);

            let popstateListener = () => {
                location = target.location = getLocation(source);
                listener();
            };

            source.addEventListener("popstate", popstateListener);

            return () => {
                source.removeEventListener("popstate", popstateListener);
                listeners = listeners.filter(fn => fn !== listener);
            };
        },

        navigate(to, {
            state,
            replace = false
        } = {}) {
            state = { ...state,
                key: Date.now() + ""
            };
            // try...catch iOS Safari limits to 100 pushState calls
            try {
                if (transitioning || replace) {
                    source.history.replaceState(state, null, to);
                } else {
                    source.history.pushState(state, null, to);
                }
            } catch (e) {
                source.location[replace ? "replace" : "assign"](to);
            }

            target.location = location = getLocation(source);
            target.transitioning = transitioning = true;

            let transition = new Promise(res => (resolveTransition = res));
            listeners.forEach(fn => fn());
            return transition;
        }
    };
    return target;
}

////////////////////////////////////////////////////////////////////////////////
// 伪造一个window对象
function createMemorySource(initialPathname = "/") {
    let index = 0;
    let states = [];
    let stack = [{
        pathname: initialPathname,
        search: ""
    }];

    let target = {
        // location
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            // index
            // entries,
            // state
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
    let arr = uri.split("?");
    let pathname = arr[0];
    let search = arr[1] || "";
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
let {
    navigate
} = globalHistory;


export {
    globalHistory,
    navigate,
    createHistory,
    createMemorySource
};
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
let createHistory = (source) => {
    let listeners = [];
    let location = getLocation(source);
    let transitioning = false;
    let resolveTransition = () => {};

    return {
        get location() {
            return location;
        },

        get transitioning() {
            return transitioning;
        },

        _onTransitionComplete() {
            transitioning = false;
            resolveTransition();
        },

        listen(listener) {
            listeners.push(listener);

            let popstateListener = () => {
                location = getLocation(source);
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

            location = getLocation(source);
            transitioning = true;
            let transition = new Promise(res => (resolveTransition = res));
            listeners.forEach(fn => fn());
            return transition;
        }
    };
};

////////////////////////////////////////////////////////////////////////////////
// 伪造一个window对象
let createMemorySource = (initialPathname = "/") => {
    let index = 0;
    let stack = [{
        pathname: initialPathname,
        search: ""
    }];
    let states = [];

    return {
        get location() {
            return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            get entries() {
                return stack;
            },
            get index() {
                return index;
            },
            get state() {
                return states[index];
            },
            pushState(state, _, uri) {
                index++;
                stack.push(uri2obj(uri));
                states.push(state);
            },
            replaceState(state, _, uri) {
                stack[index] = uri2obj(uri);
                states[index] = state;
            }
        }
    };
};

function uri2obj(uri){
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

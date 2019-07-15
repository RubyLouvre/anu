/* eslint-disable jsx-a11y/anchor-has-content */
import { miniCreateClass, getWindow } from "react-core/util";

import {
    startsWith,
    invariant,
    pick,
    resolve,
    match,
    insertParams,
    validateRedirect
} from "./utils";
import {
    globalHistory,
    navigate,
    modeObject,
    createHistory,
    createMemorySource
} from "./history";

////////////////////////////////////////////////////////////////////////////////
// React polyfill
let win = getWindow()
var supportPushState = !!win.history && win.history.pushState;
var supportHashChange = !!("onhashchange" in win )
let React = win.React;
if(!React || !React.eventSystem){
   throw "请先安装anujs";
}
let {
    unstable_deferredUpdates,
    PropTypes,
    cloneElement,
    PureComponent,
    createContext,
    Children,
    Component
} = React;
if (unstable_deferredUpdates === undefined) {
    unstable_deferredUpdates = fn => fn();
}

const createNamedContext = (name, defaultValue) => {
    const Ctx = createContext(defaultValue);
    Ctx.Consumer.displayName = `${name}.Consumer`;
    Ctx.Provider.displayName = `${name}.Provider`;
    return Ctx;
};

////////////////////////////////////////////////////////////////////////////////
// Location Context/Provider
let LocationContext = createNamedContext("Location");

// sets up a listener if there isn't one already so apps don't need to be
// wrapped in some top level provider
let Location = ({ children }) => (
    <LocationContext.Consumer>
        {context =>
            context ? (
                children(context)
            ) : (
                <LocationProvider>{children}</LocationProvider>
            )
        }
    </LocationContext.Consumer>
);

let LocationProvider = miniCreateClass(
    function LocationProvider() {
        this.state = {
            context: this.getContext(),
            refs: { unlisten: null }
        };
    },
    Component,
    {
        getContext() {
            let { navigate, location } = this.props.history;

            return { navigate, location };
        },

        componentDidCatch(error, info) {
            if (isRedirect(error)) {
                let  { navigate } = this.props.history;
                navigate(error.uri, { replace: true });
            } else {
                throw error;
            }
        },

        componentDidUpdate(prevProps, prevState) {
            if (prevState.context.location !== this.state.context.location) {
                this.props.history._onTransitionComplete();
            }
        },

        componentDidMount() {
            let {
                state: { refs },
                props: { history }
            } = this;
            refs.unlisten = history.listen(() => {
                Promise.resolve().then(() => {
                    unstable_deferredUpdates(() => {
                        if (!this.unmounted) {
                            this.setState(() => ({ context: this.getContext() }));
                        }
                    });
                });
            });
        },

        componentWillUnmount() {
            let {
                state: { refs }
            } = this;
            this.unmounted = true;
            refs.unlisten();
        },

        render() {
            let {
                state: { context },
                props: { children }
            } = this;
            return (
                <LocationContext.Provider value={context}>
                    {typeof children === "function"
                        ? children(context)
                        : children || null}
                </LocationContext.Provider>
            );
        }
    },
    {
        defaultProps: {
            history: globalHistory
        }
    }
);
////////////////////////////////////////////////////////////////////////////////
let ServerLocation = ({ url, children }) => (
    <LocationContext.Provider
        value={{
            location: { pathname: url },
            navigate: () => {
                throw new Error("You can't call navigate on the server.");
            }
        }}
    >
        {children}
    </LocationContext.Provider>
);

////////////////////////////////////////////////////////////////////////////////
// Sets baseuri and basepath for nested routers and links
let BaseContext = createNamedContext("Base", { baseuri: "/", basepath: "/" });

////////////////////////////////////////////////////////////////////////////////
// The main event, welcome to the show everybody.
function Router(props) {
    modeObject.value = supportPushState && (!props.mode || props.mode === "history") ? "history": "hash"
    return  (<BaseContext.Consumer>
        {baseContext => (
            <Location>
                {locationContext => (
                    <RouterImpl {...baseContext} {...locationContext} {...props} />
                )}
            </Location>
        )}
    </BaseContext.Consumer>)
}

let RouterImpl = miniCreateClass(
    function RouterImpl() {},
    PureComponent,
    {
        render() {
            let {
                location,
                navigate,
                basepath,
                primary,
                children,
                component = "div",
                baseuri,
                mode,
                ...domProps
            } = this.props;
            let routes = Children.map(children, createRoute(basepath));
            //** pathname改成getPath()
            let pathname = location.getPath()
          
            let match = pick(routes, pathname);

            if (match) {
                let {
                    params,
                    uri,
                    route,
                    route: { value: element }
                } = match;

                // remove the /* from the end for child routes relative paths
                basepath = route.default ? basepath : route.path.replace(/\*$/, "");

                let props = {
                    ...params,
                    uri,
                    location,
                    navigate: (to, options) => navigate(resolve(to, uri), options)
                };

                let clone = cloneElement(
                    element,
                    props,
                    element.props.children ? (
                        <Router primary={primary} mode={mode}>{element.props.children}</Router>
                    ) : (
                        void 666
                    )
                );

                // using 'div' for < 16.3 support
                let FocusWrapper = primary ? FocusHandler : component;
                // don't pass any props to 'div'
                let wrapperProps = primary ? { uri, location, ...domProps } : domProps;

                return (
                    <BaseContext.Provider value={{ baseuri: uri, basepath }}>
                        <FocusWrapper {...wrapperProps}>{clone}</FocusWrapper>
                    </BaseContext.Provider>
                );
            } else {
                return null;
            }
        }
    },
    {
        defaultProps: {
            primary: true
        }
    }
);

let FocusContext = createNamedContext("Focus");
//用于Router组件内部
let FocusHandler = ({ uri, location, ...domProps }) => (
    <FocusContext.Consumer>
        {requestFocus => (
            <FocusHandlerImpl
                {...domProps}
                requestFocus={requestFocus}
                uri={uri}
                location={location}
            />
        )}
    </FocusContext.Consumer>
);

// don't focus on initial render
let initialRender = true;
let focusHandlerCount = 0;

let FocusHandlerImpl = miniCreateClass(
    function FocusHandlerImpl() {
        this.state = {};
        this.requestFocus = node => {
            if (!this.state.shouldFocus) {
                node.focus();
            }
        };
    },
    Component,
    {
        componentDidMount() {
            focusHandlerCount++;
            this.focus();
        },

        componentWillUnmount() {
            focusHandlerCount--;
            if (focusHandlerCount === 0) {
                initialRender = true;
            }
        },

        componentDidUpdate(prevProps, prevState) {
            if (
                prevProps.location !== this.props.location &&
        this.state.shouldFocus
            ) {
                this.focus();
            }
        },

        focus() {
            if (getWindow().process) {
                // getting cannot read property focus of null in the tests
                // and that bit of global `initialRender` state causes problems
                // should probably figure it out!
                return;
            }

            let { requestFocus } = this.props;

            if (requestFocus) {
                requestFocus(this.node);
            } else {
                if (initialRender) {
                    initialRender = false;
                } else {
                    this.node.focus();
                }
            }
        },

        render() {
            let {
                children,
                style,
                requestFocus,
                role = "group",
                component: Comp = "div",
                uri,
                location,
                ...domProps
            } = this.props;
            return (
                <Comp
                    style={{ outline: "none", ...style }}
                    tabIndex="-1"
                    role={role}
                    ref={n => (this.node = n)}
                    {...domProps}
                >
                    <FocusContext.Provider value={this.requestFocus}>
                        {this.props.children}
                    </FocusContext.Provider>
                </Comp>
            );
        }
    },
    {
        getDerivedStateFromProps: function(nextProps, prevState) {
            let initial = prevState.uri == null;
            if (initial) {
                return {
                    shouldFocus: true,
                    ...nextProps
                };
            } else {
                let myURIChanged = nextProps.uri !== prevState.uri;
                //** pathname改成getPath()
                let nextPath = nextProps.location.getPath();
                let navigatedUpToMe = prevState.location.getPath() !== nextPath &&
                     nextPath === nextProps.uri;
                return {
                    shouldFocus: myURIChanged || navigatedUpToMe,
                    ...nextProps
                };
            }
        }
    }
);

/**
 * Link，锚点组件，用于切换页面的子视图，主要有如下属性与方法
 * 1. to
 * 2. replace
 * 3. getProps({isCurrent, isPartiallyCurrent, href, location }), 用于生成更多其他属性
 * 4. state
 * 它实质是包了两层的A元素
 */
function noop() {}
let Link = props => (
    <BaseContext.Consumer>
        {({ basepath, baseuri }) => (
            <Location>
                {({ location, navigate }) => {
                    let anchorProps = {},
                        to,
                        state,
                        replace,
                        getProps = noop;
                    for (let key in props) {
                        let val = props[key];
                        if (key === "to") {
                            to = val;
                        } else if (key === "state") {
                            state = val;
                        } else if (key === "replace") {
                            replace = val;
                        } else if (key == "getProps" && val) {
                            getProps = val;
                        } else {
                            anchorProps[key] = val;
                        }
                    }

                    let href = resolve(to, baseuri);
                     //** pathname改成getPath()
                    let isCurrent = location.getPath() === href;
                    let isPartiallyCurrent = startsWith(location.getPath(), href);
                    Object.assign(
                        anchorProps,
                        getProps({ isCurrent, isPartiallyCurrent, href, location })
                    );
                    anchorProps.href = href;
                    if (isCurrent) {
                        anchorProps["aria-current"] = "page";
                    }
                    var fn = anchorProps.onClick;
                    anchorProps.onClick = function(event){
                        if (fn) {
                            fn(event);
                        }
                        event.preventDefault();
                        if (shouldNavigate(event)) {
                            event.preventDefault();
                            navigate(href, { state, replace });
                        }
                    };
                    return (
                        <a
                            {...anchorProps}
                        />
                    );
                }}
            </Location>
        )}
    </BaseContext.Consumer>
);

// <Redirect> 可以设置重定向到其他 route 而不改变旧的 URL
function RedirectRequest(uri) {
    this.uri = uri;
}

let isRedirect = o => o instanceof RedirectRequest;

let redirectTo = to => {
    throw new RedirectRequest(to);
};

let RedirectImpl = miniCreateClass(function RedirectImpl() {}, Component, {
    // Support React < 16 with this hook
    componentDidMount() {
        let {
            props: { navigate, to, from, replace = true, state, noThrow, ...props }
        } = this;
        navigate(insertParams(to, props), { replace, state });
    },

    render() {
        let {
            props: { navigate, to, from, replace, state, noThrow, ...props }
        } = this;
        if (!noThrow) {
            redirectTo(insertParams(to, props));
        }
        return null;
    }
});
let Redirect = props => (
    <Location>
        {locationContext => <RedirectImpl {...locationContext} {...props} />}
    </Location>
);

Redirect.propTypes = {
    from: PropTypes.string,
    to: PropTypes.string.isRequired
};

//<Match />有点类似于<Link/>，但当前路径匹配URL，那么就会呈现其内容
// 原来React Router 4想实现的组件 https://zhuanlan.zhihu.com/p/22490775
let Match = ({ path, children }) => (
    <BaseContext.Consumer>
        {({ baseuri }) => (
            <Location>
                {({ navigate, location }) => {
                    let resolvedPath = resolve(path, baseuri);
                    //** pathname改成getPath()
                    let result = match(resolvedPath, location.getPath());

                    return children({
                        navigate,
                        location,
                        match: result
                            ? {
                                ...result.params,
                                uri: result.uri,
                                path
                            }
                            : null
                    });
                }}
            </Location>
        )}
    </BaseContext.Consumer>
);

////////////////////////////////////////////////////////////////////////////////
// Junk
let stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

let createRoute = basepath => element => {
    invariant(
        element.props.path || element.props.default || element.type === Redirect,
        `<Router>: Children of <Router> must have a "path" or "default" prop, or be a "<Redirect>". 
         None found on element type "${element.type}"`
    );

    invariant(
        !(element.type === Redirect && (!element.props.from || !element.props.to)),
        `<Redirect from="${element.props.from} to="${
            element.props.to
        }"/> requires both "from" and "to" props when inside a <Router>.`
    );

    invariant(
        !(
            element.type === Redirect &&
      !validateRedirect(element.props.from, element.props.to)
        ),
        `<Redirect from="${element.props.from} to="${
            element.props.to
        }"/> has mismatched dynamic segments, ensure both paths have the exact same dynamic segments.`
    );

    if (element.props.default) {
        return { value: element, default: true };
    }

    let elementPath =
    element.type === Redirect ? element.props.from : element.props.path;

    let path =
    elementPath === "/"
        ? basepath
        : `${stripSlashes(basepath)}/${stripSlashes(elementPath)}`;

    return {
        value: element,
        default: element.props.default,
        path: element.props.children ? `${stripSlashes(path)}/*` : path
    };
};

function shouldNavigate(event) {
    return (
        !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    );
}
////////////////////////////////////////////////////////////////////////

var ReachRouter = {
    //fiber底层API
    version: "VERSION",
    Link,
    Location,
    LocationProvider,
    Match,
    Redirect,
    Router,
    ServerLocation,
    createHistory,
    createMemorySource,
    isRedirect,
    navigate,
    redirectTo
};

export default ReachRouter;

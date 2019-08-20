/**
 * Reach Router的anujs适配版 文档见这里 https://reach.tech/router
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.ReachRouter = factory());
}(this, (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var fakeWindow = {};
    function getWindow() {
        try {
            if (window) {
                return window;
            }
        } catch (e) { }
        try {
            if (global) {
                return global;
            }
        } catch (e) { }
        return fakeWindow;
    }
    function extend(obj, props) {
        for (var i in props) {
            if (hasOwnProperty.call(props, i)) {
                obj[i] = props[i];
            }
        }
        return obj;
    }
    function inherit(SubClass, SupClass) {
        function Bridge() { }
        var orig = SubClass.prototype;
        Bridge.prototype = SupClass.prototype;
        var fn = SubClass.prototype = new Bridge();
        extend(fn, orig);
        fn.constructor = SubClass;
        return fn;
    }
    try {
        var supportEval = Function('a', 'return a + 1')(2) == 3;
    } catch (e) { }
    var rname = /function\s+(\w+)/;
    function miniCreateClass(ctor, superClass, methods, statics) {
        var className = ctor.name || (ctor.toString().match(rname) || ['', 'Anonymous'])[1];
        var Ctor = supportEval ? Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor) : function ReactInstance() {
            superClass.apply(this, arguments);
            ctor.apply(this, arguments);
        };
        Ctor.displayName = className;
        var proto = inherit(Ctor, superClass);
        extend(proto, methods);
        extend(Ctor, superClass);
        if (statics) {
            extend(Ctor, statics);
        }
        return Ctor;
    }

    function startsWith(string, search) {
        return string.slice(0, search.length) === search;
    }
    var reservedNames = ["uri", "path"];
    function invariant(condition, msg) {
        if (!condition) {
            throw msg;
        }
    }
    function pick(routes, uri) {
        var match = void 0;
        var default_ = void 0;
        var uriPathname = uri.split("?").shift();
        var uriSegments = segmentize(uriPathname);
        var isRootUri = uriSegments[0] === "";
        var ranked = rankRoutes(routes);
        for (var i = 0, l = ranked.length; i < l; i++) {
            var missed = false;
            var route = ranked[i].route;
            if (route.default) {
                default_ = {
                    route: route,
                    params: {},
                    uri: uri
                };
                continue;
            }
            var routeSegments = segmentize(route.path);
            var params = {};
            var max = Math.max(uriSegments.length, routeSegments.length);
            var index = 0;
            for (; index < max; index++) {
                var routeSegment = routeSegments[index];
                var uriSegment = uriSegments[index];
                var _isSplat = routeSegment === "*";
                if (_isSplat) {
                    params["*"] = uriSegments.slice(index).map(decodeURIComponent).join("/");
                    break;
                }
                if (uriSegment === undefined) {
                    missed = true;
                    break;
                }
                var dynamicMatch = paramRe.exec(routeSegment);
                if (dynamicMatch && !isRootUri) {
                    invariant(!reservedNames.includes(dynamicMatch[1]), "<Router> dynamic segment \"" + dynamicMatch[1] + "\" is a reserved name. Please use a different name in path \"" + route.path + "\".");
                    var value = decodeURIComponent(uriSegment);
                    params[dynamicMatch[1]] = value;
                } else if (routeSegment !== uriSegment) {
                    missed = true;
                    break;
                }
            }
            if (!missed) {
                match = {
                    route: route,
                    params: params,
                    uri: "/" + uriSegments.slice(0, index).join("/")
                };
                break;
            }
        }
        return match || default_ || null;
    }
    function match(path, uri) {
        return pick([{ path: path }], uri);
    }
    function resolve(to, base) {
        if (startsWith(to, "/")) {
            return to;
        }
        var _arr = to.split("?");
        var toPathname = _arr[0];
        var toQuery = _arr[1];
        var basePathname = base.split("?").shift();
        var toSegments = segmentize(toPathname);
        var baseSegments = segmentize(basePathname);
        if (toSegments[0] === "") {
            return addQuery(basePathname, toQuery);
        }
        if (!startsWith(toSegments[0], ".")) {
            var pathname = baseSegments.concat(toSegments).join("/");
            return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
        }
        var allSegments = baseSegments.concat(toSegments);
        var segments = [];
        for (var i = 0, n = allSegments.length; i < n; i++) {
            var segment = allSegments[i];
            if (segment === "..") {
                segments.pop();
            } else if (segment !== ".") {
                segments.push(segment);
            }
        }
        return addQuery("/" + segments.join("/"), toQuery);
    }
    function insertParams(path, params) {
        var segments = segmentize(path);
        return "/" + segments.map(function (segment) {
            var match = paramRe.exec(segment);
            return match ? params[match[1]] : segment;
        }).join("/");
    }
    function validateRedirect(from, to) {
        var filter = function filter(segment) {
            return isDynamic(segment);
        };
        var fromString = segmentize(from).filter(filter).sort().join("/");
        var toString = segmentize(to).filter(filter).sort().join("/");
        return fromString === toString;
    }
    var paramRe = /^:(.+)/;
    var SEGMENT_POINTS = 4;
    var STATIC_POINTS = 3;
    var DYNAMIC_POINTS = 2;
    var SPLAT_PENALTY = 1;
    var ROOT_POINTS = 1;
    var isRootSegment = function isRootSegment(segment) {
        return segment == "";
    };
    var isDynamic = function isDynamic(segment) {
        return paramRe.test(segment);
    };
    var isSplat = function isSplat(segment) {
        return segment === "*";
    };
    function rankRoute(route, index) {
        var score = route.default ? 0 : segmentize(route.path).reduce(function (score, segment) {
            score += SEGMENT_POINTS;
            if (isRootSegment(segment)) {
                score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
                score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
                score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
                score += STATIC_POINTS;
            }
            return score;
        }, 0);
        return { route: route, score: score, index: index };
    }
    function sorter(a, b) {
        return a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index;
    }
    function rankRoutes(routes) {
        return routes.map(rankRoute).sort(sorter);
    }
    function segmentize(uri) {
        return uri.replace(/(^\/+|\/+$)/g, "").split("/");
    }
    function addQuery(pathname, query) {
        return pathname + (query ? "?" + query : "");
    }

    var modeObject = {};
    function getLocation(source) {
        var location = {
            getPath: function getPath() {
                return modeObject.value === 'hash' ? this.hash.slice(1) : this.pathname;
            },
            state: source.history.state,
            key: source.history.state && source.history.state.key || 'initial'
        };
        for (var key in source.location) {
            if (Object.prototype.hasOwnProperty.call(source.location, key)) {
                location[key] = source.location[key];
            }
        }
        return location;
    }
    function createHistory(source) {
        var listeners = [];
        var transitioning = false;
        var resolveTransition = function resolveTransition() { };
        var target = {
            location: getLocation(source),
            transitioning: transitioning,
            _onTransitionComplete: function _onTransitionComplete() {
                target.transitioning = transitioning = false;
                resolveTransition();
            },
            listen: function listen(listener) {
                listeners.push(listener);
                var popstateListener = function popstateListener(e) {
                    target.location = getLocation(source);
                    listener();
                };
                var event = modeObject.value === 'hash' ? 'hashchange' : 'popstate';
                addEvent(source, event, popstateListener);
                return function () {
                    removeEvent(source, event, popstateListener);
                    listeners = listeners.filter(function (fn) {
                        return fn !== listener;
                    });
                };
            },
            navigate: function navigate(to) {
                var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    state = _ref.state,
                    _ref$replace = _ref.replace,
                    replace = _ref$replace === undefined ? false : _ref$replace;
                state = Object.assign({}, state, {
                    key: Date.now() + ''
                });
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
                var transition = new Promise(function (res) {
                    return resolveTransition = res;
                });
                listeners.forEach(function (fn) {
                    return fn();
                });
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
    function createMemorySource() {
        var initialPathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
        var index = 0;
        var states = [];
        var stack = [{
            pathname: initialPathname,
            search: ''
        }];
        var target = {
            addEventListener: function addEventListener(name, fn) { },
            removeEventListener: function removeEventListener(name, fn) { },
            history: {
                back: function back() { },
                pushState: function pushState(state, _, uri) {
                    index++;
                    stack.push(uri2obj(uri));
                    states.push(state);
                    sync(target);
                },
                replaceState: function replaceState(state, _, uri) {
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
        var arr = uri.split('?');
        var pathname = arr[0];
        var search = arr[1] || '';
        return {
            pathname: pathname,
            search: search
        };
    }
    var win = getWindow();
    var getSource = function getSource() {
        return win.location ? win : createMemorySource();
    };
    var globalHistory = createHistory(getSource());
    var navigate = globalHistory.navigate;

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
    var win$1 = getWindow();
    var supportPushState = !!win$1.history && win$1.history.pushState;
    var React = win$1.React;
    if (!React || !React.eventSystem) {
        throw "请先安装anujs";
    }
    var unstable_deferredUpdates = React.unstable_deferredUpdates,
        PropTypes = React.PropTypes,
        cloneElement = React.cloneElement,
        PureComponent = React.PureComponent,
        createContext = React.createContext,
        Children = React.Children,
        Component = React.Component;
    if (unstable_deferredUpdates === undefined) {
        unstable_deferredUpdates = function unstable_deferredUpdates(fn) {
            return fn();
        };
    }
    var createNamedContext = function createNamedContext(name, defaultValue) {
        var Ctx = createContext(defaultValue);
        Ctx.Consumer.displayName = name + ".Consumer";
        Ctx.Provider.displayName = name + ".Provider";
        return Ctx;
    };
    var LocationContext = createNamedContext("Location");
    var Location = function Location(_ref) {
        var children = _ref.children;
        return React.createElement(
            LocationContext.Consumer,
            null,
            function (context) {
                return context ? children(context) : React.createElement(
                    LocationProvider,
                    null,
                    children
                );
            }
        );
    };
    var LocationProvider = miniCreateClass(function LocationProvider() {
        this.state = {
            context: this.getContext(),
            refs: { unlisten: null }
        };
    }, Component, {
            getContext: function getContext() {
                var _props$history = this.props.history,
                    navigate$$1 = _props$history.navigate,
                    location = _props$history.location;
                return { navigate: navigate$$1, location: location };
            },
            componentDidCatch: function componentDidCatch(error, info) {
                if (isRedirect(error)) {
                    var _navigate = this.props.history.navigate;
                    _navigate(error.uri, { replace: true });
                } else {
                    throw error;
                }
            },
            componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
                if (prevState.context.location !== this.state.context.location) {
                    this.props.history._onTransitionComplete();
                }
            },
            componentDidMount: function componentDidMount() {
                var _this = this;
                var refs = this.state.refs,
                    history = this.props.history;
                refs.unlisten = history.listen(function () {
                    Promise.resolve().then(function () {
                        unstable_deferredUpdates(function () {
                            if (!_this.unmounted) {
                                _this.setState(function () {
                                    return { context: _this.getContext() };
                                });
                            }
                        });
                    });
                });
            },
            componentWillUnmount: function componentWillUnmount() {
                var refs = this.state.refs;
                this.unmounted = true;
                refs.unlisten();
            },
            render: function render() {
                var context = this.state.context,
                    children = this.props.children;
                return React.createElement(
                    LocationContext.Provider,
                    { value: context },
                    typeof children === "function" ? children(context) : children || null
                );
            }
        }, {
            defaultProps: {
                history: globalHistory
            }
        });
    var ServerLocation = function ServerLocation(_ref2) {
        var url = _ref2.url,
            children = _ref2.children;
        return React.createElement(
            LocationContext.Provider,
            {
                value: {
                    location: { pathname: url },
                    navigate: function navigate$$1() {
                        throw new Error("You can't call navigate on the server.");
                    }
                }
            },
            children
        );
    };
    var BaseContext = createNamedContext("Base", { baseuri: "/", basepath: "/" });
    function Router(props) {
        modeObject.value = supportPushState && (!props.mode || props.mode === "history") ? "history" : "hash";
        return React.createElement(
            BaseContext.Consumer,
            null,
            function (baseContext) {
                return React.createElement(
                    Location,
                    null,
                    function (locationContext) {
                        return React.createElement(RouterImpl, _extends({}, baseContext, locationContext, props));
                    }
                );
            }
        );
    }
    var RouterImpl = miniCreateClass(function RouterImpl() { }, PureComponent, {
        render: function render() {
            var _props = this.props,
                location = _props.location,
                _navigate2 = _props.navigate,
                basepath = _props.basepath,
                primary = _props.primary,
                children = _props.children,
                _props$component = _props.component,
                component = _props$component === undefined ? "div" : _props$component,
                baseuri = _props.baseuri,
                mode = _props.mode,
                domProps = _objectWithoutProperties(_props, ["location", "navigate", "basepath", "primary", "children", "component", "baseuri", "mode"]);
            var routes = Children.map(children, createRoute(basepath));
            var pathname = location.getPath();
            var match$$1 = pick(routes, pathname);
            if (match$$1) {
                var params = match$$1.params,
                    uri = match$$1.uri,
                    route = match$$1.route,
                    element = match$$1.route.value;
                basepath = route.default ? basepath : route.path.replace(/\*$/, "");
                var props = Object.assign({}, params, {
                    uri: uri,
                    location: location,
                    navigate: function navigate$$1(to, options) {
                        return _navigate2(resolve(to, uri), options);
                    }
                });
                var clone = cloneElement(element, props, element.props.children ? React.createElement(
                    Router,
                    { primary: primary, mode: mode },
                    element.props.children
                ) : void 666);
                var FocusWrapper = primary ? FocusHandler : component;
                var wrapperProps = primary ? Object.assign({ uri: uri, location: location }, domProps) : domProps;
                return React.createElement(
                    BaseContext.Provider,
                    { value: { baseuri: uri, basepath: basepath } },
                    React.createElement(
                        FocusWrapper,
                        wrapperProps,
                        clone
                    )
                );
            } else {
                return null;
            }
        }
    }, {
            defaultProps: {
                primary: true
            }
        });
    var FocusContext = createNamedContext("Focus");
    var FocusHandler = function FocusHandler(_ref3) {
        var uri = _ref3.uri,
            location = _ref3.location,
            domProps = _objectWithoutProperties(_ref3, ["uri", "location"]);
        return React.createElement(
            FocusContext.Consumer,
            null,
            function (requestFocus) {
                return React.createElement(FocusHandlerImpl, _extends({}, domProps, {
                    requestFocus: requestFocus,
                    uri: uri,
                    location: location
                }));
            }
        );
    };
    var initialRender = true;
    var focusHandlerCount = 0;
    var FocusHandlerImpl = miniCreateClass(function FocusHandlerImpl() {
        var _this2 = this;
        this.state = {};
        this.requestFocus = function (node) {
            if (!_this2.state.shouldFocus) {
                node.focus();
            }
        };
    }, Component, {
            componentDidMount: function componentDidMount() {
                focusHandlerCount++;
                this.focus();
            },
            componentWillUnmount: function componentWillUnmount() {
                focusHandlerCount--;
                if (focusHandlerCount === 0) {
                    initialRender = true;
                }
            },
            componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
                if (prevProps.location !== this.props.location && this.state.shouldFocus) {
                    this.focus();
                }
            },
            focus: function focus() {
                if (getWindow().process) {
                    return;
                }
                var requestFocus = this.props.requestFocus;
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
            render: function render() {
                var _this3 = this;
                var _props2 = this.props,
                    children = _props2.children,
                    style = _props2.style,
                    requestFocus = _props2.requestFocus,
                    _props2$role = _props2.role,
                    role = _props2$role === undefined ? "group" : _props2$role,
                    _props2$component = _props2.component,
                    Comp = _props2$component === undefined ? "div" : _props2$component,
                    uri = _props2.uri,
                    location = _props2.location,
                    domProps = _objectWithoutProperties(_props2, ["children", "style", "requestFocus", "role", "component", "uri", "location"]);
                return React.createElement(
                    Comp,
                    _extends({
                        style: Object.assign({ outline: "none" }, style),
                        tabIndex: "-1",
                        role: role,
                        ref: function ref(n) {
                            return _this3.node = n;
                        }
                    }, domProps),
                    React.createElement(
                        FocusContext.Provider,
                        { value: this.requestFocus },
                        this.props.children
                    )
                );
            }
        }, {
            getDerivedStateFromProps: function getDerivedStateFromProps(nextProps, prevState) {
                var initial = prevState.uri == null;
                if (initial) {
                    return Object.assign({
                        shouldFocus: true
                    }, nextProps);
                } else {
                    var myURIChanged = nextProps.uri !== prevState.uri;
                    var nextPath = nextProps.location.getPath();
                    var navigatedUpToMe = prevState.location.getPath() !== nextPath && nextPath === nextProps.uri;
                    return Object.assign({
                        shouldFocus: myURIChanged || navigatedUpToMe
                    }, nextProps);
                }
            }
        });
    function noop$1() { }
    var Link = function Link(props) {
        return React.createElement(
            BaseContext.Consumer,
            null,
            function (_ref4) {
                var basepath = _ref4.basepath,
                    baseuri = _ref4.baseuri;
                return React.createElement(
                    Location,
                    null,
                    function (_ref5) {
                        var location = _ref5.location,
                            navigate$$1 = _ref5.navigate;
                        var anchorProps = {},
                            to = void 0,
                            state = void 0,
                            replace = void 0,
                            getProps = noop$1;
                        for (var key in props) {
                            var val = props[key];
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
                        var href = resolve(to, baseuri);
                        var isCurrent = location.getPath() === href;
                        var isPartiallyCurrent = startsWith(location.getPath(), href);
                        Object.assign(anchorProps, getProps({ isCurrent: isCurrent, isPartiallyCurrent: isPartiallyCurrent, href: href, location: location }));
                        anchorProps.href = href;
                        if (isCurrent) {
                            anchorProps["aria-current"] = "page";
                        }
                        var fn = anchorProps.onClick;
                        anchorProps.onClick = function (event) {
                            if (fn) {
                                fn(event);
                            }
                            if (shouldNavigate(event)) {
                                event.preventDefault();
                                navigate$$1(href, { state: state, replace: replace });
                            }
                        };
                        return React.createElement("a", anchorProps);
                    }
                );
            }
        );
    };
    function RedirectRequest(uri) {
        this.uri = uri;
    }
    var isRedirect = function isRedirect(o) {
        return o instanceof RedirectRequest;
    };
    var redirectTo = function redirectTo(to) {
        throw new RedirectRequest(to);
    };
    var RedirectImpl = miniCreateClass(function RedirectImpl() { }, Component, {
        componentDidMount: function componentDidMount() {
            var _props3 = this.props,
                navigate$$1 = _props3.navigate,
                to = _props3.to,
                from = _props3.from,
                _props3$replace = _props3.replace,
                replace = _props3$replace === undefined ? true : _props3$replace,
                state = _props3.state,
                noThrow = _props3.noThrow,
                props = _objectWithoutProperties(_props3, ["navigate", "to", "from", "replace", "state", "noThrow"]);
            navigate$$1(insertParams(to, props), { replace: replace, state: state });
        },
        render: function render() {
            var _props4 = this.props,
                navigate$$1 = _props4.navigate,
                to = _props4.to,
                from = _props4.from,
                replace = _props4.replace,
                state = _props4.state,
                noThrow = _props4.noThrow,
                props = _objectWithoutProperties(_props4, ["navigate", "to", "from", "replace", "state", "noThrow"]);
            if (!noThrow) {
                redirectTo(insertParams(to, props));
            }
            return null;
        }
    });
    var Redirect = function Redirect(props) {
        return React.createElement(
            Location,
            null,
            function (locationContext) {
                return React.createElement(RedirectImpl, _extends({}, locationContext, props));
            }
        );
    };
    Redirect.propTypes = {
        from: PropTypes.string,
        to: PropTypes.string.isRequired
    };
    var Match = function Match(_ref6) {
        var path = _ref6.path,
            children = _ref6.children;
        return React.createElement(
            BaseContext.Consumer,
            null,
            function (_ref7) {
                var baseuri = _ref7.baseuri;
                return React.createElement(
                    Location,
                    null,
                    function (_ref8) {
                        var navigate$$1 = _ref8.navigate,
                            location = _ref8.location;
                        var resolvedPath = resolve(path, baseuri);
                        var result = match(resolvedPath, location.getPath());
                        return children({
                            navigate: navigate$$1,
                            location: location,
                            match: result ? Object.assign({}, result.params, {
                                uri: result.uri,
                                path: path
                            }) : null
                        });
                    }
                );
            }
        );
    };
    var stripSlashes = function stripSlashes(str) {
        return str.replace(/(^\/+|\/+$)/g, "");
    };
    var createRoute = function createRoute(basepath) {
        return function (element) {
            invariant(element.props.path || element.props.default || element.type === Redirect, "<Router>: Children of <Router> must have a \"path\" or \"default\" prop, or be a \"<Redirect>\". \n         None found on element type \"" + element.type + "\"");
            invariant(!(element.type === Redirect && (!element.props.from || !element.props.to)), "<Redirect from=\"" + element.props.from + " to=\"" + element.props.to + "\"/> requires both \"from\" and \"to\" props when inside a <Router>.");
            invariant(!(element.type === Redirect && !validateRedirect(element.props.from, element.props.to)), "<Redirect from=\"" + element.props.from + " to=\"" + element.props.to + "\"/> has mismatched dynamic segments, ensure both paths have the exact same dynamic segments.");
            if (element.props.default) {
                return { value: element, default: true };
            }
            var elementPath = element.type === Redirect ? element.props.from : element.props.path;
            var path = elementPath === "/" ? basepath : stripSlashes(basepath) + "/" + stripSlashes(elementPath);
            return {
                value: element,
                default: element.props.default,
                path: element.props.children ? stripSlashes(path) + "/*" : path
            };
        };
    };
    function shouldNavigate(event) {
        return !event.button && !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
    var ReachRouter = {
        version: "1.5.3",
        Link: Link,
        Location: Location,
        LocationProvider: LocationProvider,
        Match: Match,
        Redirect: Redirect,
        Router: Router,
        ServerLocation: ServerLocation,
        createHistory: createHistory,
        createMemorySource: createMemorySource,
        isRedirect: isRedirect,
        navigate: navigate,
        redirectTo: redirectTo
    };

    return ReachRouter;

})));

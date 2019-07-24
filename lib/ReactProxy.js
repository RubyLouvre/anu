/**
 * by 司徒正美 Copyright 2018-05-15
 * IE9+
 */

(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === "function" && define.amd ? define(factory) :
            (global.ReactProxy = factory());
}(this, (function () {

    var x = {};
    var y = { supports: true };
    try {
        x.__proto__ = y;
    } catch (err) { }
    function supportsProtoAssignment() {
        return x.supports || false;
    }

    function assign(a, b) {
        for (var i in b) {
            a[i] = b[i];
        }
        return a;
    }
    var difference = function difference(array, rest) {
        return array.filter(function (value) {
            return rest.indexOf(value) == -1;
        });
    };
    function createPrototypeProxy() {
        var proxy = {};
        var current = null;
        var mountedInstances = [];
        function proxyToString(name) {
            return function toString() {
                if (typeof current[name] === "function") {
                    return current[name].toString();
                } else {
                    return "<method was deleted>";
                }
            };
        }
        function proxyMethod(name) {
            var proxiedMethod = function proxiedMethod() {
                if (typeof current[name] === "function") {
                    return current[name].apply(this, arguments);
                }
            };
            assign(proxiedMethod, current[name]);
            proxiedMethod.toString = proxyToString(name);
            try {
                Object.defineProperty(proxiedMethod, "name", {
                    value: name
                });
            } catch (err) { }
            return proxiedMethod;
        }
        function proxiedComponentDidMount() {
            mountedInstances.push(this);
            if (typeof current.componentDidMount === "function") {
                return current.componentDidMount.apply(this, arguments);
            }
        }
        proxiedComponentDidMount.toString = proxyToString("componentDidMount");
        function proxiedComponentWillUnmount() {
            var index = mountedInstances.indexOf(this);
            if (index !== -1) {
                mountedInstances.splice(index, 1);
            }
            if (typeof current.componentWillUnmount === "function") {
                return current.componentWillUnmount.apply(this, arguments);
            }
        }
        proxiedComponentWillUnmount.toString = proxyToString("componentWillUnmount");
        function defineProxyProperty(name, descriptor) {
            Object.defineProperty(proxy, name, descriptor);
        }
        function defineProxyPropertyWithValue(name, value) {
            var _ref = Object.getOwnPropertyDescriptor(current, name) || {},
                _ref$enumerable = _ref.enumerable,
                enumerable = _ref$enumerable === undefined ? false : _ref$enumerable,
                _ref$writable = _ref.writable,
                writable = _ref$writable === undefined ? true : _ref$writable;
            defineProxyProperty(name, {
                configurable: true,
                enumerable: enumerable,
                writable: writable,
                value: value
            });
        }
        function createAutoBindMap() {
            if (!current.__reactAutoBindMap) {
                return;
            }
            var __reactAutoBindMap = {};
            for (var name in current.__reactAutoBindMap) {
                if (typeof proxy[name] === "function" && current.__reactAutoBindMap.hasOwnProperty(name)) {
                    __reactAutoBindMap[name] = proxy[name];
                }
            }
            return __reactAutoBindMap;
        }
        function createAutoBindPairs() {
            var __reactAutoBindPairs = [];
            for (var i = 0; i < current.__reactAutoBindPairs.length; i += 2) {
                var name = current.__reactAutoBindPairs[i];
                var method = proxy[name];
                if (typeof method === "function") {
                    __reactAutoBindPairs.push(name, method);
                }
            }
            return __reactAutoBindPairs;
        }
        function update(next) {
            current = next;
            var currentNames = Object.getOwnPropertyNames(current);
            var previousName = Object.getOwnPropertyNames(proxy);
            var removedNames = difference(previousName, currentNames);
            removedNames.forEach(function (name) {
                delete proxy[name];
            });
            currentNames.forEach(function (name) {
                var descriptor = Object.getOwnPropertyDescriptor(current, name);
                if (typeof descriptor.value === "function") {
                    defineProxyPropertyWithValue(name, proxyMethod(name));
                } else {
                    defineProxyProperty(name, descriptor);
                }
            });
            defineProxyPropertyWithValue("componentDidMount", proxiedComponentDidMount);
            defineProxyPropertyWithValue("componentWillUnmount", proxiedComponentWillUnmount);
            if (current.hasOwnProperty("__reactAutoBindMap")) {
                defineProxyPropertyWithValue("__reactAutoBindMap", createAutoBindMap());
            }
            if (current.hasOwnProperty("__reactAutoBindPairs")) {
                defineProxyPropertyWithValue("__reactAutoBindPairs", createAutoBindPairs());
            }
            proxy.__proto__ = next;
            return mountedInstances;
        }
        function get() {
            return proxy;
        }
        return {
            update: update,
            get: get
        };
    }

    function bindAutoBindMethod(component, method) {
        var boundMethod = method.bind(component);
        boundMethod.__reactBoundContext = component;
        boundMethod.__reactBoundMethod = method;
        boundMethod.__reactBoundArguments = null;
        var componentName = component.constructor.displayName,
            _bind = boundMethod.bind;
        boundMethod.bind = function (newThis) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (newThis !== component && newThis !== null) {
                console.warn("bind(): React component methods may only be bound to the " + "component instance. See " + componentName);
            } else if (!args.length) {
                console.warn("bind(): You are binding a component method to the component. " + "React does this for you automatically in a high-performance " + "way, so you can safely remove this call. See " + componentName);
                return boundMethod;
            }
            var reboundMethod = _bind.apply(boundMethod, arguments);
            reboundMethod.__reactBoundContext = component;
            reboundMethod.__reactBoundMethod = method;
            reboundMethod.__reactBoundArguments = args;
            return reboundMethod;
        };
        return boundMethod;
    }
    function bindAutoBindMethodsFromMap(component) {
        for (var autoBindKey in component.__reactAutoBindMap) {
            if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
                return;
            }
            if (component.hasOwnProperty(autoBindKey) && component[autoBindKey].__reactBoundContext === component) {
                continue;
            }
            var method = component.__reactAutoBindMap[autoBindKey];
            component[autoBindKey] = bindAutoBindMethod(component, method);
        }
    }
    function bindAutoBindMethods(component) {
        if (component.__reactAutoBindPairs) {
            bindAutoBindMethodsFromArray(component);
        } else if (component.__reactAutoBindMap) {
            bindAutoBindMethodsFromMap(component);
        }
    }
    function bindAutoBindMethodsFromArray(component) {
        var pairs = component.__reactAutoBindPairs;
        if (!pairs) {
            return;
        }
        for (var i = 0; i < pairs.length; i += 2) {
            var autoBindKey = pairs[i];
            if (component.hasOwnProperty(autoBindKey) && component[autoBindKey].__reactBoundContext === component) {
                continue;
            }
            var method = pairs[i + 1];
            component[autoBindKey] = bindAutoBindMethod(component, method);
        }
    }

    function shouldDeleteClassicInstanceMethod(component, name) {
        if (component.__reactAutoBindMap && component.__reactAutoBindMap.hasOwnProperty(name)) {
            return false;
        }
        if (component.__reactAutoBindPairs && component.__reactAutoBindPairs.indexOf(name) >= 0) {
            return false;
        }
        if (component[name].__reactBoundArguments !== null) {
            return false;
        }
        return true;
    }
    function shouldDeleteModernInstanceMethod(component, name) {
        var prototype = component.constructor.prototype;
        var prototypeDescriptor = Object.getOwnPropertyDescriptor(prototype, name);
        if (!prototypeDescriptor || !prototypeDescriptor.get) {
            return false;
        }
        if (prototypeDescriptor.get().length !== component[name].length) {
            return false;
        }
        return true;
    }
    function shouldDeleteInstanceMethod(component, name) {
        var descriptor = Object.getOwnPropertyDescriptor(component, name);
        if (typeof descriptor.value !== "function") {
            return;
        }
        if (component.__reactAutoBindMap || component.__reactAutoBindPairs) {
            return shouldDeleteClassicInstanceMethod(component, name);
        } else {
            return shouldDeleteModernInstanceMethod(component, name);
        }
    }
    function deleteUnknownAutoBindMethods(component) {
        var names = Object.getOwnPropertyNames(component);
        names.forEach(function (name) {
            if (shouldDeleteInstanceMethod(component, name)) {
                delete component[name];
            }
        });
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = []; var _n = true; var _d = false; var _e = undefined; try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value); if (i && _arr.length === i) {
                        break;
                    } 
                } 
            } catch (err) {
                _d = true; _e = err; 
            } finally {
                try {
                    if (!_n && _i["return"]) {
                        _i["return"]();
                    } 
                } finally {
                    if (_d) {
                        throw _e;
                    } 
                } 
            } return _arr; 
        } return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr; 
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i); 
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance"); 
            } 
        }; 
    }();
    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i]; 
            } return arr2; 
        } else {
            return Array.from(arr); 
        } 
    }
    function find(array, fn) {
        for (var i = 0, n = array.length; i < n; i++) {
            if (fn(array[i], i)) {
                return array[i];
            }
        }
    }
    var RESERVED_STATICS = ["length", "displayName", "name", "arguments", "caller", "prototype", "toString"];
    function isEqualDescriptor(a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        for (var key in a) {
            if (a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    function getDisplayName(Component) {
        var displayName = Component.displayName || Component.name;
        return displayName && displayName !== "ReactComponent" ? displayName : "Unknown";
    }
    var allProxies = [];
    function findProxy(Component) {
        var pair = find(allProxies, function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                key = _ref2[0];
            return key === Component;
        });
        return pair ? pair[1] : null;
    }
    function addProxy(Component, proxy) {
        allProxies.push([Component, proxy]);
    }
    function proxyClass(InitialComponent) {
        var existingProxy = findProxy(InitialComponent);
        if (existingProxy) {
            return existingProxy;
        }
        var CurrentComponent = void 0;
        var ProxyComponent = void 0;
        var savedDescriptors = {};
        function instantiate(factory, context, params) {
            var component = factory();
            try {
                return component.apply(context, params);
            } catch (err) {
                var instance = new (Function.prototype.bind.apply(component, [null].concat(_toConsumableArray(params))))();
                Object.keys(instance).forEach(function (key) {
                    if (RESERVED_STATICS.indexOf(key) > -1) {
                        return;
                    }
                    context[key] = instance[key];
                });
            }
        }
        var displayName = getDisplayName(InitialComponent);
        try {
            ProxyComponent = new Function("factory", "instantiate", "return function " + displayName + "() {\n         return instantiate(factory, this, arguments);\n      }")(function () {
                return CurrentComponent;
            }, instantiate);
        } catch (err) {
            ProxyComponent = function ProxyComponent() {
                return instantiate(function () {
                    return CurrentComponent;
                }, this, arguments);
            };
        }
        try {
            Object.defineProperty(ProxyComponent, "name", {
                value: displayName
            });
        } catch (err) { /*skip*/}
        ProxyComponent.toString = function toString() {
            return CurrentComponent.toString();
        };
        var prototypeProxy = void 0;
        if (InitialComponent.prototype && InitialComponent.prototype.isReactComponent) {
            prototypeProxy = createPrototypeProxy();
            ProxyComponent.prototype = prototypeProxy.get();
        }
        function update(NextComponent) {
            if (typeof NextComponent !== "function") {
                throw new Error("Expected a constructor.");
            }
            if (NextComponent === CurrentComponent) {
                return;
            }
            var existingProxy = findProxy(NextComponent);
            if (existingProxy) {
                return update(existingProxy.__getCurrent());
            }
            var PreviousComponent = CurrentComponent;
            CurrentComponent = NextComponent;
            displayName = getDisplayName(NextComponent);
            ProxyComponent.displayName = displayName;
            try {
                Object.defineProperty(ProxyComponent, "name", {
                    value: displayName
                });
            } catch (err) { /*skip*/ }
            ProxyComponent.__proto__ = NextComponent.__proto__;
            if (PreviousComponent) {
                Object.getOwnPropertyNames(PreviousComponent).forEach(function (key) {
                    if (RESERVED_STATICS.indexOf(key) > -1) {
                        return;
                    }
                    var prevDescriptor = Object.getOwnPropertyDescriptor(PreviousComponent, key);
                    var savedDescriptor = savedDescriptors[key];
                    if (!isEqualDescriptor(prevDescriptor, savedDescriptor)) {
                        try {
                            Object.defineProperty(NextComponent, key, prevDescriptor);
                        } catch (err) { }
                    }
                });
            }
            Object.getOwnPropertyNames(NextComponent).forEach(function (key) {
                if (RESERVED_STATICS.indexOf(key) > -1) {
                    return;
                }
                var prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(PreviousComponent, key);
                var savedDescriptor = savedDescriptors[key];
                if (prevDescriptor && savedDescriptor && !isEqualDescriptor(savedDescriptor, prevDescriptor)) {
                    try {
                        Object.defineProperty(NextComponent, key, prevDescriptor);
                        Object.defineProperty(ProxyComponent, key, prevDescriptor);
                    } catch (err) { }
                    return;
                }
                if (prevDescriptor && !savedDescriptor) {
                    Object.defineProperty(ProxyComponent, key, prevDescriptor);
                    return;
                }
                var nextDescriptor = Object.assign({}, Object.getOwnPropertyDescriptor(NextComponent, key), {
                    configurable: true
                });
                savedDescriptors[key] = nextDescriptor;
                Object.defineProperty(ProxyComponent, key, nextDescriptor);
            });
            Object.getOwnPropertyNames(ProxyComponent).forEach(function (key) {
                if (RESERVED_STATICS.indexOf(key) > -1) {
                    return;
                }
                if (NextComponent.hasOwnProperty(key)) {
                    return;
                }
                var proxyDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
                if (proxyDescriptor && !proxyDescriptor.configurable) {
                    return;
                }
                var prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(PreviousComponent, key);
                var savedDescriptor = savedDescriptors[key];
                if (prevDescriptor && savedDescriptor && !isEqualDescriptor(savedDescriptor, prevDescriptor)) {
                    return;
                }
                delete ProxyComponent[key];
            });
            if (prototypeProxy) {
                var mountedInstances = prototypeProxy.update(NextComponent.prototype);
                ProxyComponent.prototype.constructor = NextComponent;
                mountedInstances.forEach(bindAutoBindMethods);
                mountedInstances.forEach(deleteUnknownAutoBindMethods);
            }
        }
        function get() {
            return ProxyComponent;
        }
        function getCurrent() {
            return CurrentComponent;
        }
        update(InitialComponent);
        var proxy = { get: get, update: update };
        addProxy(ProxyComponent, proxy);
        Object.defineProperty(proxy, "__getCurrent", {
            configurable: false,
            writable: false,
            enumerable: false,
            value: getCurrent
        });
        return proxy;
    }
    function createFallback(Component) {
        var CurrentComponent = Component;
        return {
            get: function get() {
                return CurrentComponent;
            },
            update: function update(NextComponent) {
                CurrentComponent = NextComponent;
            }
        };
    }
    function createClassProxy$1(Component) {
        return Component.__proto__ && supportsProtoAssignment() ? proxyClass(Component) : createFallback(Component);
    }

    if (!supportsProtoAssignment()) {
        console.warn("This JavaScript environment does not support __proto__. " + "This means that react-proxy is unable to proxy React components. " + "Features that rely on react-proxy, such as react-transform-hmr, " + "will not function as expected.");
    }

    return createClassProxy$1;

})));

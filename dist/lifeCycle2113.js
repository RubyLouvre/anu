/*! shaketv 2016-04-12 21:12:20 */
var React = window.qreact
var ReactDOM = window.qreact;
! function(e) {
    function t(r) { if (n[r]) return n[r].exports; var o = n[r] = { exports: {}, id: r, loaded: !1 }; return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports }
    var n = {};
    return t.m = e, t.c = n, t.p = "//wximg.gtimg.com/shake_tv/yao/201604011422/", t(0)
}({
    0: function(e, t, n) {
        "use strict";
        var r = n(123)["default"],
            o = n(122)["default"],
            i = n(121)["default"],
            a = n(120)["default"],
            u = function(e) {
                function t(e) {
                    a(this, t),
                        o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, e),
                        console.log("LifeCycle Initial render"),
                        console.log("constructor"),
                        this.state = { str: "hello" }
                }
                return r(t, e), i(t, [{ key: "componentWillMount", value: function() { console.log("componentWillMount") } }, { key: "componentDidMount", value: function() { console.log("componentDidMount") } }, { key: "componentWillReceiveProps", value: function(e) { console.log("componentWillReceiveProps") } }, { key: "shouldComponentUpdate", value: function() { return console.log("shouldComponentUpdate"), !0 } }, { key: "componentWillUpdate", value: function() { console.log("componentWillUpdate") } }, { key: "componentDidUpdate", value: function() { console.log("componentDidUpdate") } }, { key: "componentWillUnmount", value: function() { console.log("componentWillUnmount") } }, {
                    key: "setTheState",
                    value: function() {
                        var e = "hello";
                        this.state.str === e && (e = "HELLO"), this.setState({ str: e })
                    }
                }, { key: "forceItUpdate", value: function() { this.forceUpdate() } }, { key: "render", value: function() { return console.log("render"), React.createElement("div", null, React.createElement("span", null, "Props:", React.createElement("h2", null, parseInt(this.props.num))), React.createElement("br", null), React.createElement("span", null, "State:", React.createElement("h2", null, this.state.str))) } }]), t
            }(React.Component),
            s = function(e) {
                function t(e) {
                    a(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, e),
                        console.log("Container Initial render")

                    this.state = { num: 100 * Math.random() }
                }
                return r(t, e), i(t, [{ key: "propsChange", value: function() { this.setState({ num: 100 * Math.random() }) } }, { key: "setLifeCycleState", value: function() { this.refs.rLifeCycle.setTheState() } }, { key: "forceLifeCycleUpdate", value: function() { this.refs.rLifeCycle.forceItUpdate() } }, { key: "unmountLifeCycle", value: function() { React.unmountComponentAtNode(document.getElementById("container")) } }, { key: "parentForceUpdate", value: function() { this.forceUpdate() } }, { key: "render", value: function() { return React.createElement("div", null, React.createElement("a", { href: "javascript:;", className: "weui_btn weui_btn_primary", onClick: this.propsChange.bind(this) }, "propsChange"), React.createElement("a", { href: "javascript:;", className: "weui_btn weui_btn_primary", onClick: this.setLifeCycleState.bind(this) }, "setState"), React.createElement("a", { href: "javascript:;", className: "weui_btn weui_btn_primary", onClick: this.forceLifeCycleUpdate.bind(this) }, "forceUpdate"), React.createElement("a", { href: "javascript:;", className: "weui_btn weui_btn_primary", onClick: this.unmountLifeCycle.bind(this) }, "unmount"), React.createElement("a", { href: "javascript:;", className: "weui_btn weui_btn_primary", onClick: this.parentForceUpdate.bind(this) }, "parentForceUpdateWithoutChange"), React.createElement(u, { ref: "rLifeCycle", num: this.state.num })) } }]), t
            }(React.Component);
        var ReactRender = window.ReactDOM || window.React

        ReactRender.render(React.createElement(s, null), document.getElementById("container"))
    },
    10: function(e, t, n) {
        "use strict";

        function r(e) { return isNaN(e = +e) ? 0 : (e > 0 ? v : h)(e) }

        function o(e, t) { return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t } }

        function i(e, t, n) { return e[t] = n, e }

        function a(e) { return y ? function(t, n, r) { return x.setDesc(t, n, o(e, r)) } : i }

        function u(e) { return null !== e && ("object" == typeof e || "function" == typeof e) }

        function s(e) { return "function" == typeof e }

        function l(e) { if (void 0 == e) throw TypeError("Can't call method on  " + e); return e }
        var c = "undefined" != typeof self ? self : Function("return this")(),
            p = {},
            f = Object.defineProperty,
            d = {}.hasOwnProperty,
            h = Math.ceil,
            v = Math.floor,
            m = Math.max,
            g = Math.min,
            y = !! function() { try { return 2 == f({}, "a", { get: function() { return 2 } }).a } catch (e) {} }(),
            b = a(1),
            x = e.exports = n(42)({ g: c, core: p, html: c.document && document.documentElement, isObject: u, isFunction: s, that: function() { return this }, toInteger: r, toLength: function(e) { return e > 0 ? g(r(e), 9007199254740991) : 0 }, toIndex: function(e, t) { return e = r(e), 0 > e ? m(e + t, 0) : g(e, t) }, has: function(e, t) { return d.call(e, t) }, create: Object.create, getProto: Object.getPrototypeOf, DESC: y, desc: o, getDesc: Object.getOwnPropertyDescriptor, setDesc: f, setDescs: Object.defineProperties, getKeys: Object.keys, getNames: Object.getOwnPropertyNames, getSymbols: Object.getOwnPropertySymbols, assertDefined: l, ES5Object: Object, toObject: function(e) { return x.ES5Object(l(e)) }, hide: b, def: a(0), set: c.Symbol ? i : b, each: [].forEach });
        "undefined" != typeof __e && (__e = p), "undefined" != typeof __g && (__g = c)
    },
    41: function(e, t, n) {
        function r(e, t) { return function() { return e.apply(t, arguments) } }

        function o(e, t, n) {
            var i, l, c, p, f = e & o.G,
                d = e & o.P,
                h = f ? a : e & o.S ? a[t] : (a[t] || {}).prototype,
                v = f ? u : u[t] || (u[t] = {});
            f && (n = t);
            for (i in n) l = !(e & o.F) && h && i in h, l && i in v || (c = l ? h[i] : n[i], f && !s(h[i]) ? p = n[i] : e & o.B && l ? p = r(c, a) : e & o.W && h[i] == c ? ! function(e) { p = function(t) { return this instanceof e ? new e(t) : e(t) }, p.prototype = e.prototype }(c) : p = d && s(c) ? r(Function.call, c) : c, v[i] = p, d && ((v.prototype || (v.prototype = {}))[i] = c))
        }
        var i = n(10),
            a = i.g,
            u = i.core,
            s = i.isFunction;
        o.F = 1, o.G = 2, o.S = 4, o.P = 8, o.B = 16, o.W = 32, e.exports = o
    },
    42: function(e, t) { e.exports = function(e) { return e.FW = !1, e.path = e.core, e } },
    117: function(e, t, n) { e.exports = { "default": n(125), __esModule: !0 } },
    118: function(e, t, n) { e.exports = { "default": n(126), __esModule: !0 } },
    119: function(e, t, n) { e.exports = { "default": n(127), __esModule: !0 } },
    120: function(e, t) {
        "use strict";
        t["default"] = function(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }, t.__esModule = !0
    },
    121: function(e, t, n) {
        "use strict";
        var r = n(118)["default"];
        t["default"] = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var o = t[n];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), r(e, o.key, o)
                }
            }
            return function(t, n, r) { return n && e(t.prototype, n), r && e(t, r), t }
        }(), t.__esModule = !0
    },
    122: function(e, t, n) {
        "use strict";
        var r = n(119)["default"];
        t["default"] = function(e, t, n) {
            for (var o = !0; o;) {
                var i = e,
                    a = t,
                    u = n;
                s = c = l = void 0, o = !1, null === i && (i = Function.prototype);
                var s = r(i, a);
                if (void 0 !== s) { if ("value" in s) return s.value; var l = s.get; return void 0 === l ? void 0 : l.call(u) }
                var c = Object.getPrototypeOf(i);
                if (null === c) return void 0;
                e = c, t = a, n = u, o = !0
            }
        }, t.__esModule = !0
    },
    123: function(e, t, n) {
        "use strict";
        var r = n(117)["default"];
        t["default"] = function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = r(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (e.__proto__ = t)
        }, t.__esModule = !0
    },
    125: function(e, t, n) {
        var r = n(10);
        e.exports = function(e, t) { return r.create(e, t) }
    },
    126: function(e, t, n) {
        var r = n(10);
        e.exports = function(e, t, n) { return r.setDesc(e, t, n) }
    },
    127: function(e, t, n) {
        var r = n(10);
        n(131), e.exports = function(e, t) { return r.getDesc(e, t) }
    },
    130: function(e, t, n) {
        function r(e) { try { return a(e) } catch (t) { return u.slice() } }
        var o = n(10),
            i = {}.toString,
            a = o.getNames,
            u = "object" == typeof window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
        e.exports.get = function(e) { return u && "[object Window]" == i.call(e) ? r(e) : a(o.toObject(e)) }
    },
    131: function(e, t, n) {
        var r = n(10),
            o = n(41),
            i = r.isObject,
            a = r.toObject;
        r.each.call("freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames".split(","), function(e, t) {
            var u = (r.core.Object || {})[e] || Object[e],
                s = 0,
                l = {};
            l[e] = 0 == t ? function(e) { return i(e) ? u(e) : e } : 1 == t ? function(e) { return i(e) ? u(e) : e } : 2 == t ? function(e) { return i(e) ? u(e) : e } : 3 == t ? function(e) { return i(e) ? u(e) : !0 } : 4 == t ? function(e) { return i(e) ? u(e) : !0 } : 5 == t ? function(e) { return i(e) ? u(e) : !1 } : 6 == t ? function(e, t) { return u(a(e), t) } : 7 == t ? function(e) { return u(Object(r.assertDefined(e))) } : 8 == t ? function(e) { return u(a(e)) } : n(130).get;
            try { u("z") } catch (c) { s = 1 }
            o(o.S + o.F * s, "Object", l)
        })
    }
});
//# sourceMappingURL=lifeCycle.js.map
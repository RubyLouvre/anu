(function(global, factory) {
  //https://github.com/jquery/jquery/blob/master/src/wrapper.js
  if (typeof define === "function" && define.amd) {
    define(["react"], function(React) {
      global.createClass = factory(global, React);
    });
  } else if (typeof exports !== "undefined") {
    var React = require("react");
    factory(global, React);
  } else {
    global.createClass = factory(global, global.React || global.ReactDOM);
  }
})(typeof window !== "undefined" ? window : this, function(window, React) {
  var Component = React.Component;
  // https://github.com/developit/preact-compat/blob/master/src/index.js
  function F() {}

  function createClass(obj) {
    function cl(props, context) {
      bindAll(this);
      Component.call(this, props, context);
    }

    obj = Object.assign({ constructor: cl }, obj);

    // We need to apply mixins here so that getDefaultProps is correctly mixed
    if (obj.mixins) {
      applyMixins(obj, collateMixins(obj.mixins));
    }
    if (obj.statics) {
      Object.assign(cl, obj.statics);
    }
    if (obj.propTypes) {
      cl.propTypes = obj.propTypes;
    }
    if (obj.defaultProps) {
      cl.defaultProps = obj.defaultProps;
    }
    if (obj.getDefaultProps) {
      cl.defaultProps = obj.getDefaultProps();
    }

    F.prototype = Component.prototype;
    cl.prototype = Object.assign(new F(), obj);

    cl.displayName = obj.displayName || "Component";

    return cl;
  }

  // Flatten an Array of mixins to a map of method name to mixin implementations
  function collateMixins(mixins) {
    var keyed = {};
    for (var i = 0; i < mixins.length; i++) {
      var mixin = mixins[i];
      for (var key in mixin) {
        if (mixin.hasOwnProperty(key) && typeof mixin[key] === "function") {
          (keyed[key] || (keyed[key] = [])).push(mixin[key]);
        }
      }
    }
    return keyed;
  }

  // apply a mapping of Arrays of mixin methods to a component prototype
  function applyMixins(proto, mixins) {
    for (var key in mixins)
      if (mixins.hasOwnProperty(key)) {
        proto[key] = multihook(
          mixins[key].concat(proto[key] || []),
          key === "getDefaultProps" ||
            key === "getInitialState" ||
            key === "getChildContext"
        );
      }
  }
  var AUTOBIND_BLACKLIST = {
    constructor: 1,
    render: 1,
    shouldComponentUpdate: 1,
    componentWillReceiveProps: 1,
    componentWillUpdate: 1,
    componentDidUpdate: 1,
    componentWillMount: 1,
    componentDidMount: 1,
    componentWillUnmount: 1,
    componentDidUnmount: 1
  };
  function multihook(hooks, skipDuplicates) {
    return function() {
      var ret;
      for (var i = 0; i < hooks.length; i++) {
        var r = callMethod(this, hooks[i], arguments);

        if (skipDuplicates && r != null) {
          if (!ret) ret = {};
          for (var key in r)
            if (r.hasOwnProperty(key)) {
              ret[key] = r[key];
            }
        } else if (typeof r !== "undefined") ret = r;
      }
      return ret;
    };
  }
  function bindAll(ctx) {
    for (var i in ctx) {
      var v = ctx[i];
      if (
        typeof v === "function" &&
        !v.__bound &&
        !AUTOBIND_BLACKLIST.hasOwnProperty(i)
      ) {
        (ctx[i] = v.bind(ctx)).__bound = true;
      }
    }
  }

  function callMethod(ctx, m, args) {
    if (typeof m === "string") {
      m = ctx.constructor.prototype[m];
    }
    if (typeof m === "function") {
      return m.apply(ctx, args);
    }
  }

  return createClass;
});

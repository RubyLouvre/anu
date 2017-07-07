import { extend, isFn, inherit, noop } from "./util";
import { Component } from "./Component";
/**
 * 为了兼容0.13之前的版本
 */
var MANY = "DEFINE_MANY";
var MANY_MERGED = "MANY_MERGED";
var ReactClassInterface = {
  mixins: MANY,
  statics: MANY,
  propTypes: MANY,
  contextTypes: MANY,
  childContextTypes: MANY,
  getDefaultProps: MANY_MERGED,
  getInitialState: MANY_MERGED,
  getChildContext: MANY_MERGED,
  render: "ONCE",
  componentWillMount: MANY,
  componentDidMount: MANY,
  componentWillReceiveProps: MANY,
  shouldComponentUpdate: "DEFINE_ONCE",
  componentWillUpdate: MANY,
  componentDidUpdate: MANY,
  componentWillUnmount: MANY
};

var specHandle = {
  displayName(Ctor, value, name) {
    Ctor[name] = value;
  },
  mixins(Ctor, value) {
    if (value) {
      for (var i = 0; i < value.length; i++) {
        mixSpecIntoComponent(Ctor, value[i]);
      }
    }
  },
  propTypes: mergeObject,
  childContextTypes: mergeObject,
  contextTypes: mergeObject,

  getDefaultProps(Ctor, value) {
    if (Ctor.getDefaultProps) {
      Ctor.getDefaultProps = createMergedResultFunction(
        Ctor.getDefaultProps,
        value
      );
    } else {
      Ctor.getDefaultProps = value;
    }
  },

  statics(Ctor, value) {
    extend(Ctor, Object(value));
  },
  autobind: noop
};

function mergeObject(fn, value, name) {
  fn[name] = Object.assign({}, fn[name], value);
}

//防止覆盖Component内部一些重要的方法或属性
var protectedProps = {
  mixin: 1,
  setState: 1,
  forceUpdate: 1,
  _processPendingState: 1,
  _pendingCallbacks: 1,
  _pendingStates: 1
};

function mixSpecIntoComponent(Ctor, spec) {
  if (!spec) {
    return;
  }
  if (isFn(spec)) {
    console.warn("createClass(spec)中的spec不能为函数，只能是纯对象");
  }

  var proto = Ctor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  if (spec.hasOwnProperty("mixin")) {
    specHandle.mixins(Ctor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }
    if (protectedProps[name] === 1) {
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);

    if (specHandle.hasOwnProperty(name)) {
      specHandle[name](Ctor, property, name);
    } else {
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var shouldAutoBind =
        isFn(property) &&
        !isReactClassMethod &&
        !isAlreadyDefined &&
        spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];
          //合并多个同名函数
          if (specPolicy === MANY_MERGED) {
            //这个是有返回值
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === MANY) {
            //这个没有返回值
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
        }
      }
    }
  }
}

function mergeIntoWithNoDuplicateKeys(one, two) {
  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      one[key] = two[key];
    }
  }
  return one;
}

function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  return boundMethod;
}

function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

//创建一个构造器
function newCtor(className) {
  var curry = Function(
    "ReactComponent",
    "bindAutoBindMethods",
    `return function ${className}(props, context) {
    ReactComponent.call(this, props, context);
    this.state = this.getInitialState ? this.getInitialState() : {};
    if (this.__reactAutoBindPairs.length) {
      bindAutoBindMethods(this);
    }
  };`
  );
  return curry(Component, bindAutoBindMethods);
}
var warnOnce = 1;
export function createClass(spec) {
  if (warnOnce) {
    warnOnce = 0;
    console.warn("createClass已经过时，强烈建议使用es6方式定义类");
  }
  var Constructor = newCtor(spec.displayName || "Component");
  var proto = inherit(Constructor, Component);
  proto.__reactAutoBindPairs = [];
  delete proto.render;

  mixSpecIntoComponent(Constructor, spec);
  if (isFn(Constructor.getDefaultProps)) {
    Constructor.defaultProps = Constructor.getDefaultProps();
  }

  //性能优化， 为了防止在原型链进行无用的查找，直接将用户没有定义的生命周期钩子置为bull
  for (var methodName in ReactClassInterface) {
    if (!proto[methodName]) {
      proto[methodName] = null;
    }
  }

  return Constructor;
}

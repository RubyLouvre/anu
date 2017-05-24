var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { decorate } from './private/utils';

// Exported for mocking in tests
export var defaultConsole = {
  profile: console.profile ? console.profile.bind(console) : function () {},
  profileEnd: console.profileEnd ? console.profileEnd.bind(console) : function () {},
  warn: console.warn.bind(console)
};

function handleDescriptor(target, key, descriptor, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      _ref2$ = _ref2[0],
      prefix = _ref2$ === undefined ? null : _ref2$,
      _ref2$2 = _ref2[1],
      once = _ref2$2 === undefined ? false : _ref2$2,
      _ref2$3 = _ref2[2],
      console = _ref2$3 === undefined ? defaultConsole : _ref2$3;

  if (!profile.__enabled) {
    if (!profile.__warned) {
      console.warn('Console.profile is not supported. All @profile decorators are disabled.');
      profile.__warned = true;
    }
    return descriptor;
  }

  var fn = descriptor.value;

  if (prefix === null) {
    prefix = target.constructor.name + '.' + key;
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError('@profile can only be used on functions, not: ' + fn);
  }

  var ran = false;

  return _extends({}, descriptor, {
    value: function value() {
      var label = '' + prefix;
      if (!once || once && !ran) {
        console.profile(label);
        ran = true;
      }

      try {
        return fn.apply(this, arguments);
      } finally {
        console.profileEnd(label);
      }
    }
  });
}

export default function profile() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return decorate(handleDescriptor, args);
}

// Only Chrome, Firefox, and Edge support profile.
// Exposing properties for testing.
profile.__enabled = !!console.profile;
profile.__warned = false;
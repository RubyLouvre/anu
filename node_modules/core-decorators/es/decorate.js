function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

import { decorate as _decorate, createDefaultSetter } from './private/utils';
var defineProperty = Object.defineProperty;


function handleDescriptor(target, key, descriptor, _ref) {
  var _ref2 = _toArray(_ref),
      decorator = _ref2[0],
      args = _ref2.slice(1);

  var configurable = descriptor.configurable,
      enumerable = descriptor.enumerable,
      writable = descriptor.writable;

  var originalGet = descriptor.get;
  var originalSet = descriptor.set;
  var originalValue = descriptor.value;
  var isGetter = !!originalGet;

  return {
    configurable: configurable,
    enumerable: enumerable,
    get: function get() {
      var fn = isGetter ? originalGet.call(this) : originalValue;
      var value = decorator.call.apply(decorator, [this, fn].concat(_toConsumableArray(args)));

      if (isGetter) {
        return value;
      } else {
        var desc = {
          configurable: configurable,
          enumerable: enumerable
        };

        desc.value = value;
        desc.writable = writable;

        defineProperty(this, key, desc);

        return value;
      }
    },

    set: isGetter ? originalSet : createDefaultSetter()
  };
}

export default function decorate() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _decorate(handleDescriptor, args);
}
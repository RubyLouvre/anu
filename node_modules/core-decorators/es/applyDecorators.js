var defineProperty = Object.defineProperty,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;


export default function applyDecorators(Class, props) {
  var prototype = Class.prototype;


  for (var key in props) {
    var decorators = props[key];

    for (var i = 0, l = decorators.length; i < l; i++) {
      var decorator = decorators[i];

      defineProperty(prototype, key, decorator(prototype, key, getOwnPropertyDescriptor(prototype, key)));
    }
  }

  return Class;
}
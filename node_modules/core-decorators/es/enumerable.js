import { decorate } from './private/utils';

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = true;
  return descriptor;
}

export default function enumerable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return decorate(handleDescriptor, args);
}
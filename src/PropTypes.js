//为了兼容yo
var check = function() {
  return check;
};
check.isRequired = check;
export var PropTypes = {
  array: check,
  bool: check,
  func: check,
  number: check,
  object: check,
  string: check,
  any: check,
  arrayOf: check,
  element: check,
  instanceOf: check,
  node: check,
  objectOf: check,
  oneOf: check,
  oneOfType: check,
  shape: check
};

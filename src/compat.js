export const Children = {
  only(children) {
    return (children && children[0]) || null;
  },
  count(children) {
    return (children && children.length) || 0;
  },
  forEach(children, callback, context) {
    children.forEach(callback, context);
  },
  map(children, callback, context) {
    return children.map(callback, context);
  }
};

import {
  groupEnd,
  groupCollapsed,
  log as colorizedLog,
  trace
} from '@shared/utils/colorizedConsole';

export default function log(debug) {
  return function(target, name, descriptor) {
    const fn = descriptor.value;

    if (debug) {
      descriptor.value = function(...args) {
        groupCollapsed([`${this.displayName || this.name}#${name}`]);
        colorizedLog(['method', `${name}`]);
        colorizedLog(['arguments', ...args]);
        trace(['stack']);
        groupEnd([`${target.name}#${name}`]);
        return fn.apply(this, args);
      };
    }

    return descriptor;
  };
}

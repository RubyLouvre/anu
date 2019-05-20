/* eslint no-console: 0 */
import * as R from 'ramda';

const colorizedConsole = R.curryN(3, function(
  method,
  style,
  [tag, ...logs] = []
) {
  console[method].call(console, `%c${tag}`, style, ...logs);
});

const styles = {
  groupCollapsed: 'color: #0277BD; font-size: bold',
  log: 'font-weight: bold; font-style: italic; color: #009688;',
  warn: 'font-weight: bold; font-style: italic; color: #F57F17;'
};

const groupCollapsed = colorizedConsole(
  'groupCollapsed',
  styles.groupCollapsed
);

const log = colorizedConsole('log', styles.log);

const groupEnd = colorizedConsole('groupEnd', null);

const trace = colorizedConsole('trace', styles.log);

const warn = colorizedConsole('warn', styles.warn);

export { groupCollapsed, log, groupEnd, trace, warn };

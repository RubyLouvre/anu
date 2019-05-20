import { test, not, compose } from 'ramda';
import { warn } from '@shared/utils/colorizedConsole';

const regex = /^#(f{3}|f{6}|0{3}|0{6})$/i;
const invalid = compose(
  not,
  test(regex)
);

export default function(color) {
  if (invalid(color)) {
    warn([
      'warning',
      `navigationBarColor.frontColor only accepts #fff or #000, ${color} received`
    ]);
    return false;
  }
  return true;
}

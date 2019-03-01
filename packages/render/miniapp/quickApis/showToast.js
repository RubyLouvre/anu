import { noop } from 'react-core/util';
import { runFunction } from '../utils';
export function showToast(obj) {
  var prompt = require('@system.prompt');
  obj.message = obj.title;
  obj.duration = obj.duration / 1000;
  let success = obj.success || noop,
    fail = obj.fail || noop,
    complete = obj.complete || noop;

  try {
    prompt.showToast(obj);
    runFunction(success);
  } catch (error) {
    runFunction(fail, error);
  } finally {
    runFunction(complete);
  }
}

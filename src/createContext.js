
import {REACT_PROVIDER_TYPE, REACT_CONTEXT_TYPE} from "./util";
export function createContext( defaultValue, calculateChangedBit) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  }

 var ReactContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    calculateChangedBits,
    defaultValue,
    currentValue: defaultValue,
    changedBits: 0
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    context,
  };
  context.Consumer = context;
  return context;
}

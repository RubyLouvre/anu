import {
    Rematch as RematchCore
} from './rematch';
import {
    isListener,
    mergeConfig
} from './utils';

// allows for global dispatch to multiple stores
const stores = {};
const dispatches = {};

/**
 * global Dispatch
 *
 * calls store.dispatch in all stores
 * @param action
 */
export function dispatch(action) {
    for (let name in stores) {
        if (stores.hasOwnProperty(name)) {
            stores[name].dispatch(action);
        }
    }
}

/**
 * global getState
 *
 * loads state from all stores
 * returns an object with key: storeName, value: store.getState()
 */
export function getState() {
    const state = {};
    for (let name in stores) {
        if (stores.hasOwnProperty(name)) {
            state[name] = stores[name].getState();
        }
    }
    return state;
}



/**
 * global createModel
 *
 * creates a model for the given object
 * this is for autocomplete purposes only
 * returns the same object that was received as argument
 */
function createModel(model) {
    return model;
}

/**
 * init
 *
 * generates a Rematch store
 * with a set configuration
 * @param config
 */
export function init(initConfig = {}) {
    if (initConfig === void 0) { initConfig = {}; }
    let name = initConfig.name || Object.keys(stores).length.toString();
    let config = mergeConfig(Object.assign({}, initConfig, { name: name }));
    let store = new RematchCore(config).init();
    stores[name] = store;
    for (let modelName in store.dispatch){
        if (!dispatch[modelName]) {
            dispatch[modelName] = {};
        }
        for (let actionName in store.dispatch[modelName]) {
            if (!isListener(actionName)) {
                const action = store.dispatch[modelName][actionName];
                if (!dispatches[modelName]) {
                    dispatches[modelName] = {};
                }
                let curAction = dispatches[modelName][actionName] || (dispatches[modelName][actionName] = {})
                curAction[name] = action;
                dispatch[modelName][actionName] = (payload, meta) => {
                    for (const storeName in curAction) {
                        stores[storeName].dispatch[modelName][actionName](payload, meta);
                    }
                };
            }
        }
    }
    return store;
}

export let Rematch = {
    dispatch,
    getState,
    init,
};
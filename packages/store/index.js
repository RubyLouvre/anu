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
function dispatch(action) {
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
function getState() {
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
function init(initConfig = {}) {
    const name = initConfig.name || Object.keys(stores).length.toString();
    const config = mergeConfig({ ...initConfig,
        name
    });
    const store = new RematchCore(config).init();
    stores[name] = store;
    for (const modelName of Object.keys(store.dispatch)) {
        if (!dispatch[modelName]) {
            dispatch[modelName] = {};
        }
        for (const actionName of Object.keys(store.dispatch[modelName])) {
            if (!isListener(actionName)) {
                const action = store.dispatch[modelName][actionName];
                if (!dispatches[modelName]) {
                    dispatches[modelName] = {};
                }
                if (!dispatches[modelName][actionName]) {
                    dispatches[modelName][actionName] = {};
                }
                dispatches[modelName][actionName][name] = action;
                dispatch[modelName][actionName] = (payload, meta) => {
                    for (const storeName of Object.keys(dispatches[modelName][actionName])) {
                        stores[storeName].dispatch[modelName][actionName](payload, meta);
                    }
                };
            }
        }
    }
    return store;
}

export {
    dispatch,
    getState,
    init,
};
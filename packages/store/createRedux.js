import * as Redux from 'redux';
import {
    isListener,
    isFn
} from './utils';


let composeEnhancersWithDevtools = function(devtoolOptions) {
    if (devtoolOptions === void 666) {
        devtoolOptions = {};
    }
    /* istanbul ignore next */
    return typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions) :
        Redux.compose;
};
export function createRedux(ref) {
    let _this = this;
    let redux = ref.redux,
        models = ref.models;
    let combineReducers = redux.combineReducers || Redux.combineReducers;
    let createStore = redux.createStore || Redux.createStore;
    let initialState = typeof redux.initialState !== 'undefined' ? redux.initialState : {};
    this.reducers = redux.reducers;
    // combine models to generate reducers
    this.mergeReducers = function(nextReducers) {
        if (nextReducers === void 0) {
            nextReducers = {};
        }
        // merge new reducers with existing reducers
        _this.reducers = Object.assign({}, _this.reducers, nextReducers);
        if (isEmptyObject(_this.reducers)) {
            // no reducers, just return state
            return function(state) {
                return state;
            };
        }
        return combineReducers(_this.reducers);
    };
    this.createModelReducer = function(model) {
        let modelReducers = {};
        let reducers = model.reducers;
        for (let modelReducer in reducers) {
            if (reducers.hasOwnProperty(modelReducer)) {
                let action = isListener(modelReducer) ?
                    modelReducer :
                    model.name + '/' + modelReducer;
                modelReducers[action] = model.reducers[modelReducer];
            }
        }
        _this.reducers[model.name] = function(state, action) {
            if (state === void 0) {
                state = model.state;
            }
            // handle effects
            if (isFn(modelReducers[action.type])) {
                return modelReducers[action.type](state, action.payload, action.meta);
            }
            return state;
        };
    };
    // initialize model reducers
    models.forEach(function(model) {
        _this.createModelReducer(model);
    });
    this.createRootReducer = function(rootReducers) {
        if (rootReducers === void 0) {
            rootReducers = {};
        }
        let mergedReducers = _this.mergeReducers();
        if (isEmptyObject(rootReducers)) {
            return function(state, action) {
                let rootReducerAction = rootReducers[action.type];
                if (rootReducers[action.type]) {
                    return mergedReducers(rootReducerAction(state, action), action);
                }
                return mergedReducers(state, action);
            };
        }
        return mergedReducers;
    };
    let rootReducer = this.createRootReducer(redux.rootReducers);
    let middlewares = Redux.applyMiddleware.apply(Redux, redux.middlewares);
    let enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(void 0, redux.enhancers.concat([middlewares]));
    this.store = createStore(rootReducer, initialState, enhancers);
    return this;
}

function isEmptyObject(obj) {
    for (let k in obj) {
        return false;
    }
    return true;
}
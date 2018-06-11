import * as Redux from 'redux';
import {isListener} from './utils';


var composeEnhancersWithDevtools = function (devtoolOptions) {
    if (devtoolOptions === void 0) {
        devtoolOptions = {}; 
    }
    /* istanbul ignore next */
    return typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
        : Redux.compose;
};
export function createRedux (_a) {
    var _this = this;
    var redux = _a.redux, models = _a.models;
    var combineReducers = redux.combineReducers || Redux.combineReducers;
    var createStore = redux.createStore || Redux.createStore;
    var initialState = typeof redux.initialState !== 'undefined' ? redux.initialState : {};
    this.reducers = redux.reducers;
    // combine models to generate reducers
    this.mergeReducers = function (nextReducers) {
        if (nextReducers === void 0) {
            nextReducers = {}; 
        }
        // merge new reducers with existing reducers
        _this.reducers = Object.assign({}, _this.reducers, nextReducers);
        if (isEmptyObject(_this.reducers)) {
            // no reducers, just return state
            return function (state) {
                return state; 
            };
        }
        return combineReducers(_this.reducers);
    };
    this.createModelReducer = function (model) {
        var modelReducers = {};
        var reducers = model.reducers;
        for(let modelReducer in reducers){
            if(reducers.hasOwnProperty(modelReducer)){
                var action = isListener(modelReducer)
                    ? modelReducer
                    : model.name + '/' + modelReducer;
                modelReducers[action] = model.reducers[modelReducer];
            }
        }
        _this.reducers[model.name] = function (state, action) {
            if (state === void 0) {
                state = model.state; 
            }
            // handle effects
            if (typeof modelReducers[action.type] === 'function') {
                return modelReducers[action.type](state, action.payload, action.meta);
            }
            return state;
        };
    };
    // initialize model reducers
    for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
        var model = models_1[_i];
        this.createModelReducer(model);
    }
    this.createRootReducer = function (rootReducers) {
        if (rootReducers === void 0) {
            rootReducers = {}; 
        }
        var mergedReducers = _this.mergeReducers();
        if (Object.keys(rootReducers).length) {
            return function (state, action) {
                var rootReducerAction = rootReducers[action.type];
                if (rootReducers[action.type]) {
                    return mergedReducers(rootReducerAction(state, action), action);
                }
                return mergedReducers(state, action);
            };
        }
        return mergedReducers;
    };
    var rootReducer = this.createRootReducer(redux.rootReducers);
    var middlewares = Redux.applyMiddleware.apply(Redux, redux.middlewares);
    var enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(void 0, redux.enhancers.concat([middlewares]));
    this.store = createStore(rootReducer, initialState, enhancers);
    return this;
}

function isEmptyObject(obj){
    for(var k in obj){
        return false;
    }
    return true;
}
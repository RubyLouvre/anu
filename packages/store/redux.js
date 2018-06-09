import * as Redux from 'redux'
import isListener from './utils/isListener'

function composeEnhancersWithDevtools(devtoolOptions = {}) {
    /* istanbul ignore next */
    return (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions) :
        Redux.compose;
}

export default ({
    redux,
    models
}) => {
    const combineReducers = redux.combineReducers || Redux.combineReducers;
    const createStore = redux.createStore || Redux.createStore;
    const initialState = typeof redux.initialState !== 'undefined' ? redux.initialState : {}

    this.reducers = redux.reducers;

    // combine models to generate reducers
    this.mergeReducers = (nextReducers = {}) => {
        // merge new reducers with existing reducers
        this.reducers = Object.assign({},this.reducers,nextReducers)
        if (!isEmptyObject(this.reducers)) {
            // no reducers, just return state
            return (state) => state;
        }
        return combineReducers(this.reducers)
    }

    this.createModelReducer = (model) => {
        const modelReducers = {}
        for (const modelReducer of Object.keys(model.reducers || {})) {
            const action = isListener(modelReducer) ? modelReducer : `${model.name}/${modelReducer}`
            modelReducers[action] = model.reducers[modelReducer]
        }
        this.reducers[model.name] = (state, action) => {
            // handle effects
            if (typeof modelReducers[action.type] === 'function') {
                return modelReducers[action.type](state, action.payload, action.meta)
            }
            return state;
        }
    }
    // initialize model reducers
    for (const model of models) {
        this.createModelReducer(model);
    }

    this.createRootReducer = (rootReducers = {}) => {
        const mergedReducers = this.mergeReducers()
        if (Object.keys(rootReducers).length) {
            return (state, action) => {
                const rootReducerAction = rootReducers[action.type];
                if (rootReducers[action.type]) {
                    return mergedReducers(rootReducerAction(state, action), action)
                }
                return mergedReducers(state, action);
            }
        }
        return mergedReducers;
    }

    const rootReducer = this.createRootReducer(redux.rootReducers);

    const middlewares = Redux.applyMiddleware(...redux.middlewares);
    const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(...redux.enhancers, middlewares)

    this.store = createStore(rootReducer, initialState, enhancers);

    return this;
}

function isEmptyObject(obj){
    for(var i in obj){
        return false;
    }
    return true;
}
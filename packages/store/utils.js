/**
 * validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
export let validate = function(validations) {
    if (process.env.NODE_ENV !== 'production') {
        validations.forEach(function(validation) {
            let condition = validation[0];
            let errorMessage = validation[1];
            if (condition) {
                throw new Error(errorMessage);
            }
        })
    }
};


export function isListener(reducer) {
    return reducer.indexOf('/') !== -1;
}
const tos = Object.prototype.toString;
export function isFn(a){
   return tos.call(a) === "[object Function]"
}

export function isNotFn(obj){
   return obj && !isFn(obj)
}

function merge(original, next) {
    original = original || {}
    return next ? Object.assign({}, next, original) : original;
};
let isNotObject = function(obj) {
    return Array.isArray(obj) || typeof obj !== "object" 
};
/**
 * mergeConfig
 *
 * merge init configs together
 */
export let mergeConfig = function(initConfig) {
    let config = Object.assign({
        name: initConfig.name,
        models: {},
        plugins: []
    }, initConfig, {
        redux: Object.assign({
                reducers: {},
                rootReducers: {},
                enhancers: [],
                middlewares: []
            },
            initConfig.redux, {
                devtoolOptions: Object.assign({
                        name: initConfig.name
                    },
                    (initConfig.redux && initConfig.redux.devtoolOptions ? initConfig.redux.devtoolOptions : {}))
            })
    });
    if (process.env.NODE_ENV !== 'production') {
        validate([
            [!Array.isArray(config.plugins),
                'init config.plugins must be an array',
            ],
            [isNotObject(config.models),
                'init config.models must be an object',
            ],
            [isNotObject(config.redux.reducers),
                'init config.redux.reducers must be an object',
            ],
            [!Array.isArray(config.redux.middlewares),
                'init config.redux.middlewares must be an array',
            ],
            [!Array.isArray(config.redux.enhancers),
                'init config.redux.enhancers must be an array of functions',
            ],
            [
                isNotFn(config.redux.combineReducers),
                'init config.redux.combineReducers must be a function',
            ],
            [
                isNotFn(config.redux.createStore),
                'init config.redux.createStore must be a function',
            ],
        ]);
    }
    // defaults

    config.plugins.forEach(function(plugin) {
        if (plugin.config) {
            // models
            config.models =
                merge(config.models, plugin.config.models); // FIXME: not sure how to avoid this
            // plugins
            config.plugins = config.plugins.concat((plugin.config.plugins || []));
            // redux
            let pluginRedux = config.plugin.redux
            if (pluginRedux) {
                let configRedux = config.redux;
                configRedux.initialState = merge(config.redux.initialState, pluginRedux.initialState);
                configRedux.reducers = merge(config.redux.reducers, pluginRedux.reducers);
                configRedux.rootReducers = merge(config.redux.rootReducers, pluginRedux.reducers);
                configRedux.enhancers = configRedux.enhancers.concat((pluginRedux.enhancers || []));
                configRedux.middlewares = configRedux.middlewares.concat((pluginRedux.middlewares || []));
                configRedux.combineReducers = configRedux.combineReducers || pluginRedux.combineReducers;
                configRedux.createStore = configRedux.createStore || pluginRedux.createStore;
            }
        }
    })
    return config;
};
/**
 * validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
var merge = function (original, next) {
    return (next) ? __assign({}, next, (original || {})) : original || {};
};
var isObject = function (obj) {
 return (Array.isArray(obj) || typeof obj !== 'object'); 
};
/**
 * mergeConfig
 *
 * merge init configs together
 */
var mergeConfig = (function (initConfig) {
    var config = __assign({ name: initConfig.name, models: {}, plugins: [] }, initConfig, { redux: __assign({ reducers: {}, rootReducers: {}, enhancers: [], middlewares: [] }, initConfig.redux, { devtoolOptions: __assign({ name: initConfig.name }, (initConfig.redux && initConfig.redux.devtoolOptions ? initConfig.redux.devtoolOptions : {})) }) });
    if (undefined !== 'production') {
        validate([
            [
                !Array.isArray(config.plugins),
                'init config.plugins must be an array',
            ],
            [
                isObject(config.models),
                'init config.models must be an object',
            ],
            [
                isObject(config.redux.reducers),
                'init config.redux.reducers must be an object',
            ],
            [
                !Array.isArray(config.redux.middlewares),
                'init config.redux.middlewares must be an array',
            ],
            [
                !Array.isArray(config.redux.enhancers),
                'init config.redux.enhancers must be an array of functions',
            ],
            [
                config.redux.combineReducers && typeof config.redux.combineReducers !== 'function',
                'init config.redux.combineReducers must be a function',
            ],
            [
                config.redux.createStore && typeof config.redux.createStore !== 'function',
                'init config.redux.createStore must be a function',
            ],
        ]);
    }
    // defaults
    for (var _i = 0, _a = config.plugins; _i < _a.length; _i++) {
        var plugin = _a[_i];
        if (plugin.config) {
            // models
            config.models =
                merge(config.models, plugin.config.models); // FIXME: not sure how to avoid this
            // plugins
            config.plugins = config.plugins.concat((plugin.config.plugins || []));
            // redux
            if (plugin.config.redux) {
                config.redux.initialState = merge(config.redux.initialState, plugin.config.redux.initialState);
                config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers);
                config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers);
                config.redux.enhancers = config.redux.enhancers.concat((plugin.config.redux.enhancers || []));
                config.redux.middlewares = config.redux.middlewares.concat((plugin.config.redux.middlewares || []));
                config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers;
                config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore;
            }
        }
    }
    return config;
});
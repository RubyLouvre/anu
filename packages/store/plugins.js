import {
    isFn
} from "./utils"

function __awaiter(thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator['throw'](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function(resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = {
            label: 0,
            sent: function() {
                if (t[0] & 1) {
                    throw t[1];
                }
                return t[1];
            },
            trys: [],
            ops: []
        },
        f, y, t, g;
    return g = {
        next: verb(0),
        'throw': verb(1),
        'return': verb(2)
    }, typeof Symbol === 'function' && (g[Symbol.iterator] = function() {
        return this;
    }), g;

    function verb(n) {
        return function(v) {
            return step([n, v]);
        };
    }

    function step(op) {
        if (f) {
            throw new TypeError('Generator is already executing.');
        }
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) {
                    return t;
                }
                if (y = 0, t) {
                    op = [op[0] & 2, t.value];
                }
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2]) {
                            _.ops.pop();
                        }
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];
                y = 0;
            } finally {
                f = t = 0;
            }
        }
        if (op[0] & 5) {
            throw op[1];
        }
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}

/**
 * Dispatch Plugin
 *
 * generates dispatch[modelName][actionName]
 */


export var dispatchPlugin = {
    exposed: {
        // required as a placeholder for store.dispatch
        storeDispatch(action, state) {
            console.warn('Warning: store not yet loaded');
        },
        storeGetState() {
            console.warn('Warning: store not yet loaded');
        },
        /**
         * dispatch
         *
         * both a function (dispatch) and an object (dispatch[modelName][actionName])
         * @param action R.Action
         */
        dispatch(action) {
            return this.storeDispatch(action);
        },
        /**
         * createDispatcher
         *
         * genereates an action creator for a given model & reducer
         * @param modelName string
         * @param reducerName string
         */
        createDispatcher(modelName, reducerName) {
            var _this = this;
            return function(payload, meta) {
                return __awaiter(_this, void 0, void 0, function() {
                    var action;
                    return __generator(this, function(_a) {
                        action = {
                            type: modelName + '/' + reducerName
                        };
                        if (typeof payload !== 'undefined') {
                            action.payload = payload;
                        }
                        if (typeof meta !== 'undefined') {
                            action.meta = meta;
                        }
                        if (this.dispatch[modelName][reducerName].isEffect) {
                            // ensure that effect state is captured on dispatch
                            // to avoid possible mutations and warnings
                            return [2 /*return*/ , this.dispatch(action)];
                        }
                        return [2 /*return*/ , this.dispatch(action)];
                    });
                });
            };
        },
    },
    // access store.dispatch after store is created
    onStoreCreated(store) {
        this.storeDispatch = store.dispatch;
        this.storeGetState = store.getState;
    },
    // generate action creators for all model.reducers
    onModel(model) {
        let modelName = model.name;
        let reducers = model.reducers;
        this.dispatch[modelName] = {};

        if (!reducers) {
            return;
        }
        for (let reducerName in reducers) {
            if (reducers.hasOwnProperty(reducerName)) {
                this.validate([
                    [!!reducerName.match(/\/.+\//),
                        'Invalid reducer name (' + modelName + '/' + reducerName + ')'
                    ],
                    [!isFn(reducers[reducerName]),
                        'Invalid reducer (' + modelName + '/' + reducerName + '). Must be a function',
                    ],
                ]);
                this.dispatch[modelName][reducerName] = this.createDispatcher.apply(this, [modelName, reducerName]);

            }
        }
    },
};

/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
export var effectsPlugin = {
    exposed: {
        // expose effects for access from dispatch plugin
        effects: {},
    },
    // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
    onModel: function(model) {
        if (!model.effects) {
            return;
        }
        var effects = isFn(model.effects) ?
            model.effects(this.dispatch) :
            model.effects;
        let modelName = model.name;
        for (let effectName in effects) {
            if (effects.hasOwnProperty(effectName)) {

                this.validate([
                    [!!effectName.match(/\//),
                        'Invalid effect name (' + modelName + '/' + effectName + ')',
                    ],
                    [!isFn(effects[effectName]),
                        'Invalid effect (' + modelName + '/' + effectName + '). Must be a function',
                    ],
                ]);
                this.effects[modelName + '/' + effectName] = effects[effectName].bind(this.dispatch[modelName]);
                // add effect to dispatch
                // is assuming dispatch is available already... that the dispatch plugin is in there
                var effect = this.dispatch[modelName][effectName] = this.createDispatcher.apply(this, [modelName, effectName]);
                // tag effects so they can be differentiated from normal actions
                effect.isEffect = true;
            }
        }
    },
    // process async/await actions
    middleware: function(store) {
        var _this = this;
        return function(next) {
            return function(action) {
                return __awaiter(_this, void 0, void 0, function() {
                    return __generator(this, function(_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(action.type in this.effects)) {
                                    return [3 /*break*/ , 2];
                                }
                                return [4 /*yield*/ , next(action)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/ , this.effects[action.type](action.payload, store.getState(), action.meta)];
                            case 2:
                                return [2 /*return*/ , next(action)];
                        }
                    });
                });
            };
        };
    },
};
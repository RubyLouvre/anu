/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
export const effectsPlugin = {

    exposed: {
        // expose effects for access from dispatch plugin
        effects: {},
    },

    // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
    onModel(model) {
        if (!model.effects) {
            return
        }
        for (let effectName in model.effects){
            this.validate([
                [!!effectName.match(/\//),
                    `Invalid effect name (${model.name}/${effectName})`,
                ],
                [
                    typeof model.effects[effectName] !== 'function',
                    `Invalid effect (${model.name}/${effectName}). Must be a function`,
                ],
            ])
            this.effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(this.dispatch[model.name])
            // add effect to dispatch
            // is assuming dispatch is available already... that the dispatch plugin is in there
            this.dispatch[model.name][effectName] = this.createDispatcher.apply(this, [model.name, effectName])
            // tag effects so they can be differentiated from normal actions
            this.dispatch[model.name][effectName].isEffect = true
        }
    },

    // process async/await actions
    middleware(store) {
        return (next) => async (action, state) => {
            // async/await acts as promise middleware
            if (action.type in this.effects) {
                await next(action)
                return this.effects[action.type](action.payload, state, action.meta)
            } else {
                return next(action)
            }
        }
    },
}


/**
 * Dispatch Plugin
 *
 * generates dispatch[modelName][actionName]
 */
export const dispatchPlugin = {
    exposed: {
        // required as a placeholder for store.dispatch
        storeDispatch(action) {
            console.warn('Warning: store not yet loaded')
        },

        storeGetState() {
            console.warn('Warning: store not yet loaded')
        },

        /**
         * dispatch
         *
         * both a function (dispatch) and an object (dispatch[modelName][actionName])
         * @param action R.Action
         */
        dispatch(action, state) {
            console.log("========",action, state)
            return this.storeDispatch(action, state)
        },

        /**
         * createDispatcher
         *
         * genereates an action creator for a given model & reducer
         * @param modelName string
         * @param reducerName string
         */
        createDispatcher(modelName, reducerName) {
            return async (payload, meta) => {
                const action = {
                    type: `${modelName}/${reducerName}`
                }
                if (typeof payload !== 'undefined') {
                    action.payload = payload
                }
                if (typeof meta !== 'undefined') {
                    action.meta = meta
                }
                if (this.dispatch[modelName][reducerName].isEffect) {
                    // ensure that effect state is captured on dispatch
                    // to avoid possible mutations and warnings
                    return this.dispatch(action, this.storeGetState())
                }
                return this.dispatch(action)
            }
        },
    },

    // access store.dispatch after store is created
    onStoreCreated(store) {
        this.storeDispatch = store.dispatch
        this.storeGetState = store.getState
    },

    // generate action creators for all model.reducers
    onModel(model) {
        this.dispatch[model.name] = {}
        if (!model.reducers) {
            return
        }
        for (let reducerName in model.reducers) {
            this.validate([
                [!!reducerName.match(/\/.+\//),
                    `Invalid reducer name (${model.name}/${reducerName})`,
                ],
                [
                    typeof model.reducers[reducerName] !== 'function',
                    `Invalid reducer (${model.name}/${reducerName}). Must be a function`,
                ],
            ])
            this.dispatch[model.name][reducerName] = this.createDispatcher.apply(this, [model.name, reducerName])
        }
    },
}
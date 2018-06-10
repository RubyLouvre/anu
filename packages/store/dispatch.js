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
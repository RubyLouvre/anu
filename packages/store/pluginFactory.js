import {
    validate,
    isFn,
    isNotFn
} from './utils';

/**
 * PluginFactory
 *
 * makes Plugin objects extend and inherit from a root PluginFactory
 */
export function pluginFactory(config) {
    return {
        config,
        /**
         * validate
         *
         * bind validate to the store for easy access
         */
        validate,

        /**
         * create plugin
         *
         * binds plugin properties and functions to an instance of PluginFactorys
         * @param plugin
         */
        create(plugin) {
            validate([
                [isNotFn(plugin.onStoreCreated),
                    'Plugin onStoreCreated must be a function',
                ],
                [isNotFn(plugin.onModel),
                    'Plugin onModel must be a function',
                ],
                [isNotFn(plugin.middleware),
                    'Plugin middleware must be a function',
                ],
            ]);

            if (plugin.onInit) {
                plugin.onInit.call(this);
            }

            const result = {};

            if (plugin.exposed) {
                Object.keys(plugin.exposed).forEach(function(key) {
                    this[key] =
                        isFn(plugin.exposed[key]) ?
                        plugin.exposed[key].bind(this) // bind functions to plugin class
                        :
                        Object.create(plugin.exposed[key]); // add exposed to plugin class
                }, this);
            }
            Array('onModel', 'middleware', 'onStoreCreated').forEach(function(method) {
                if (plugin[method]) {
                    result[method] = plugin[method].bind(this);
                }
            }, this);
            return result;
        },
    };
}
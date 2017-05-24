'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = localStorage;
/**
 *
 * Protocol bindings for all localStorage operations. This command is not part of the official Webdriver
 * specification and might not be supported for your browser.
 *
 * <example>
    :localStorage.js
    it('should set/receive values from local storage', function () {
        // get the storage item for the given key
        var values = browser.localStorage('GET', someKey);

        // get all key/value pairs of the storage
        var storage = browser.localStorage();

        // set the storage item for the given key
        browser.localStorage('POST', {key: someKey, value: someValue});

        // remove the storage item for the given key
        browser.localStorage('DELETE', 'someKey');

        // clear the storage
        browser.localStorage('DELETE');
    });
 * </example>
 *
 * @param {String}         method  method for storage operation
 * @param {Object|String=} args    operation arguments
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlocal_storage
 * @type protocol
 *
 */

function localStorage() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
    var args = arguments[1];

    /**
     * set default options
     */
    var data = {};
    var requestOptions = {
        path: '/session/:sessionId/local_storage',
        method: method.toUpperCase()
    };

    if (requestOptions.method === 'POST' && typeof args === 'object') {
        data = {
            key: args.key,
            value: args.value
        };
    }

    /**
     * add/delete specific key
     */
    if (requestOptions.method === 'DELETE' && typeof args === 'string' || requestOptions.method === 'GET' && typeof args === 'string') {
        requestOptions.path += '/key/' + args;
    }

    return this.requestHandler.create(requestOptions, data);
}
module.exports = exports['default'];
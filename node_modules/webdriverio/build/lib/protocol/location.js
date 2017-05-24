'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = location;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function location(l) {
    var location = null;

    if (typeof l === 'object' && l.latitude !== undefined && l.longitude !== undefined && l.altitude !== undefined) {
        location = l;
    }

    (0, _depcrecationWarning2.default)('location');

    /**
     * get geo location
     */
    if (!location) {
        return this.requestHandler.create('/session/:sessionId/location');
    }

    /**
     * set geo location
     * @type {[type]}
     */
    return this.requestHandler.create('/session/:sessionId/location', { location: location });
} /**
   *
   * Protocol bindings for all geolocation operations. (Not part of the official Webdriver specification).
   *
   * <example>
      :location.js
      it('should set geo location for device', function () {
          // set the current geo location
          client.location({latitude: 121.21, longitude: 11.56, altitude: 94.23})
  
          // get the current geo location
          client.location().then(function(res) { ... });
      });
   * </example>
   *
   * @param {Object} location  the new location
   * @return {Object}         the current geo location
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlocation
   * @type protocol
   *
   */

module.exports = exports['default'];
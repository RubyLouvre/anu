'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getNetworkConnection;

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getNetworkConnection() {
    return this.requestHandler.create({
        path: '/session/:sessionId/network_connection',
        method: 'GET'
    }).then(function (result) {
        result = (0, _deepmerge2.default)(result, {
            value: result.value,
            inAirplaneMode: result.value === 1,
            hasWifi: result.value === 2 || result.value === 6,
            hasData: result.value === 4 || result.value === 6
        });

        return result;
    });
} /**
   *
   * Get informations about the current network connection (Data/WIFI/Airplane). The actual
   * server value will be a number (see `getNetworkConnection.js` example). However WebdriverIO
   * additional properties to the response object to allow easier assertions (see
   * `getNetworkConnectionEasier.js` example).
   *
   * <example>
      :getNetworkConnection.js
      it('should get network connection of Android device', function () {
          var connection = browser.getNetworkConnection();
          console.log(connection.value); // returns 6
          console.log(connection.inAirplaneMode); // returns false
          console.log(connection.hasWifi); // returns true
          console.log(connection.hasData); // returns true
      });
   * </example>
   *
   * @type mobile
   * @see https://github.com/appium/appium-android-driver/blob/master/lib/commands/network.js#L8-L22
   * @for android
   *
   */

module.exports = exports['default'];
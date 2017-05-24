'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = gridProxyDetails;

var _ErrorHandler = require('../utils/ErrorHandler');

function gridProxyDetails(proxyId) {
    /*!
     * parameter check
     */
    if (typeof proxyId !== 'string') {
        throw new _ErrorHandler.ProtocolError('The gridProxyDetails command needs a proxyId to work with.');
    }

    return this.requestHandler.create({
        path: '/proxy?id=' + proxyId,
        method: 'GET',
        requiresSession: false,
        gridCommand: true
    });
} /**
   *
   * Get the details of the Selenium Grid node running a session
   *
   * <example>
      :grid.js
      it('should get grid proxy details', function () {
          var details = browser.gridProxyDetails(proxyId)
          console.log(details);
          // {
          //     success: true,
          //     msg: "proxy found !",
          //     id: "MacMiniA10",
          //     request: {
          //         ...
          //         configuration: {
          //             ...
          //         },
          //         capabilities: [
          //             {
          //                 ...
          //             }
          //         ]
          //     }
          // }
      });
   * </example>
   *
   * @type grid
   */

module.exports = exports['default'];
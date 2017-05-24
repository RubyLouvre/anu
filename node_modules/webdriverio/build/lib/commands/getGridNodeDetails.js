'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Get the details of the Selenium Grid node running a session
 *
 * <example>
    :grid.js
    it('should return grid information', function () {
        console.log(browser.getGridNodeDetails())
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
    })
 * </example>
 *
 * @alias browser.getGridNodeDetails
 * @uses grid/gridTestSession, grid/gridProxyDetails
 * @type grid
 */

var getGridNodeDetails = function getGridNodeDetails() {
    var _this = this;

    return this.gridTestSession().then(function (session) {
        return _this.gridProxyDetails(session.proxyId).then(function (details) {
            delete session.msg;
            delete session.success;

            delete details.msg;
            delete details.success;
            delete details.id;

            return (0, _assign2.default)(details, session);
        });
    }).catch(function (e) {
        if (e.seleniumStack && e.seleniumStack.type === 'GridApiError') {
            return {
                error: e.message
            };
        }
    });
};

exports.default = getGridNodeDetails;
module.exports = exports['default'];
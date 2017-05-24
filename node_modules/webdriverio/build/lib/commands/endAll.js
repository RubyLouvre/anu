'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * End all selenium server sessions at once. Like the [`end`](/api/utility/end.html) command is this command
 * only supported in standalone mode.
 *
 * @alias browser.endAll
 * @uses protocol/sessions, protocol/session
 * @type utility
 *
 */

var endAll = function endAll() {
    var _this = this;

    return this.sessions().then(function (res) {
        var sessionCommands = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var session = _step.value;

                sessionCommands.push(_this.session('delete', session.id));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _this.unify(sessionCommands);
    });
};

exports.default = endAll;
module.exports = exports['default'];
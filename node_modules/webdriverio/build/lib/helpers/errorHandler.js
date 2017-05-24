'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [
/**
 * stale reference error handler
 */
function (e) {
    if (!e.seleniumStack || e.seleniumStack.type !== 'StaleElementReference') {
        return;
    }

    /**
     * get through command list and find most recent command where an element(s)
     * command contained the failing json web element
     */
    var failingCommand = this.commandList.slice(-1)[0];

    var commandToRepeat = void 0;
    for (var i = this.commandList.length - 1; i >= 0; --i) {
        var command = this.commandList[i];

        if (!command.result || !command.result.value) {
            continue;
        }

        if (command.name !== 'element' && command.name !== 'elements') {
            continue;
        }

        if (command.name === 'element' && command.result.value.ELEMENT !== failingCommand.args[0]) {
            continue;
        }

        // Ensure an array when evaluating the result, so the logic is the same for 'element' and 'elements' commands
        var results = Array.isArray(command.result.value) ? command.result.value : command.result.value !== null ? [command.result.value] : [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(results), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var result = _step.value;

                if (result.ELEMENT === failingCommand.args[0]) {
                    commandToRepeat = this.commandList[i - 1];

                    /**
                     * when using elements as first citizen , e.g. div.getTagName() and rerun
                     * the command due to StaleElementReference exception we store the unshifted
                     * `null` as selector. In order to have a valid selector when rerunning it we
                     * have to put in the actual selector
                     */
                    var preSelector = this.commandList[i].result.selector;
                    if (commandToRepeat.args[0] === null && typeof preSelector === 'string') {
                        commandToRepeat.args[0] = preSelector;

                        /**
                         * clear lastResult as we inject the actual selector to parameter list
                         */
                        if (this.lastResult) {
                            delete this.lastResult.value;
                        }
                    }

                    break;
                }
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

        if (commandToRepeat) {
            break;
        }
    }

    if (!commandToRepeat) {
        return;
    }

    /**
     * reset lastPromise so we can resolve it after rerun
     */
    this.lastPromise = (0, _q2.default)();

    return this[commandToRepeat.name].apply(this, commandToRepeat.args);
}];
module.exports = exports['default'];
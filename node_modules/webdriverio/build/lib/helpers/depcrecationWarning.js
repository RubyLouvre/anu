'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = depcrecate;
function depcrecate(commandName) {
    console.warn('WARNING: the "' + commandName + '" command will be depcrecated soon. Please use a ' + 'different command in order to avoid failures in your test after updating WebdriverIO.');
}
module.exports = exports['default'];
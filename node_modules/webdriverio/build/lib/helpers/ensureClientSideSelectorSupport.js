'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WGXPATH_PATH = require.resolve('wgxpath');

var wgxpathSrc = void 0;

/**
 * Ensures document.evaluate() in the browser.
 */
var ensureClientSideSelectorSupport = function ensureClientSideSelectorSupport() {
    var _this = this;

    return this.execute('return !!document.evaluate;').then(function (res) {
        if (res.value) {
            return true;
        }

        /**
         * Don't read in unless necessary
         */
        if (!wgxpathSrc) {
            wgxpathSrc = _fs2.default.readFileSync(WGXPATH_PATH);
            wgxpathSrc = wgxpathSrc.toString().split('module.exports')[0];
        }

        return _this.execute(wgxpathSrc + '\nwgxpath.install(window);');
    });
};

exports.default = ensureClientSideSelectorSupport;
module.exports = exports['default'];
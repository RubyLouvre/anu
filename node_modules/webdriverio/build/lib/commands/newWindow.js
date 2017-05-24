'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _newWindow = require('../scripts/newWindow');

var _newWindow2 = _interopRequireDefault(_newWindow);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Open new window in browser. This command is the equivalent function to `window.open()`. This command does not
 * work in mobile environments.
 *
 * __Note:__ When calling this command you automatically switch to the new window.
 *
 * <example>
    :newWindowSync.js
    it('should open a new tab', function () {
        browser.url('http://google.com')
        console.log(browser.getTitle()); // outputs: "Google"

        browser.newWindow('http://webdriver.io', 'WebdriverIO window', 'width=420,height=230,resizable,scrollbars=yes,status=1')
        console.log(browser.getTitle()); // outputs: "WebdriverIO - WebDriver bindings for Node.js"

        browser.close()
        console.log(browser.getTitle()); // outputs: "Google"
    });
 * </example>
 *
 * @alias browser.newWindow
 * @param {String} url            website URL to open
 * @param {String} windowName     name of the new window
 * @param {String} windowFeatures features of opened window (e.g. size, position, scrollbars, etc.)
 * @uses protocol/execute, window/getTabIds, window/switchTab
 * @type window
 *
 */

var newWindow = function newWindow(url) {
    var _this = this;

    var windowName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var windowFeatures = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    /*!
     * parameter check
     */
    if (typeof url !== 'string' || typeof windowName !== 'string' || typeof windowFeatures !== 'string') {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with newWindow command');
    }

    /*!
     * mobile check
     */
    if (this.isMobile) {
        throw new _ErrorHandler.CommandError('newWindow command is not supported on mobile platforms');
    }

    return this.execute(_newWindow2.default, url, windowName, windowFeatures).getTabIds().then(function (tabs) {
        return _this.switchTab(tabs[tabs.length - 1]);
    });
};

exports.default = newWindow;
module.exports = exports['default'];
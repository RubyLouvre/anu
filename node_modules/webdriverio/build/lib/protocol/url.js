'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = url;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function url(uri) {
    var data = {};

    if (typeof uri === 'string') {
        data.url = uri;
        if (typeof this.options.baseUrl === 'string') {
            data.url = _url2.default.resolve(this.options.baseUrl, data.url);
        }
    }

    return this.requestHandler.create('/session/:sessionId/url', data);
} /**
   *
   * Protocol binding to load or get the URL of the browser.
   *
   * <example>
      :url.js
      // navigate to a new URL
      browser.url('http://webdriver.io');
      // receive url
      console.log(browser.getUrl()); // outputs: "http://webdriver.io"
   * </example>
   *
   * @param {String=} url  the URL to navigate to
   * @return {String}     the current URL
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-get
   * @type protocol
   *
   */

module.exports = exports['default'];
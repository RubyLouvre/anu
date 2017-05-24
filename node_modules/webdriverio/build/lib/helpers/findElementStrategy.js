'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var DEFAULT_SELECTOR = 'css selector';
var DIRECT_SELECTOR_REGEXP = /^(id|css selector|xpath|link text|partial link text|name|tag name|class name|-android uiautomator|-ios uiautomation|accessibility id):(.+)/;

var findStrategy = function findStrategy() {
    var value = arguments.length <= 0 ? undefined : arguments[0];
    var relative = arguments.length > 1 ? arguments.length <= 1 ? undefined : arguments[1] : false;
    var xpathPrefix = relative ? './/' : '//';

    /**
     * set default selector
     */
    var using = DEFAULT_SELECTOR;

    if (typeof value !== 'string') {
        throw new _ErrorHandler.ProtocolError('selector needs to be typeof `string`');
    }

    if (arguments.length === 3) {
        return {
            using: arguments.length <= 0 ? undefined : arguments[0],
            value: arguments.length <= 1 ? undefined : arguments[1]
        };
    }

    /**
     * check if user has specified locator strategy directly
     */
    var match = value.match(DIRECT_SELECTOR_REGEXP);
    if (match) {
        return {
            using: match[1],
            value: match[2]
        };
    }

    // check value type
    // use id strategy if value starts with # and doesnt contain any other CSS selector-relevant character
    // regex to match ids from http://stackoverflow.com/questions/18938390/regex-to-match-ids-in-a-css-file
    if (value.search(/^#-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/) > -1) {
        using = 'id';
        value = value.slice(1);

        // use xPath strategy if value starts with //
    } else if (value.indexOf('/') === 0 || value.indexOf('(') === 0 || value.indexOf('../') === 0 || value.indexOf('./') === 0 || value.indexOf('*/') === 0) {
        using = 'xpath';

        // use link text startegy if value startes with =
    } else if (value.indexOf('=') === 0) {
        using = 'link text';
        value = value.slice(1);

        // use partial link text startegy if value startes with *=
    } else if (value.indexOf('*=') === 0) {
        using = 'partial link text';
        value = value.slice(2);

        // recursive element search using the UiAutomator library (Android only)
    } else if (value.indexOf('android=') === 0) {
        using = '-android uiautomator';
        value = value.slice(8);

        // recursive element search using the UIAutomation library (iOS-only)
    } else if (value.indexOf('ios=') === 0) {
        using = '-ios uiautomation';
        value = value.slice(4);

        // recursive element search using accessibility id
    } else if (value.indexOf('~') === 0) {
        using = 'accessibility id';
        value = value.slice(1);

        // class name mobile selector
        // for iOS = UIA...
        // for Android = android.widget
    } else if (value.slice(0, 3) === 'UIA' || value.slice(0, 15) === 'XCUIElementType' || value.slice(0, 14).toLowerCase() === 'android.widget') {
        using = 'class name';

        // use tag name strategy if value contains a tag
        // e.g. "<div>" or "<div />"
    } else if (value.search(/<[a-zA-Z-]+( \/)*>/g) >= 0) {
        using = 'tag name';
        value = value.replace(/<|>|\/|\s/g, '');

        // use name strategy if value queries elements with name attributes
        // e.g. "[name='myName']" or '[name="myName"]'
    } else if (value.search(/^\[name=("|')([a-zA-z0-9\-_. ]+)("|')]$/) >= 0) {
        using = 'name';
        value = value.match(/^\[name=("|')([a-zA-z0-9\-_. ]+)("|')]$/)[2];

        // any element with given text e.g. h1=Welcome
    } else if (value.search(/^[a-z0-9]*=(.)+$/) >= 0) {
        var query = value.split(/=/);
        var tag = query.shift();

        using = 'xpath';
        value = '' + xpathPrefix + (tag.length ? tag : '*') + '[normalize-space() = "' + query.join('=') + '"]';

        // any element containing given text
    } else if (value.search(/^[a-z0-9]*\*=(.)+$/) >= 0) {
        var _query = value.split(/\*=/);
        var _tag = _query.shift();

        using = 'xpath';
        value = '' + xpathPrefix + (_tag.length ? _tag : '*') + '[contains(., "' + _query.join('*=') + '")]';

        // any element with certian class or id + given content
    } else if (value.search(/^[a-z0-9]*(\.|#)-?[_a-zA-Z]+[_a-zA-Z0-9-]*=(.)+$/) >= 0) {
        var _query2 = value.split(/=/);
        var _tag2 = _query2.shift();

        var classOrId = _tag2.substr(_tag2.search(/(\.|#)/), 1) === '#' ? 'id' : 'class';
        var classOrIdName = _tag2.slice(_tag2.search(/(\.|#)/) + 1);

        _tag2 = _tag2.substr(0, _tag2.search(/(\.|#)/));
        using = 'xpath';
        value = '' + xpathPrefix + (_tag2.length ? _tag2 : '*') + '[contains(@' + classOrId + ', "' + classOrIdName + '") and normalize-space() = "' + _query2.join('=') + '"]';

        // any element with certian class or id + has certain content
    } else if (value.search(/^[a-z0-9]*(\.|#)-?[_a-zA-Z]+[_a-zA-Z0-9-]*\*=(.)+$/) >= 0) {
        var _query3 = value.split(/\*=/);
        var _tag3 = _query3.shift();

        var _classOrId = _tag3.substr(_tag3.search(/(\.|#)/), 1) === '#' ? 'id' : 'class';
        var _classOrIdName = _tag3.slice(_tag3.search(/(\.|#)/) + 1);

        _tag3 = _tag3.substr(0, _tag3.search(/(\.|#)/));
        using = 'xpath';
        value = xpathPrefix + (_tag3.length ? _tag3 : '*') + '[contains(@' + _classOrId + ', "' + _classOrIdName + '") and contains(., "' + _query3.join('*=') + '")]';
        value = '' + xpathPrefix + (_tag3.length ? _tag3 : '*') + '[contains(@' + _classOrId + ', "' + _classOrIdName + '") and contains(., "' + _query3.join('*=') + '")]';

        // allow to move up to the parent or select current element
    } else if (value === '..' || value === '.') {
        using = 'xpath';
    }

    return {
        using: using,
        value: value
    };
};

exports.default = findStrategy;
module.exports = exports['default'];
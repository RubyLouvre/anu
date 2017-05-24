'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Uploads a file to the selenium server by using the [`file`](/api/protocol/file.html) command. Note that
 * this command might not be supported as it is an undocumented Selenium command.
 *
 * @alias browser.uploadFile
 * @param {String} localPath local path to file
 * @type utility
 * @uses protocol/file
 *
 */

var uploadFile = function uploadFile(localPath) {
    var _this = this;

    /*!
     * parameter check
     */
    if (typeof localPath !== 'string') {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with uploadFile command');
    }

    var zipData = [];
    var source = _fs2.default.createReadStream(localPath);

    return new _promise2.default(function (resolve, reject) {
        (0, _archiver2.default)('zip').on('error', function (e) {
            throw new Error(e);
        }).on('data', function (data) {
            return zipData.push(data);
        }).on('end', function () {
            return _this.file(Buffer.concat(zipData).toString('base64')).then(resolve, reject);
        }).append(source, { name: _path2.default.basename(localPath) }).finalize(function (err) {
            /* istanbul ignore next */
            if (err) {
                reject(err);
            }
        });
    });
};

exports.default = uploadFile;
module.exports = exports['default'];
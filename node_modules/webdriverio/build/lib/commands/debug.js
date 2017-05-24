'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _repl = require('repl');

var _repl2 = _interopRequireDefault(_repl);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = function debug() {
    var commandTimeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;

    var _this = this;

    var enableStdout = arguments[1];
    var enableLogging = arguments[2];

    var commandIsRunning = false;
    var logLevel = this.logger.logLevel;
    this.logger.logLevel = 'verbose';
    this.logger.debug();

    if (!enableLogging) {
        this.logger.logLevel = logLevel;
    }

    var myEval = function myEval(cmd, context, filename, callback) {
        if (commandIsRunning) {
            return;
        }

        if (cmd === 'browser\n') {
            return callback(null, '[WebdriverIO REPL client]');
        }

        commandIsRunning = true;
        var result = void 0;
        if (typeof global.wdioSync === 'function') {
            return global.wdioSync(function () {
                try {
                    result = _vm2.default.runInThisContext(cmd);
                } catch (e) {
                    commandIsRunning = false;
                    return callback(e);
                }

                callback(null, result);
                commandIsRunning = false;
            })();
        }

        context.browser = _this;
        try {
            result = _vm2.default.runInThisContext(cmd);
        } catch (e) {
            commandIsRunning = false;
            return callback(e);
        }

        if (!result || typeof result.then !== 'function') {
            commandIsRunning = false;
            return callback(null, result);
        }

        var timeout = setTimeout(function () {
            return callback(new _ErrorHandler.RuntimeError('Command execution timed out'));
        }, commandTimeout);
        result.then(function (res) {
            commandIsRunning = false;
            clearTimeout(timeout);
            return callback(null, res);
        }, function (e) {
            commandIsRunning = false;
            clearTimeout(timeout);
            return callback(e);
        });
    };

    var replServer = _repl2.default.start({
        prompt: '> ',
        eval: myEval,
        input: process.stdin,
        output: process.stdout,
        useGlobal: true,
        ignoreUndefined: true
    });

    return new _promise2.default(function (resolve) {
        replServer.on('exit', function () {
            _this.logger.logLevel = logLevel;
            resolve();
        });
    });
}; /**
    *
    * This command helps you to debug your integration tests. It stops the running browser and gives
    * you time to jump into it and check the state of your application (e.g. using the dev tools).
    * Your terminal transforms into a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)
    * interface that will allow you to try out certain commands, find elements and test actions on
    * them.
    *
    * [![WebdriverIO REPL](http://webdriver.io/images/repl.gif)](http://webdriver.io/images/repl.gif)
    *
    * If you run the WDIO testrunner make sure you increase the timeout property of your test framework
    * your are using (e.g. Mocha or Jasmine) in order to prevent the continuation due to a test timeout.
    * Also avoid to execute the command with multiple capabilities running at the same time.
    *
    * <iframe width="560" height="315" src="https://www.youtube.com/embed/xWwP-3B_YyE" frameborder="0" allowfullscreen></iframe>
    *
    * <example>
       :debug.js
       it('should demonstrate the debug command', function () {
           browser.setValue('#input', 'FOO')
   
           browser.debug() // jumping into the browser and change value of #input to 'BAR'
   
           var value = browser.getValue('#input')
           console.log(value) // outputs: "BAR"
       })
    * </example>
    *
    * @alias browser.debug
    * @type utility
    *
    */

exports.default = debug;
module.exports = exports['default'];
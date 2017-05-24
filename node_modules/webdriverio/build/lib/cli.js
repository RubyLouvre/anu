'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _npmInstallPackage = require('npm-install-package');

var _npmInstallPackage2 = _interopRequireDefault(_npmInstallPackage);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _launcher = require('./launcher');

var _launcher2 = _interopRequireDefault(_launcher);

var _ = require('../');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 💌 Dear contributors 💌
 * ========================================================================
 * If you are awesome and have created a new reporter, service or framework
 * adaption feel free to add it to this list and make a PR so people know
 * that your add-on is available and supported. Thanks, you 🚀!
 * ========================================================================
 */
var SUPPORTED_FRAMEWORKS = ['mocha', // https://github.com/webdriverio/wdio-mocha-framework
'jasmine', // https://github.com/webdriverio/wdio-jasmine-framework
'cucumber' // https://github.com/webdriverio/wdio-cucumber-framework
];
var SUPPORTED_REPORTER = [' dot - https://github.com/webdriverio/wdio-dot-reporter', ' spec - https://github.com/webdriverio/wdio-spec-reporter', ' junit - https://github.com/webdriverio/wdio-junit-reporter', ' allure - https://github.com/webdriverio/wdio-allure-reporter', ' teamcity - https://github.com/sullenor/wdio-teamcity-reporter', ' json - https://github.com/fijijavis/wdio-json-reporter', ' concise - https://github.com/FloValence/wdio-concise-reporter'];
var SUPPORTED_SERVICES = [' sauce - https://github.com/webdriverio/wdio-sauce-service', ' browserstack - https://github.com/itszero/wdio-browserstack-service', ' testingbot - https://github.com/testingbot/wdio-testingbot-service', ' appium - https://github.com/rhysd/wdio-appium-service', ' firefox-profile - https://github.com/webdriverio/wdio-firefox-profile-service', ' selenium-standalone - https://github.com/webdriverio/wdio-selenium-standalone-service', ' phantomjs - https://github.com/cognitom/wdio-phantomjs-service', ' static-server - https://github.com/LeadPages/wdio-static-server-service', ' visual-regression - https://github.com/zinserjan/wdio-visual-regression-service', ' webpack - https://github.com/leadpages/wdio-webpack-service', ' webpack-dev-server - https://gitlab.com/Vinnl/wdio-webpack-dev-server-service'];

var VERSION = _package2.default.version;
var ALLOWED_ARGV = ['host', 'port', 'path', 'user', 'key', 'logLevel', 'coloredLogs', 'screenshotPath', 'baseUrl', 'waitforTimeout', 'framework', 'reporters', 'suite', 'spec', 'cucumberOpts', 'jasmineOpts', 'mochaOpts', 'connectionRetryTimeout', 'connectionRetryCount', 'watch'];

_optimist2.default.usage('WebdriverIO CLI runner\n\n' + 'Usage: wdio [options] [configFile]\n' + 'Usage: wdio config\n' + 'Usage: wdio repl [browserName]\n' + 'config file defaults to wdio.conf.js\n' + 'The [options] object will override values from the config file.').describe('help', 'prints WebdriverIO help menu').alias('help', 'h').describe('version', 'prints WebdriverIO version').alias('version', 'v').describe('host', 'Selenium server host address').describe('port', 'Selenium server port').describe('path', 'Selenium server path (default: /wd/hub)').describe('user', 'username if using a cloud service as Selenium backend').alias('user', 'u').describe('key', 'corresponding access key to the user').alias('key', 'k').describe('watch', 'watch specs for changes').describe('logLevel', 'level of logging verbosity (default: silent)').alias('logLevel', 'l').describe('coloredLogs', 'if true enables colors for log output (default: true)').alias('coloredLogs', 'c').describe('bail', 'stop test runner after specific amount of tests have failed (default: 0 - don\'t bail)').describe('screenshotPath', 'saves a screenshot to a given path if a command fails').alias('screenshotPath', 's').describe('baseUrl', 'shorten url command calls by setting a base url').alias('baseUrl', 'b').describe('waitforTimeout', 'timeout for all waitForXXX commands (default: 1000ms)').alias('waitforTimeout', 'w').describe('framework', 'defines the framework (Mocha, Jasmine or Cucumber) to run the specs (default: mocha)').alias('framework', 'f').describe('reporters', 'reporters to print out the results on stdout').alias('reporters', 'r').describe('suite', 'overwrites the specs attribute and runs the defined suite').describe('spec', 'run only a certain spec file').describe('cucumberOpts.*', 'Cucumber options, see the full list options at https://github.com/webdriverio/wdio-cucumber-framework#cucumberopts-options').describe('jasmineOpts.*', 'Jasmine options, see the full list options at https://github.com/webdriverio/wdio-jasmine-framework#jasminenodeopts-options').describe('mochaOpts.*', 'Mocha options, see the full list options at http://mochajs.org').string(['host', 'path', 'user', 'key', 'logLevel', 'screenshotPath', 'baseUrl', 'framework', 'reporters', 'suite', 'spec']).boolean(['coloredLogs', 'watch']).default({ coloredLogs: true }).check(function (arg) {
    if (arg._.length > 1 && arg._[0] !== 'repl') {
        throw new Error('Error: more than one config file specified');
    }
});

var argv = _optimist2.default.parse(process.argv.slice(2));

if (argv.help) {
    _optimist2.default.showHelp();
    process.exit(0);
}

if (argv.version) {
    console.log('v' + VERSION);
    process.exit(0);
}

/**
 * use wdio.conf.js default file name if no config was specified
 * otherwise run config sequenz
 */
var configFile = argv._[0];
if (!configFile) {
    if (_fs2.default.existsSync('./wdio.conf.js')) {
        configFile = './wdio.conf.js';
    } else {
        argv._[0] = 'config';
    }
}

var configMode = false;
if (argv._[0] === 'config') {
    configMode = true;
    console.log('\n=========================\nWDIO Configuration Helper\n=========================\n');
    _inquirer2.default.prompt([{
        type: 'list',
        name: 'backend',
        message: 'Where do you want to execute your tests?',
        choices: ['On my local machine', 'In the cloud using Sauce Labs, Browserstack or Testingbot', 'In the cloud using a different service', 'I have my own Selenium cloud']
    }, {
        type: 'input',
        name: 'host',
        message: 'What is the host address of that cloud service?',
        when: function when(answers) {
            return answers.backend.indexOf('different service') > -1;
        }
    }, {
        type: 'input',
        name: 'port',
        message: 'What is the port on which that service is running?',
        default: '80',
        when: function when(answers) {
            return answers.backend.indexOf('different service') > -1;
        }
    }, {
        type: 'input',
        name: 'env_user',
        message: 'Environment variable for username',
        default: 'SAUCE_USERNAME',
        when: function when(answers) {
            return answers.backend.indexOf('In the cloud') > -1;
        }
    }, {
        type: 'input',
        name: 'env_key',
        message: 'Environment variable for access key',
        default: 'SAUCE_ACCESS_KEY',
        when: function when(answers) {
            return answers.backend.indexOf('In the cloud') > -1;
        }
    }, {
        type: 'input',
        name: 'host',
        message: 'What is the IP or URI to your Selenium standalone server?',
        default: '0.0.0.0',
        when: function when(answers) {
            return answers.backend.indexOf('own Selenium cloud') > -1;
        }
    }, {
        type: 'input',
        name: 'port',
        message: 'What is the port which your Selenium standalone server is running on?',
        default: '4444',
        when: function when(answers) {
            return answers.backend.indexOf('own Selenium cloud') > -1;
        }
    }, {
        type: 'input',
        name: 'path',
        message: 'What is the path to your Selenium standalone server?',
        default: '/wd/hub',
        when: function when(answers) {
            return answers.backend.indexOf('own Selenium cloud') > -1;
        }
    }, {
        type: 'list',
        name: 'framework',
        message: 'Which framework do you want to use?',
        choices: SUPPORTED_FRAMEWORKS
    }, {
        type: 'confirm',
        name: 'installFramework',
        message: 'Shall I install the framework adapter for you?',
        default: true
    }, {
        type: 'input',
        name: 'specs',
        message: 'Where are your test specs located?',
        default: './test/specs/**/*.js',
        when: function when(answers) {
            return answers.framework.match(/(mocha|jasmine)/);
        }
    }, {
        type: 'input',
        name: 'specs',
        message: 'Where are your feature files located?',
        default: './features/**/*.feature',
        when: function when(answers) {
            return answers.framework === 'cucumber';
        }
    }, {
        type: 'input',
        name: 'stepDefinitions',
        message: 'Where are your step definitions located?',
        default: './features/step-definitions',
        when: function when(answers) {
            return answers.framework === 'cucumber';
        }
    }, {
        type: 'checkbox',
        name: 'reporters',
        message: 'Which reporter do you want to use?',
        choices: SUPPORTED_REPORTER,
        filter: function filter(reporters) {
            return reporters.map(function (reporter) {
                return 'wdio-' + reporter.split(/-/)[0].trim() + '-reporter';
            });
        }
    }, {
        type: 'confirm',
        name: 'installReporter',
        message: 'Shall I install the reporter library for you?',
        default: true,
        when: function when(answers) {
            return answers.reporters.length > 0;
        }
    }, {
        type: 'checkbox',
        name: 'services',
        message: 'Do you want to add a service to your test setup?',
        choices: SUPPORTED_SERVICES,
        filter: function filter(services) {
            return services.map(function (service) {
                return 'wdio-' + service.split(/- /)[0].trim() + '-service';
            });
        }
    }, {
        type: 'confirm',
        name: 'installServices',
        message: 'Shall I install the services for you?',
        default: true,
        when: function when(answers) {
            return answers.services.length > 0;
        }
    }, {
        type: 'input',
        name: 'outputDir',
        message: 'In which directory should the xunit reports get stored?',
        default: './',
        when: function when(answers) {
            return answers.reporters === 'junit';
        }
    }, {
        type: 'input',
        name: 'outputDir',
        message: 'In which directory should the json reports get stored?',
        default: './',
        when: function when(answers) {
            return answers.reporters === 'json';
        }
    }, {
        type: 'list',
        name: 'logLevel',
        message: 'Level of logging verbosity',
        default: 'silent',
        choices: ['silent', 'verbose', 'command', 'data', 'result', 'error']
    }, {
        type: 'input',
        name: 'screenshotPath',
        message: 'In which directory should screenshots gets saved if a command fails?',
        default: './errorShots/'
    }, {
        type: 'input',
        name: 'baseUrl',
        message: 'What is the base url?',
        default: 'http://localhost'
    }]).then(function (answers) {
        var packagesToInstall = [];
        if (answers.installFramework) {
            packagesToInstall.push('wdio-' + answers.framework + '-framework');
        }
        if (answers.installReporter) {
            packagesToInstall = packagesToInstall.concat(answers.reporters);
        }
        if (answers.installServices) {
            packagesToInstall = packagesToInstall.concat(answers.services);
        }

        if (packagesToInstall.length > 0) {
            console.log('\nInstalling wdio packages:');
            return (0, _npmInstallPackage2.default)(packagesToInstall, { saveDev: true }, function (err) {
                if (err) {
                    throw err;
                }

                console.log('\nPackages installed successfully, creating configuration file...');
                renderConfigurationFile(answers);
            });
        }

        renderConfigurationFile(answers);
        process.exit(0);
    });
}

function renderConfigurationFile(answers) {
    var tpl = _fs2.default.readFileSync(_path2.default.join(__dirname, '/helpers/wdio.conf.ejs'), 'utf8');
    var renderedTpl = _ejs2.default.render(tpl, {
        answers: answers
    });
    _fs2.default.writeFileSync(_path2.default.join(process.cwd(), 'wdio.conf.js'), renderedTpl);
    console.log('\nConfiguration file was created successfully!\nTo run your tests, execute:\n\n$ wdio wdio.conf.js\n');
}

/**
 * sanitize reporters
 */
if (argv.reporters) {
    argv.reporters = argv.reporters.split(',');
}

/**
 * sanitize cucumberOpts
 */
if (argv.cucumberOpts) {
    if (argv.cucumberOpts.tags) {
        argv.cucumberOpts.tags = argv.cucumberOpts.tags.split(',');
    }
    if (argv.cucumberOpts.ignoreUndefinedDefinitions) {
        argv.cucumberOpts.ignoreUndefinedDefinitions = argv.cucumberOpts.ignoreUndefinedDefinitions === 'true';
    }
    if (argv.cucumberOpts.require) {
        argv.cucumberOpts.require = argv.cucumberOpts.require.split(',');
    }
}

/**
 * sanitize jasmineOpts
 */
if (argv.jasmineOpts && argv.jasmineOpts.defaultTimeoutInterval) {
    argv.jasmineOpts.defaultTimeoutInterval = parseInt(argv.jasmineOpts.defaultTimeoutInterval, 10);
}

/**
 * sanitize mochaOpts
 */
if (argv.mochaOpts) {
    if (argv.mochaOpts.timeout) {
        argv.mochaOpts.timeout = parseInt(argv.mochaOpts.timeout, 10);
    }
    if (argv.mochaOpts.compilers) {
        argv.mochaOpts.compilers = argv.mochaOpts.compilers.split(',');
    }
    if (argv.mochaOpts.require) {
        argv.mochaOpts.require = argv.mochaOpts.require.split(',');
    }
}

var args = {};
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = (0, _getIterator3.default)(ALLOWED_ARGV), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (argv[key] !== undefined) {
            args[key] = argv[key];
        }
    }

    /**
     * start repl when command is "repl"
     */
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

if (argv._[0] === 'repl') {
    var browser = argv._[1] || 'firefox';
    var client = (0, _.remote)((0, _deepmerge2.default)(args, {
        sync: true,
        desiredCapabilities: {
            browserName: browser
        }
    })).init().catch(function (e) {
        client.logger.logLevel = 'verbose';
        client.logger.error(e);
        throw e;
    });

    /**
     * try to enhance client object using wdio-sync (if installed). This enables a better API
     * handling due to the result enhancements done by wdio-sync
     */
    try {
        var sync = require('wdio-sync');
        global.browser = { options: { sync: true } };
        sync.wrapCommands(client, [], []);
        global.$ = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return client.element.apply(client, args);
        };
        global.$$ = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return client.elements.apply(client, args).value;
        };
        global.browser = client;
    } catch (e) {}

    client.debug().end().then(function () {
        return process.exit(0);
    }, function (e) {
        throw e;
    });

    /**
     * run launch sequence if config command wasn't called
     */
} else if (!configMode) {
    var launcher = new _launcher2.default(configFile, args);
    launcher.run().then(function (code) {
        return process.exit(code);
    }, function (e) {
        return process.nextTick(function () {
            throw e;
        });
    });
}
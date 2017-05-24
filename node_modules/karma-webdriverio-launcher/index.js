var webdriverio = require('webdriverio');
var urlparse = require('url').parse;
var urlformat = require('url').format;

var WebDriverInstance = function (baseBrowserDecorator, args, logger) {
  var log = logger.create('WebDriverio');

  var config = args.config || {
    hostname: '127.0.0.1',
    port: 4444
  };
  var self = this;

  // Intialize with default values
  var spec = {
    platform: 'ANY',
    testName: 'Karma test',
    tags: [],
    version: ''
  };

  Object.keys(args).forEach(function (key) {
    var value = args[key];
    switch (key) {
    case 'browserName':
      break;
    case 'platform':
      break;
    case 'testName':
      break;
    case 'tags':
      break;
    case 'version':
      break;
    case 'config':
      // ignore
      return;
    }
    spec[key] = value;
  });

  if (!spec.browserName) {
    throw new Error('browserName is required!');
  }

  baseBrowserDecorator(this);

  this.name = spec.browserName + ' via Remote WebDriver';

  // Handle x-ua-compatible option same as karma-ie-launcher(copy&paste):
  //
  // Usage :
  //   customLaunchers: {
  //     IE9: {
  //       base: 'WebDriver',
  //       config: webdriverConfig,
  //       browserName: 'internet explorer',
  //       'x-ua-compatible': 'IE=EmulateIE9'
  //     }
  //   }
  //
  // This is done by passing the option on the url, in response the Karma server will
  // set the following meta in the page.
  //   <meta http-equiv="X-UA-Compatible" content="[VALUE]"/>
  function handleXUaCompatible(args, urlObj) {
    if (args['x-ua-compatible']) {
      urlObj.query['x-ua-compatible'] = args['x-ua-compatible'];
    }
  }

  this._start = function (url) {
    var urlObj = urlparse(url, true);

    handleXUaCompatible(spec, urlObj);

    delete urlObj.search; //url.format does not want search attribute
    url = urlformat(urlObj);

    log.debug('WebDriver config: ' + JSON.stringify(config));
    log.debug('Browser capabilities: ' + JSON.stringify(spec));

    self.driver = webdriverio.remote(config, 'promiseChain');
    self.browser = self.driver.init(spec);

    var interval = args.pseudoActivityInterval && setInterval(function() {
      log.debug('Imitate activity');
      self.browser.title();
    }, args.pseudoActivityInterval);

    self.browser
        .url(url);

    self._process = {
      kill: function() {
        interval && clearInterval(interval);
        var exitProcess = function() {
           clearTimeout(timer);
           log.info('Killed ' + spec.testName + '.');
           self._onProcessExit(self.error ? -1 : 0, self.error);
        },
        timer;
        self.browser.end().then(exitProcess);
        timer = setTimeout(exitProcess, 500);
      }
    };
  };

  // We can't really force browser to quit so just avoid warning about SIGKILL
  this._onKillTimeout = function(){};
};

WebDriverInstance.prototype = {
  name: 'WebDriverio',

  DEFAULT_CMD: {
    linux: require('webdriverio').path,
    darwin: require('webdriverio').path,
    win32: require('webdriverio').path
  },
  ENV_CMD: 'WEBDRIVER_BIN'
};

WebDriverInstance.$inject = ['baseBrowserDecorator', 'args', 'logger'];

// PUBLISH DI MODULE
module.exports = {
  'launcher:WebDriverio': ['type', WebDriverInstance]
};

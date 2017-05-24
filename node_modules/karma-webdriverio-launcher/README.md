karma-webdriverio-launcher
========================

A plugin for Karma 0.12 to launch Remote WebDriver instances

This project is forked from [karma-webdriver-launcher](https://github.com/karma-runner/karma-webdriver-launcher), and I just use [webdriverio](http://webdriver.io/) insted of wd to start browser.

## Usage

```bash
$ //npm install karma-webdriverio-launcher
$ npm install git+ssh://git@github.com:gogoyqj/karma-webdriver-launcher.git
```

In your karma.conf.js file (e.g. using SauceLabs Connect - you need to have a scout tunnel open for this to work!):

```js
module.exports = function(karma) {

  var webdriverConfig = {
    hostname: 'ondemand.saucelabs.com',
    port: 80,
    user: 'USERNAME',
    pwd: 'APIKEY'
  }


  ...

    config.set({

      ...

      customLaunchers: {
        'IE7': {
          base: 'WebDriverio',
          config: webdriverConfig,
          browserName: 'internet explorer',
          platform: 'Windows XP',
          version: '10',
          'x-ua-compatible': 'IE=EmulateIE7',
          name: 'Karma',
          pseudoActivityInterval: 30000
        }
      },

      browsers: ['IE7'],

      ...

    });


```

### pseudoActivityInterval
Interval in ms to do some activity to avoid killing session by timeout.

If not set or set to `0` - no activity will be performed.


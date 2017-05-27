var selenium = require('selenium-standalone');

selenium.install({
  // check for more recent versions of selenium here:
  // https://selenium-release.storage.googleapis.com/index.html
  baseURL: 'https://selenium-release.storage.googleapis.com',
  drivers: {
    chrome: {
      // check for more recent versions of chrome driver here:
      // https://chromedriver.storage.googleapis.com/index.html
      version: '2.27',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com'
    }
  }
}, function (err) {
  if (err) {
    console.warn(err)
  } else {
    console.log('安装成功')
  }
// node 
// node node_modules/karma-event-driver-ext

});


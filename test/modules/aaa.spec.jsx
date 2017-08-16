import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'

describe('临时测试模块', function () {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });

  var body = document.body, div
  beforeEach(function () {
    div = document.createElement('div')
    body.appendChild(div)
  })
  afterEach(function () {
    body.removeChild(div)

  })

  

})
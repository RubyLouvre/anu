import eventHook, { beforeHook, afterHook, runCommand } from 'karma-event-driver-ext/cjs/event-drivers-hooks.js';


var chai = require('chai');
var expect = chai.expect;
describe('Event Drive Tests', function() {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('click element', async() => {
        console.log('-----')
        var div = document.createElement('div');
        div.id = "DIV"
        document.body.appendChild(div);
        div.innerHTML = '看到我吗？'
        var a = 1;
        div.onclick = function() {
            a++

        };
        await runCommand((browser) => {
            browser.pause(500);
            browser.moveTo(document.body, 0, 0);
            browser.click(div); // most webdriverio api support. http://webdriver.io/api.html
        });



    });
});
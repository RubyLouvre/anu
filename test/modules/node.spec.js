import eventHook, { beforeHook, afterHook, runCommand } from 'karma-event-driver-ext/cjs/event-drivers-hooks.js';
describe('Event Drive Tests', function() {
    // increase timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000
        //  this.timeout(200000);
    beforeAll(async(done) => {
        await beforeHook();
        done()
    });
    afterAll(async() => {
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

        expect(a).toBe(2);
        //  done()
        return new Promise(function(r) {
            setTimeout(function() {
                r()
                done()
            }, 3000)
        })

    });
});
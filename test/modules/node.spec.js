import eventHook, { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
let { $serial } = browser;

describe('Event Drive Tests', function() {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('click element', async() => {
        var div = document.createElement('div');

        document.body.appendChild(div);
        div.innerHTML = '看到我吗？'
        var a = 1;
        div.onclick = function() {
            a++
            browser.$next();
        };

        await browser
            .click(div)
            .$apply('wait');
        expect(a).toBe(2);

        await browser
            .click(div)
            .$apply('wait');

        expect(a).toBe(3);
    });
});
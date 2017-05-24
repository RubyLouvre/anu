import { beforeHook, beforeEachHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
let { $serial } = browser;
describe('Event Drive Tests', function() {
    // increase timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000;

    beforeAll((done) => {
        beforeHook(done);
    });
    
    afterAll((done) => {
        afterHook(done);
    });

    beforeEach(() => {
        beforeEachHook();
    });

    it('Simple Demo', (done) => {
        var div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = 'Click Me';
        var a = 1;
        div.onclick = function() {
            a++
        };
        await browser
            .click(div)
            .$apply();
        expect(a).toBe(2);
        done();
    });

    it('Async Demo', (done) => {
        var div = document.createElement('div');
        div.innerHTML = 'Click Me';
        var a = 1;
        div.onclick = function() {
            a++;
            setTimeout(() => {
                a++;
                browser.$next();
            }, 500);
        };
        document.body.appendChild(div);

        await browser
            .click(div)
            .$apply('applyAndWaitForNext'); // equal to .$applyAndWaitForNext();
        expect(a).toBe(3);
        done();
    });

    it('React Like Demo', (done) => {
        var div = document.createElement('div');
        div.innerHTML = 'Click Me';
        var a = 1;
        div.onclick = function() {
            a++;
            setTimeout(() => {
                a++;
                browser.$next();
            }, 500);
        };
        let render = () => {
            document.body.appendChild(div);
            browser.$next(); // start $serial
        }

        // return a promise
        // won't start executing util browser.$next is called
        $serial(
            async () => {
                await browser
                    .click(div)
                    .$apply('applyAndWaitForNext'); // equal to .$applyAndWaitForNext()
                expect(a).toBe(3);
            },
            async () => {
                await browser
                    .click(div)
                    .$apply('applyAndWaitForNext'); // equal to .$applyAndWaitForNext()
                expect(a).toBe(5);
                done(); // end 'it'
            }
        ); // .then(done, done);
        
        // before or after $serial both works
        render();
    });
    
});

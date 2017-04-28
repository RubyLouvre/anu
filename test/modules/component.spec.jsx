import eventHook, {beforeHook, afterHook, browser} from 'karma-event-driver-ext/cjs/event-driver-hooks';
let {$serial} = browser;
import React from 'src/React'

describe('无狀态组件', function () {
    this.timeout(200000);
    before(async() => {
        await beforeHook();
    });
    after(async() => {
        await afterHook(false);
    });
    it('stateless', async() => {
        function HelloComponent(props,
        /* context */) {
            return <div onClick={() => props.name = 11}>Hello {props.name}</div>
        }
        var div = document.createElement('div');

        document
            .body
            .appendChild(div);
        var s = React.render(<HelloComponent name="Sebastian"/>, div)

        await browser
            .pause(200)
            .$apply()
console.log(s.type,'!!!')
        expect(s.vnode.dom.innerHTML).toBe('Hello Sebastian')

        document
            .body
            .removeChild(div)
    });

})
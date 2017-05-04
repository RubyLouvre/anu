import {
    beforeHook,
    afterHook,
    browser
} from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'src/React'
var Redux = require('../redux')

describe('Redux', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    })
    var body = document.body,
        div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)

    })
    it('Counter', async () => {
        class Counter extends React.Component {
            render() {
                return <div>
                    <h1 ref='value'>{this.props.value}</h1>
                    <button ref='a' onClick={this.props.onIncrement}>+</button>&nbsp;
                    <button ref='b' onClick={this.props.onDecrement}>-</button>
                </div>
            }
        };

        const reducer = (state = 0, action) => {
            switch (action.type) {
                case 'INCREMENT': return state + 1;
                case 'DECREMENT': return state - 1;
                default: return state;
            }
        };

        const store = Redux.createStore(reducer);
        function onIncrement() {
            store.dispatch({ type: 'INCREMENT' })
        }
        function onDecrement() {
            store.dispatch({ type: 'DECREMENT' })
        }

        const render = () => {
            return ReactDOM.render(
                <Counter
                    value={store.getState()}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                />,
                div
            );
        };

        var s = render();
        store.subscribe(render)
        await browser
            .pause(100)
            .$apply()
        expect(s.refs.value.innerHTML).toBe('0')
        await browser.click(s.refs.a)
            .pause(100)
            .$apply()
        expect(s.refs.value.innerHTML).toBe('1')
        await browser.click(s.refs.a)
            .pause(100)
            .$apply()
        expect(s.refs.value.innerHTML).toBe('2')
        await browser.click(s.refs.b)
            .pause(100)
            .$apply()
        expect(s.refs.value.innerHTML).toBe('1')
    })

})